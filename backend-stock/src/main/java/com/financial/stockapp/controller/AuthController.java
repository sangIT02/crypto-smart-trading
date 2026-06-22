package com.financial.stockapp.controller;


import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.request.GoogleLoginRequest;
import com.financial.stockapp.dto.request.RegisterRequestDTO;
import com.financial.stockapp.dto.request.UserLoginRequest;
import com.financial.stockapp.dto.response.LoginResponse;
import com.financial.stockapp.service.IUserService;
import com.financial.stockapp.service.Impl.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;

@RestController
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
public class AuthController {
    private final IUserService userService;
    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody UserLoginRequest dto, HttpServletRequest request){
        LoginResponse userInfoResponse = userService.login(dto, request);
        return ApiResponse.success(userInfoResponse);
    }


    @PostMapping("/register")
    public ApiResponse<?> register(@RequestBody RegisterRequestDTO dto){
        authService.register(dto);
        return ApiResponse.success("success", "dang ki thanh cong");
    }

    @PostMapping("/google")
    public ApiResponse<LoginResponse> loginGoogle(@RequestBody GoogleLoginRequest request, HttpServletRequest httprequest) throws GeneralSecurityException, IOException {
        return ApiResponse.success(authService.loginGoogle(request.getToken(),httprequest));
    }


}
