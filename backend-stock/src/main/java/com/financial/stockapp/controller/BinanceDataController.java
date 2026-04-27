package com.financial.stockapp.controller;

import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.response.MaSignalResponse;
import com.financial.stockapp.service.Impl.MaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("${api.prefix}/ma")
@RequiredArgsConstructor
public class BinanceDataController {
    private final MaService maService;

    @GetMapping("/all-ma")
    private ApiResponse<MaSignalResponse> getMaSignal(@RequestParam("symbol")String symbol,@RequestParam("interval")String interval){
        MaSignalResponse response = maService.getMaSignal(symbol,interval);
        return ApiResponse.success(response);
    }

}
