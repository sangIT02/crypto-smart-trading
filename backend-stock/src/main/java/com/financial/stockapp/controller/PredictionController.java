package com.financial.stockapp.controller;

import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.response.PredictionHistoryResponse;
import com.financial.stockapp.dto.response.PredictionResponse;
import com.financial.stockapp.service.Impl.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/prediction")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping
    public ResponseEntity<PredictionResponse> predict(
            @RequestParam                  String symbol,
            @RequestParam(defaultValue = "1d")      String timeframe,
            @RequestParam(defaultValue = "LSTM") String model,
            @RequestParam() double currentPrice
    ) {
        CompletableFuture<PredictionResponse> result = predictionService.predict(symbol, timeframe, model,currentPrice);
        return ResponseEntity.ok(result.join());
    }

    @GetMapping("/history")
    public Page<PredictionHistoryResponse> getHistory(
            @RequestParam int coinId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ){
        return predictionService.getHistory(coinId, page, size);
    }
}