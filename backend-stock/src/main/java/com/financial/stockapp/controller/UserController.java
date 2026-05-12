package com.financial.stockapp.controller;

import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.request.UserLoginRequest;
import com.financial.stockapp.dto.request.VerifyOtpDto;
import com.financial.stockapp.dto.response.DashboardInfoResponse;
import com.financial.stockapp.repository.projection.LoginHistoryProjection;
import com.financial.stockapp.dto.response.LoginResponse;
import com.financial.stockapp.service.IUserService;
import com.financial.stockapp.service.Impl.AuthService;
import com.financial.stockapp.service.Impl.CoinService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.A;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final IUserService userService;
    private final CoinService coinService;

    @PostMapping("/sent-otp")
    public ApiResponse<String> sendOtp(@RequestParam String email) {
        authService.generateAndSendOtp(email);
        return ApiResponse.<String>builder()
                .message("Mã OTP đã được gửi tới email của bạn")
                .build();
    }

    @PostMapping("/verify-otp")
    public ApiResponse<String> verifyOtp(@RequestBody VerifyOtpDto dto){
        authService.verifyOtp(dto.getEmail(),dto.getPassword(), dto.getOtp());
        return
                ApiResponse.<String>builder()
                        .code(200)
                        .message("Xác thực OTP thành công")
                        .build();
    }

    @GetMapping("insert")
    public ApiResponse<?> insert() throws InterruptedException {
        coinService.fetchAndSaveCoins();
        return ApiResponse.success("success");
    }

    @GetMapping("login-history")
    public ApiResponse<Page<LoginHistoryProjection>> getLoginHistory(
            @RequestParam(value = "page", defaultValue = "0")int page,
            @RequestParam(value = "size", defaultValue = "9")int size){
        Page<LoginHistoryProjection> res = userService.getLoginHistoryByUserId(page,size);
        return ApiResponse.success(res);
    }

    @GetMapping("/dashboard-info")
    public ApiResponse<DashboardInfoResponse> getInfo(){
        return ApiResponse.success(userService.getDashboardInfo());
    }
}
