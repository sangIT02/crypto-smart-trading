package com.financial.stockapp.service;

import com.financial.stockapp.dto.request.UserLoginRequest;
import com.financial.stockapp.dto.response.LoginHistoryProjection;
import com.financial.stockapp.dto.response.LoginResponse;
import com.financial.stockapp.entity.UserLoginHistory;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface IUserService {
    LoginResponse login(UserLoginRequest dto, HttpServletRequest request);
    List<LoginHistoryProjection> getLoginHistoryByUserId();
}
