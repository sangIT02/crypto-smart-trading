package com.financial.stockapp.service;

import com.financial.stockapp.dto.request.UserLoginRequest;
import com.financial.stockapp.dto.response.CountUserResponse;
import com.financial.stockapp.dto.response.LoginHistoryProjection;
import com.financial.stockapp.dto.response.LoginResponse;
import com.financial.stockapp.dto.response.TotalUserProjection;
import com.financial.stockapp.entity.UserLoginHistory;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IUserService {
    LoginResponse login(UserLoginRequest dto, HttpServletRequest request);
    List<LoginHistoryProjection> getLoginHistoryByUserId();
    CountUserResponse countUser();
    Page<TotalUserProjection> getAllUsers(int page,int size);
    void updateUserStatus(int userId);
}
