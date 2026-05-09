package com.financial.stockapp.service.Impl;

import com.financial.stockapp.dto.request.RegisterRequestDTO;
import com.financial.stockapp.dto.response.LoginResponse;
import com.financial.stockapp.dto.response.UserInfoResponse;
import com.financial.stockapp.entity.CustomUserDetails;
import com.financial.stockapp.entity.Role;
import com.financial.stockapp.entity.User;
import com.financial.stockapp.entity.UserLoginHistory;
import com.financial.stockapp.entity.enums.Enum;
import com.financial.stockapp.exception.InvalidGoogleTokenException;
import com.financial.stockapp.exception.UserAlreadyExist;
import com.financial.stockapp.repository.IRoleRepository;
import com.financial.stockapp.repository.IUserLoginHistoryRepository;
import com.financial.stockapp.repository.IUserRepository;
import com.financial.stockapp.util.JwtUtils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import static com.financial.stockapp.util.SecurityUtils.parseDevice;

@Slf4j  // ← thêm dòng này
@Service
@RequiredArgsConstructor
public class AuthService {
    private final RedisTemplate<String, Object> redisTemplate; // Dùng cái bạn đã config JSON ấy
    private final MailService emailService;
    private final PasswordEncoder encoder;
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final IUserLoginHistoryRepository userLoginHistoryRepository;
    private final JwtUtils jwtUtils;
    @Value("${google.client-id}")
    private  String GOOGLE_CLIENT_ID;

    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d",new Random().nextInt(999999));
        String key = "OTP" + email;
        redisTemplate.opsForValue().set(key,otp,3,  TimeUnit.MINUTES);
        emailService.sentOPTMail(email,otp);
    }

    public void verifyOtp(String email,String password, String otp) {
        String key = "OTP" + email; // Key đã lưu trước đó
        Object redisOtp = redisTemplate.opsForValue().get(key);
        if(redisOtp == null){
            throw new RuntimeException("OTP đã hết hạn");
        }
        if (!otp.equals(redisOtp.toString())) {
            log.info("Mã OTP"+ otp);
            log.info("Mã OTP redis"+ redisOtp);
            throw new RuntimeException("OTP không đúng");
        }

        redisTemplate.delete(key);
        User user = userRepository.findUserByEmail(email);
        if(user != null){
            throw new UserAlreadyExist(null);
        }
        user = User.builder()
                .email(email)
                .username(email)
                .password(encoder.encode(password))
                .role(roleRepository.findByName("USER"))
                .authProvider("LOCAL")
                .build();
        userRepository.save(user);

    }

    public LoginResponse loginGoogle(String credential, HttpServletRequest request) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(
                        new NetHttpTransport(),
                        GsonFactory.getDefaultInstance()
                )
                        .setAudience(Collections.singletonList(
                                GOOGLE_CLIENT_ID
                        ))
                        .build();

        GoogleIdToken idToken =
                verifier.verify(credential);

        if (idToken == null) {
            throw new InvalidGoogleTokenException("Không tim thấy id google");
        }
        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String googleId = payload.getSubject();
        log.info("email" + email);
        log.info("name: "+name);
        log.info("googleId: "+googleId);
        Role role = roleRepository.findByName("USER");
        User user = userRepository
                .findByGoogleId(googleId)
                .orElseGet(() -> {
                    // check email đã tồn tại chưa
                    User existingUser = userRepository.findUserByEmail(email);
                    if (existingUser != null) {
                        existingUser.setProviderId(googleId);
                        return userRepository.save(existingUser);
                    }
                    // tạo account mới
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(name);
                    newUser.setProviderId(googleId);
                    newUser.setUsername(name);
                    newUser.setRole(role);
                    return userRepository.save(newUser);
                });
        String device = parseDevice(request.getHeader("User-Agent"));

        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr(); // Fallback lấy IP trực tiếp
        }
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String accessToken =  jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        UserLoginHistory history = UserLoginHistory.builder()
                .user(user)
                .ipAddress(ipAddress)
                .device(device)
                .status("SUCCESS")
                .build();
        userLoginHistoryRepository.save(history);
        UserInfoResponse rs = UserInfoResponse.builder()
                .id(user.getId())
                .user_name(user.getFullName())
                .avatar_url(user.getAvatarUrl())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .build();

        LoginResponse response = LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(86400)
                .userInfoResponse(rs)
                .tokenType("Bearer")
                .build();
        return response;
    }
}