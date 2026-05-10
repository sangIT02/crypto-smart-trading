package com.financial.stockapp.service.Impl;

import com.financial.stockapp.dto.request.UserLoginRequest;
import com.financial.stockapp.dto.response.*;
import com.financial.stockapp.entity.CustomUserDetails;
import com.financial.stockapp.entity.User;
import com.financial.stockapp.entity.UserLoginHistory;
import com.financial.stockapp.exception.PasswordNotCorrectException;
import com.financial.stockapp.exception.UserNotFoundException;
import com.financial.stockapp.repository.IUserLoginHistoryRepository;
import com.financial.stockapp.repository.IUserRepository;
import com.financial.stockapp.repository.projection.LoginHistoryProjection;
import com.financial.stockapp.repository.projection.TotalUserPermonthDto;
import com.financial.stockapp.repository.projection.TotalUserProjection;
import com.financial.stockapp.service.IUserService;
import com.financial.stockapp.util.JwtUtils;
import com.financial.stockapp.util.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final IUserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final IUserLoginHistoryRepository userLoginHistoryRepository;
    // đăng nhập

    public LoginResponse login(UserLoginRequest dto, HttpServletRequest request) {
        User user = userRepository.findUserByEmail(dto.getEmail());
        if(user == null){
            throw new UserNotFoundException("User chưa tồn tại");
        }
        boolean isMatch = encoder.matches(dto.getPassword(), user.getPassword());
        String device = SecurityUtils.parseDevice(request.getHeader("User-Agent"));
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr(); // Fallback lấy IP trực tiếp
        }

        // 2. Logic check đăng nhập...
        String status = isMatch ? "SUCCESS" : "FAILED";
        if(!isMatch){
            UserLoginHistory loginHistory = UserLoginHistory.builder()
                    .status(status)
                    .device(device)
                    .ipAddress(ipAddress)
                    .user(user)
                    .build();
            userLoginHistoryRepository.save(loginHistory);
            throw new PasswordNotCorrectException("Mật khẩu không chính xác");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        UserLoginHistory history = UserLoginHistory.builder()
                .user(user)
                .ipAddress(ipAddress)
                .device(device)
                .status(status)
                .build();
        userLoginHistoryRepository.save(history);
        UserInfoResponse rs = UserInfoResponse.builder()
                .id(user.getId())
                .user_name(user.getFullName())
                .avatar_url(user.getAvatarUrl())
                .email(user.getEmail())
                .build();

        LoginResponse response = LoginResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .expiresIn(86400)
                .userInfoResponse(rs)
                .tokenType("Bearer")
                .build();
        log.info(token +"refesh:"+refreshToken);
        return response;
    }




    public List<LoginHistoryProjection> getLoginHistoryByUserId(){
        int userId = SecurityUtils.getCurrentUserId();
        List<LoginHistoryProjection> res = userLoginHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return res;
    }

    public CountUserResponse countUser(){
        long totalUser = userRepository.countTotalUser();
        long activeUser = userRepository.countActiveUser();
        return new CountUserResponse(totalUser,activeUser);
    }

    public Page<TotalUserProjection> getAllUsers(int page, int size){
        Pageable pageable = PageRequest.of(page,size);
        Page<TotalUserProjection> response = userRepository.getAllUser(pageable);
        return response;
    }


    @Transactional
    public void updateUserStatus(int userId) {
        User user = userRepository.findById((long) userId);
        if(user == null) throw new UserNotFoundException("");
        // 2. Chống lỗi NullPointerException nếu isActive đang là null trong DB
        boolean currentStatus = user.getIsActive() != null ? user.getIsActive() : false;

        // 3. Đảo ngược trạng thái và set lại
        user.setIsActive(!currentStatus);
        userRepository.save(user);
    }

    public List<TotalUserPermonthDto> getTotalUserPerMonth(){
        return userRepository.getTotalUserPermonth();
    }

}
