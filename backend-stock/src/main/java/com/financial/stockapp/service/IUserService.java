package com.financial.stockapp.service;

import com.financial.stockapp.dto.request.UserLoginRequest;
import com.financial.stockapp.dto.response.*;
import com.financial.stockapp.repository.projection.LoginHistoryProjection;
import com.financial.stockapp.repository.projection.TotalUserPermonthDto;
import com.financial.stockapp.repository.projection.TotalUserProjection;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IUserService {
    LoginResponse login(UserLoginRequest dto, HttpServletRequest request);
    List<LoginHistoryProjection> getLoginHistoryByUserId();
    CountUserResponse countUser();
    Page<TotalUserProjection> getAllUsers(int page, int size);
    void updateUserStatus(int userId);
    List<TotalUserPermonthDto> getTotalUserPerMonth();
}
