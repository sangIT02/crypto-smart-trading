package com.financial.stockapp.service.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financial.stockapp.dto.request.PredictionRequest;
import com.financial.stockapp.dto.request.TrainAcceptedResponseDto;
import com.financial.stockapp.dto.request.TrainRequestDto;
import com.financial.stockapp.dto.response.PredictionResponse;
import com.financial.stockapp.dto.response.RedisTaskResponse;
import com.financial.stockapp.entity.AiModel;
import com.financial.stockapp.entity.Coin;
import com.financial.stockapp.repository.AIModelRepository;
import com.financial.stockapp.repository.ICoinRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceClient {
    private final ICoinRepository coinRepository;
    private final RestTemplate restTemplate;
    private final AIModelRepository aiModelRepository;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper; // Thư viện parse JSON chuẩn của Spring

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

    public TrainAcceptedResponseDto trainningModel(String symbol, String interval, int timeSteps, int limit){
        try{
            String url = aiServiceUrl + "/api/train-model";
            TrainRequestDto trainRequest = new TrainRequestDto(symbol,interval,timeSteps,limit);
            ResponseEntity<TrainAcceptedResponseDto> response = restTemplate.postForEntity(
                    url,
                    trainRequest,
                    TrainAcceptedResponseDto.class
            );
            TrainAcceptedResponseDto model = response.getBody();
            Coin coin = coinRepository.findCoinByTradingPair(symbol);
            AiModel newModel = AiModel.builder()
                    .coin(coin)
                    .modelId("2")
                    .intervalType(interval)
                    .timeStep(timeSteps)
                    .limitData(limit)
                    .isActive(true)
                    .status(model.getStatus())
                    .taskId(model.getTask_id())
                    .build();
            aiModelRepository.save(newModel);
            log.info("AI response: {}", model);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Scheduled(fixedDelay = 30000) // Sửa lại đúng 30 giây (30000 ms)
    public void checkRedisStatus() {
        List<AiModel> processingModels = aiModelRepository.getAIModelByStatus("processing");
        log.info("⏰ [Schedule] Đang quét Redis lúc: {}", java.time.LocalDateTime.now());
        for (AiModel model : processingModels) {
            try {
                String redisKey = "task:" + model.getTaskId();
                String taskData = stringRedisTemplate.opsForValue().get(redisKey);
                if (taskData != null) {
                    // 3. Dùng ObjectMapper chuyển chuỗi JSON thành DTO
                    RedisTaskResponse response = objectMapper.readValue(taskData, RedisTaskResponse.class);
                    if ("completed".equals(response.getStatus()) && response.getMetrics() != null) {
                        // Xóa key khỏi Redis sau khi đã update xong để giải phóng bộ nhớ
                        model.setStatus("completed");
                        model.setMae(response.getMetrics().getMae());
                        model.setRmse(response.getMetrics().getRmse());
                        model.setDirectionAcc(response.getMetrics().getDirectionAcc());
                        model.setModelName(response.getMetrics().getModelName());
                        aiModelRepository.save(model);
                        stringRedisTemplate.delete(redisKey);

                    } else if ("failed".equals(response.getStatus())) {
                        log.error("Task {} failed: {}", model.getTaskId(), response.getError());
                        stringRedisTemplate.delete(redisKey);
                    }
                }
            } catch (Exception e) {
                // Try-catch bọc bên trong vòng lặp để nếu 1 task bị lỗi parse JSON, các task khác vẫn chạy bình thường
                log.error("Lỗi khi đọc Redis cho model ID " + model.getId(), e);
            }
        }
    }
}