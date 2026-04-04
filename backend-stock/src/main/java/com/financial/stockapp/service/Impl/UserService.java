package com.financial.stockapp.service.Impl;

import com.financial.stockapp.dto.request.UserLoginRequest;
import com.financial.stockapp.dto.response.LoginResponse;
import com.financial.stockapp.dto.response.UserInfoResponse;
import com.financial.stockapp.entity.CustomUserDetails;
import com.financial.stockapp.entity.User;
import com.financial.stockapp.exception.PasswordNotCorrectException;
import com.financial.stockapp.exception.UserNotFoundException;
import com.financial.stockapp.repository.IUserRepository;
import com.financial.stockapp.service.IUserService;
import com.financial.stockapp.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final IUserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;


    // đăng nhập
    public LoginResponse login(UserLoginRequest dto) {
        User user = userRepository.findUserByEmail(dto.getEmail());
        if(user == null){
            throw new UserNotFoundException("User chưa tồn tại");
        }
        boolean isMatch = encoder.matches(dto.getPassword(), user.getPassword());
        if(!isMatch){
            throw new PasswordNotCorrectException("Mật khẩu không chính xác");
        }
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

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


}
