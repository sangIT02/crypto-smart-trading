package com.financial.stockapp.service;

import com.financial.stockapp.dto.request.UserLoginRequest;
import com.financial.stockapp.dto.response.LoginResponse;

public interface IUserService {
    LoginResponse login(UserLoginRequest dto);

}
