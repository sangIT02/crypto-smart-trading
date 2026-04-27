package com.financial.stockapp.controller;

import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.request.AlertCreateRequest;
import com.financial.stockapp.dto.response.AlertPriceProjection;
import com.financial.stockapp.dto.response.AlertPriceResponse;
import com.financial.stockapp.dto.response.CoinInfoResponse;
import com.financial.stockapp.entity.AlertPrice;
import com.financial.stockapp.service.Impl.AlertPriceService;
import com.financial.stockapp.service.Impl.CoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/alert")
@RequiredArgsConstructor
public class AlertPriceController {
    private final AlertPriceService alertPriceService;
    private final CoinService coinService;
    @PostMapping("create")
    public ApiResponse<AlertPriceResponse> createAlertPrice(@RequestBody AlertCreateRequest request){
        AlertPriceResponse response = alertPriceService.createAlertPrice(request);
        return ApiResponse.<AlertPriceResponse>builder()
                .data(response)
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

    @PostMapping("pause-alert/{id}")
    public ResponseEntity<?> pauseAlertPrice(@PathVariable long id){
        alertPriceService.pauseAlertPrice(id);
        return ResponseEntity.ok("Đã dừng cảnh báo giá!");
    }

    @DeleteMapping("remove-alert/{id}")
    public ResponseEntity<?> removeAlertPrice(@PathVariable long id){
        alertPriceService.deleteAlertPrice(id);
        return ResponseEntity.ok("Đã xóa cảnh báo giá!");
    }

    @GetMapping("coin-pair")
    public ResponseEntity<?> getCoinPair(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "20") int size){
        Pageable pageable = PageRequest.of(page, size);
        Slice<CoinInfoResponse> tokenSlice = coinService.getAllCoins(pageable);
        return ResponseEntity.ok(Map.of(
                "data", tokenSlice.getContent(),
                "hasMore", tokenSlice.hasNext(), // Trả về true nếu còn data để load
                "currentPage", tokenSlice.getNumber()
        ));    }
}
