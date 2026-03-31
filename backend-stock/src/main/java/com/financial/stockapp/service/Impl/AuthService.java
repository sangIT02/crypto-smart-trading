package com.financial.stockapp.service.Impl;

import com.financial.stockapp.dto.request.RegisterRequestDTO;
import com.financial.stockapp.entity.User;
import com.financial.stockapp.entity.enums.Enum;
import com.financial.stockapp.exception.UserAlreadyExist;
import com.financial.stockapp.repository.IRoleRepository;
import com.financial.stockapp.repository.IUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.TimeUnit;
@Slf4j  // ← thêm dòng này
@Service
@RequiredArgsConstructor
public class AuthService {
    private final RedisTemplate<String, Object> redisTemplate; // Dùng cái bạn đã config JSON ấy
    private final MailService emailService;
    private final PasswordEncoder encoder;
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;

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

}