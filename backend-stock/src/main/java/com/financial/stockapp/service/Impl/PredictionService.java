package com.financial.stockapp.service.Impl;

import com.financial.stockapp.repository.projection.PredictionHistoryResponse;
import com.financial.stockapp.dto.response.PredictionResponse;
import com.financial.stockapp.entity.Coin;
import com.financial.stockapp.entity.Model;
import com.financial.stockapp.entity.Prediction;
import com.financial.stockapp.repository.ICoinRepository;
import com.financial.stockapp.repository.IModelRepository;
import com.financial.stockapp.repository.IPredictionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.CompletableFuture;

// service/PredictionService.java
@Service
@RequiredArgsConstructor
@Slf4j
public class PredictionService {

    private final BinanceService binanceService;
    private final AiServiceClient aiServiceClient;
    private final IPredictionRepository predictionRepository;
    private final IModelRepository modelRepository;
    private final ICoinRepository coinRepository;

    @Async
    public CompletableFuture<PredictionResponse> predict(
            String symbol,
            String timeframe,
            String model,
            Double currentPrice
    ) {
        // 1. Lấy 200 nến 1d từ Binance
        List<List<Object>> candles = binanceService.getKlinesForPrediction(symbol,timeframe);
        log.info("Lấy được {} nến cho {}", candles.size(), symbol);

        PredictionResponse response =
                aiServiceClient.predict(symbol, timeframe, model, candles,currentPrice);

        Model m = modelRepository.findModelByName(model);
        Coin c = coinRepository.findCoinByTradingPair(symbol);
        Prediction prediction = Prediction.builder()
                .model(m)
                .coin(c)
                .intervalType(timeframe)
                .currentPrice(new BigDecimal(currentPrice))
                .predictedPrice(BigDecimal.valueOf(response.getPredictedPrice()))
                .changePct(new BigDecimal(response.getChangePercent()))
                .signal(response.getSignal())
                .confidence(new BigDecimal(response.getConfidence()))
                .isCorrect(0)
                .build();

        predictionRepository.save(prediction);
        return CompletableFuture.completedFuture(response);
    }

    public Page<PredictionHistoryResponse> getHistory(int coinId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return predictionRepository.getHistory(coinId, pageable);
    }
}