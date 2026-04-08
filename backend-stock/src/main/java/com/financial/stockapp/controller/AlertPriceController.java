package com.financial.stockapp.controller;

import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.request.AlertCreateRequest;
import com.financial.stockapp.dto.response.AlertPriceProjection;
import com.financial.stockapp.service.Impl.AlertPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/alert")
@RequiredArgsConstructor
public class AlertPriceController {
    private final AlertPriceService alertPriceService;

    @PostMapping("create")
    public ApiResponse<?> createAlertPrice(@RequestBody AlertCreateRequest request){
        alertPriceService.createAlertPrice(request);
        return ApiResponse.builder()
                .message("Tạo thông cảnh báo giá thành công")
                .code(200)
                .build();
    }

    @GetMapping("all")
    public ApiResponse<List<AlertPriceProjection>> getAlerts(){
        List<AlertPriceProjection> res = alertPriceService.getAlertByUserId();
        return ApiResponse.<List<AlertPriceProjection>>builder()
                .data(res)
                .message("lấy alert price thành công")
                .code(200)
                .build();
    }
}
