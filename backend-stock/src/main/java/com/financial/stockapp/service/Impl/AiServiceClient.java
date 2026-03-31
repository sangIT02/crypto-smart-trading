package com.financial.stockapp.service.Impl;

import com.financial.stockapp.dto.request.PredictionRequest;
import com.financial.stockapp.dto.response.PredictionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceClient {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public PredictionResponse predict(
            String symbol,
            String timeframe,
            String model,
            List<List<Object>> candles,
            Double currentPrice
    ) {
        String url = aiServiceUrl + "/api/predict";

        PredictionRequest request = PredictionRequest.builder()
                .symbol(symbol)
                .timeframe(timeframe)
                .model(model)
                .candles(candles)
                .currentPrice(currentPrice)
                .build();

        try {
            log.info("Gọi AI service: {} {} {}", symbol, timeframe, model);

            ResponseEntity<PredictionResponse> response = restTemplate.postForEntity(
                    url,
                    request,
                    PredictionResponse.class
            );

            log.info("AI response: {}", response.getBody());
            return response.getBody();

        } catch (Exception e) {
            log.error("Lỗi gọi AI service: {}", e.getMessage());
            throw new RuntimeException("AI service không khả dụng: " + e.getMessage());
        }
    }
}