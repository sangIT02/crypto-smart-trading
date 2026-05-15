package com.financial.stockapp.service.Impl;

import com.financial.stockapp.dto.response.BinanceAccountResponse;
import com.financial.stockapp.dto.response.BinanceKlineDTO;
import com.financial.stockapp.dto.response.TotalOrderTypeResponse;
import com.financial.stockapp.entity.User;
import com.financial.stockapp.repository.IUserRepository;
import com.financial.stockapp.repository.projection.PredictionHistoryResponse;
import com.financial.stockapp.dto.response.PredictionResponse;
import com.financial.stockapp.entity.Coin;
import com.financial.stockapp.entity.Model;
import com.financial.stockapp.entity.Prediction;
import com.financial.stockapp.repository.ICoinRepository;
import com.financial.stockapp.repository.IModelRepository;
import com.financial.stockapp.repository.IPredictionRepository;
import com.financial.stockapp.util.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
    private  final IUserRepository userRepository;
    private final WebClient client;

    @Async
    public CompletableFuture<PredictionResponse> predict(
            int user_id,
            String symbol,
            String timeframe,
            String model,
            Double currentPrice
    ) {
        // 1. Lấy 200 nến 1d từ Binance
        List<List<Object>> candles = binanceService.getKlinesForPrediction(symbol,timeframe);
        log.info("Lấy được {} nến cho {}", candles.size(), symbol);

        PredictionResponse response = aiServiceClient.predict(symbol, timeframe, model, candles,currentPrice);

        User user = userRepository.findById(user_id);
        Model m = modelRepository.findModelByName(model);
        Coin c = coinRepository.findCoinByTradingPair(symbol);
        LocalDateTime startOfCandle = LocalDateTime.now();
        Prediction prediction = Prediction.builder()
                .model(m)
                .coin(c)
                .user(user)
                .intervalType(timeframe)
                .targetTime(calculateTargetWithPlus(startOfCandle,timeframe,1))
                .currentPrice(new BigDecimal(currentPrice))
                .predictedPrice(BigDecimal.valueOf(response.getPredictedPrice()))
                .changePct(new BigDecimal(response.getChangePercent()))
                .signal_ai(response.getSignal())
                .confidence(new BigDecimal(response.getConfidence()))
                .isCorrect(0)
                .build();

        predictionRepository.save(prediction);
        return CompletableFuture.completedFuture(response);
    }

    public List<PredictionHistoryResponse> getHistory(int userId) {
        return predictionRepository.getHistory(userId);
    }

    public List<TotalOrderTypeResponse> getTotalOrdertype(){
        return predictionRepository.getTotalOrderType();
    }

    // tính thời gian kết thúc dự đoán
    private LocalDateTime calculateTargetWithPlus(LocalDateTime startTime, String intervalType, int stepsAhead) {
        LocalDateTime targetTime = startTime; // Lấy mốc thời gian ban đầu
        // Dùng cho trường hợp bạn có "15m", "4h"...
        intervalType = intervalType.toLowerCase();

        switch (intervalType) {
            case "1m":
                return targetTime.plusMinutes(1 * stepsAhead);
            case "3m":
                return targetTime.plusMinutes(3 * stepsAhead);
            case "5m":
                return targetTime.plusMinutes(5 * stepsAhead);
            case "15m":
                return targetTime.plusMinutes(15 * stepsAhead);
            case "1h":
                return targetTime.plusHours(1 * stepsAhead);
            case "4h":
                return targetTime.plusHours(4 * stepsAhead);
            case "1d":
                return targetTime.plusDays(1 * stepsAhead);
            default:
                throw new IllegalArgumentException("Khung thời gian không hợp lệ: " + intervalType);
        }
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void onStartup() {
        log.info("🚀 [HỆ THỐNG] Đang quét dữ liệu chưa cập nhật...");
        processPendingPredictions();
    }
    public void processPendingPredictions() {
        // Lấy các lệnh chưa có kết quả (isCorrect = 0) và đã quá hạn (targetTime <= now)
        List<Prediction> pendingList = predictionRepository.getAllPredictToCatchUp(LocalDateTime.now());

        if (pendingList.isEmpty()) {
            log.info("🔍 Không có dữ đoán nào cần xử lý bù.");
            return;
        }

        for (Prediction p : pendingList) {
            updateResult(p);
            try {
                // Nghỉ 200-500ms giữa mỗi lần gọi để tránh bị Binance chặn
                Thread.sleep(300);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    //lấy dữ liệu nến kết thúc thời gian dự đoán để ghi kết quả dự đoán vào DB
    public  void updateResult(Prediction p) {
        try {
            // 1. Đổi LocalDateTime sang Timestamp (mili giây) để gọi Binance
            long targetTimestamp = p.getTargetTime()
                    .atZone(ZoneId.systemDefault())
                    .toInstant()
                    .toEpochMilli();

            // 2. Gọi Binance lấy nến 1 phút tại đúng thời điểm đó
            String symbol = p.getCoin().getSymbol().toString() + "usdt";
            List<List<Object>> response = client.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/fapi/v1/klines")
                            .queryParam("symbol", symbol.toUpperCase())
                            .queryParam("interval", "1m")
                            .queryParam("endTime", targetTimestamp)
                            .queryParam("limit", 1)
                            .build())
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .retrieve()
                    .onStatus(
                            status -> status.is4xxClientError() || status.is5xxServerError(),
                            responseB -> responseB.bodyToMono(String.class)
                                    .flatMap(errorBody -> {
                                        log.error("=== LỖI TỪ BINANCE: {} ===", errorBody);
                                        return Mono.error(
                                                new RuntimeException("Binance error: " + errorBody)
                                        );
                                    })
                    )
                    .bodyToMono(new ParameterizedTypeReference<List<List<Object>>>() {})
                    .block();

            if (response != null && !response.isEmpty()) {
                List<Object> candle = response.get(0);
                BigDecimal closePrice = new BigDecimal(
                        candle.get(4).toString()
                );
                // 3. Tính toán Thắng / Thua / Hòa (Ngưỡng 0.15%)
                int finalStatus = calculateFinalStatus(p.getCurrentPrice(), p.getPredictedPrice(), closePrice);
                // Cập nhật trạng thái

                p.setActualPrice(closePrice); // THIẾU DÒNG NÀY
                log.info("gias dúng:"+ closePrice);
                p.setIsCorrect(finalStatus);
                predictionRepository.save(p);
            }
        } catch (Exception e) {
            log.error("❌ Lỗi khi cập nhật ID {}: {}", p.getId(), e.getMessage());
        }
    }

    // tính toán trạng thái thắng thua của tin hiệu
    private int calculateFinalStatus(BigDecimal current, BigDecimal predict, BigDecimal actual) {
        // 1. Tính % thay đổi thực tế: ((Actual - Current) / Current) * 100
        BigDecimal diff = actual.subtract(current);
        BigDecimal percentChange = diff.divide(current, 8, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100")).abs();

        // 2. Xác định kỳ vọng của AI
        // Nếu Predict == Current => AI đoán FLAT
        boolean aiExpectsFlat = predict.compareTo(current) == 0;

        // 3. CHẤM ĐIỂM

        // TH1: AI đoán FLAT
        if (aiExpectsFlat) {
            // Nếu thực tế biến động nhỏ (< 0.15%) => AI đúng
            if (percentChange.compareTo(new BigDecimal("0.15")) < 0) {
                return 1; // Đúng
            } else {
                // Nếu thực tế biến động mạnh (>= 0.15%) => AI sai
                return -1; // Sai
            }
        }

        // TH2: AI đoán TĂNG hoặc GIẢM (Không phải đoán Flat)
        // Đầu tiên check xem thực tế có bị Flat không
        if (percentChange.compareTo(new BigDecimal("0.15")) < 0) {
            return -1; // AI đoán có hướng nhưng thực tế lại đi ngang => Sai
        }

        // Nếu thực tế có biến động mạnh, check xem có đúng hướng AI chọn không
        boolean isPredictUp = predict.compareTo(current) > 0;
        boolean isActualUp = actual.compareTo(current) > 0;

        return (isPredictUp == isActualUp) ? 1 : -1;
    }
}