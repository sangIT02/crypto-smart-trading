package com.financial.stockapp.service.Impl;

import com.financial.stockapp.dto.request.ClosePositionRequest;
import com.financial.stockapp.dto.request.GetAPIKeyDTO;
import com.financial.stockapp.dto.response.ListOrderResponse;
import com.financial.stockapp.dto.response.PositionDTO;
import com.financial.stockapp.repository.IBinanceAccountRepository;
import com.financial.stockapp.util.BinanceSignatureUtils;
import com.financial.stockapp.util.BinanceTimestampUtils;
import com.financial.stockapp.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class PositionService {
    private final WebClient webClient;
    private final IBinanceAccountRepository accountRepository;
    private final BinanceTimestampUtils timestampUtils;
    private final BinanceSignatureUtils signatureUtils;
    private final AesEncryptionService encryptionService;

    public List<PositionDTO> getAllPosition(){
        int userID = SecurityUtils.getCurrentUserId();
        GetAPIKeyDTO key = accountRepository.getByUserId(userID);
        String apiKey = encryptionService.decrypt(key.getApiKey());
        String secretKey = encryptionService.decrypt(key.getSecretKey());

        long timestamp = timestampUtils.getBinanceServerTime();
        long recvWindow = 10000L; // Nới lỏng lên 60 giây

        // 3. Tạo query string - PHẢI nối thêm recvWindow vào chuỗi để ký
        String queryString = "timestamp=" + timestamp;

        // 4. Ký query string
        String signature = signatureUtils.sign(queryString,secretKey);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v2/positionRisk")
                        .queryParam("timestamp",timestamp)
                        .queryParam("signature", signature)
                        .build())
                .header("X-MBX-APIKEY", apiKey)  // API key để trong header
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                        response.bodyToMono(String.class).flatMap(errorBody -> {
                            // CỰC KỲ QUAN TRỌNG: Log này sẽ cho bạn biết mã lỗi của Binance (-4046, -1102,...)
                            log.error("Chi tiết lỗi từ Binance: {}", errorBody);
                            return Mono.error(new RuntimeException("Binance API Error: " + errorBody));
                        }))
                .bodyToMono(new ParameterizedTypeReference<List<PositionDTO>>() {})
                .block();
    }

    public  ListOrderResponse closePosition(ClosePositionRequest request){
        int userID = SecurityUtils.getCurrentUserId();
        GetAPIKeyDTO key = accountRepository.getByUserId(userID);
        String apiKey = encryptionService.decrypt(key.getApiKey());
        String secretKey = encryptionService.decrypt(key.getSecretKey());

        long timestamp = timestampUtils.getBinanceServerTime();
        long recvWindow = 10000L; // Nới lỏng lên 60 giây

        // 3. Tạo query string - PHẢI nối thêm recvWindow vào chuỗi để ký
        String queryString = "symbol=" + request.symbol() + "&side=" +request.side()
        +"&type="+ request.type()+"&quantity="+ request.quantity() + "&reduceOnly=true"+"&timestamp=" + timestamp;

        // 4. Ký query string
        String signature = signatureUtils.sign(queryString,secretKey);

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v1/order")
                        .queryParam("symbol", request.symbol())
                        .queryParam("side", request.side())
                        .queryParam("type",request.type())
                        .queryParam("quantity",request.quantity())
                        .queryParam("reduceOnly",true)
                        .queryParam("timestamp",timestamp)
                        .queryParam("signature", signature)
                        .build())
                .header("X-MBX-APIKEY", apiKey)  // API key để trong header
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                        response.bodyToMono(String.class).flatMap(errorBody -> {
                            // CỰC KỲ QUAN TRỌNG: Log này sẽ cho bạn biết mã lỗi của Binance (-4046, -1102,...)
                            log.error("Chi tiết lỗi từ Binance: {}", errorBody);
                            return Mono.error(new RuntimeException("Binance API Error: " + errorBody));
                        }))
                .bodyToMono(ListOrderResponse.class)
                .block();
    }

}
