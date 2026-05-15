package com.financial.stockapp.controller;

import com.financial.stockapp.repository.projection.PredictionHistoryResponse;
import com.financial.stockapp.dto.response.PredictionResponse;
import com.financial.stockapp.service.Impl.PredictionService;
import com.financial.stockapp.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
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
        int user_id = SecurityUtils.getCurrentUserId();
        CompletableFuture<PredictionResponse> result = predictionService.predict(user_id,symbol, timeframe, model,currentPrice);
        return ResponseEntity.ok(result.join());
    }

    @GetMapping("/history")
    public List<PredictionHistoryResponse> getHistory(){
        int user_id = SecurityUtils.getCurrentUserId();
        return predictionService.getHistory(user_id);
    }
}