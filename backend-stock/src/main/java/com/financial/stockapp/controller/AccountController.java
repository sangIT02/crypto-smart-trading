package com.financial.stockapp.controller;

import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.request.AddKeyAccountRequest;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/account")
@RequiredArgsConstructor
public class AccountController {

    @PostMapping("/add-key")
    public ApiResponse<AddKeyAccountRequest> addKeyAccount(@RequestBody AddKeyAccountRequest request){
        return ApiResponse.<AddKeyAccountRequest>builder()
                .data(request)
                .code(200)
                .message("success")
                .build();
    }
}
