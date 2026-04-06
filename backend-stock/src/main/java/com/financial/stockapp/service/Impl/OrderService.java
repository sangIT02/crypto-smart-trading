package com.financial.stockapp.service.Impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.financial.stockapp.dto.request.ChangeLeverageRequest;
import com.financial.stockapp.dto.request.ChangeMarginTypeRequest;
import com.financial.stockapp.dto.request.GetAPIKeyDTO;
import com.financial.stockapp.dto.request.OrderRequestDTO;
import com.financial.stockapp.dto.response.*;
import com.financial.stockapp.exception.BinanceApiException;
import com.financial.stockapp.repository.IBinanceAccountRepository;
import com.financial.stockapp.util.BinanceSignatureUtils;
import com.financial.stockapp.util.BinanceTimestampUtils;
import com.financial.stockapp.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final WebClient webClient;
    private final IBinanceAccountRepository accountRepository;
    private final AesEncryptionService encryptionService;
    private final BinanceSignatureUtils signatureUtils;
    private final BinanceTimestampUtils timestampUtils;

    public ChangeMarginTypeResponse changeMarginType(ChangeMarginTypeRequest request){
        int userID = SecurityUtils.getCurrentUserId();
        GetAPIKeyDTO key = accountRepository.getByUserId(userID);
        String apiKey = encryptionService.decrypt(key.getApiKey());
        String secretKey = encryptionService.decrypt(key.getSecretKey());

        long timestamp = timestampUtils.getBinanceServerTime();
        long recvWindow = 60000L; // Nới lỏng lên 60 giây

        // 3. Tạo query string - PHẢI nối thêm recvWindow vào chuỗi để ký
        String queryString = "symbol=" + request.symbol() + "&marginType=" + request.marginType() +"&recvWindow=" + recvWindow + "&timestamp=" + timestamp;

        // 4. Ký query string
        String signature = signatureUtils.sign(queryString,secretKey);

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v1/marginType")
                        .queryParam("symbol",request.symbol())
                        .queryParam("marginType",request.marginType())
                        .queryParam("recvWindow",recvWindow)
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
                .bodyToMono(ChangeMarginTypeResponse.class)
                .block();
    }


    public ChangeLeverageResponse changLeverage(ChangeLeverageRequest request){
        int userID = SecurityUtils.getCurrentUserId();
        GetAPIKeyDTO key = accountRepository.getByUserId(userID);
        String apiKey = encryptionService.decrypt(key.getApiKey());
        String secretKey = encryptionService.decrypt(key.getSecretKey());

        long timestamp = timestampUtils.getBinanceServerTime();
        long recvWindow = 10000L; // Nới lỏng lên 60 giây

        // 3. Tạo query string - PHẢI nối thêm recvWindow vào chuỗi để ký
        String queryString = "symbol=" + request.symbol() + "&leverage=" + request.leverage() +"&recvWindow=" + recvWindow + "&timestamp=" + timestamp;

        // 4. Ký query string
        String signature = signatureUtils.sign(queryString,secretKey);

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v1/leverage")
                        .queryParam("symbol",request.symbol())
                        .queryParam("leverage",request.leverage())
                        .queryParam("recvWindow",recvWindow)
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
                .bodyToMono(ChangeLeverageResponse.class)
                .block();
    }

    public BinanceOrderResponse createLimitOrder(OrderRequestDTO payload){
        int userID = SecurityUtils.getCurrentUserId();
        GetAPIKeyDTO key = accountRepository.getByUserId(userID);
        String apiKey = encryptionService.decrypt(key.getApiKey());
        String secretKey = encryptionService.decrypt(key.getSecretKey());

        long timestamp = timestampUtils.getBinanceServerTime();
        long recvWindow = 10000L; // Nới lỏng lên 60 giây

        // 3. Tạo query string - PHẢI nối thêm recvWindow vào chuỗi để ký
        String queryString = String.format("symbol=%s&side=%s&type=%s&timeInForce=%s&quantity=%s&price=%s&newOrderRespType=RESULT&recvWindow=10000&timestamp=%d",
                payload.getSymbol(),
                payload.getSide(),
                payload.getType(),
                payload.getTimeInForce(),
                payload.getQuantity(),
                payload.getPrice(),
                timestamp);
        // 4. Ký query string
        String signature = signatureUtils.sign(queryString,secretKey);

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v1/order")
                        .queryParam("symbol",payload.getSymbol())
                        .queryParam("side",payload.getSide())
                        .queryParam("type",payload.getType())
                        .queryParam("timeInForce",payload.getTimeInForce())
                        .queryParam("quantity",payload.getQuantity())
                        .queryParam("price",payload.getPrice())
                        .queryParam("newOrderRespType","RESULT")
                        .queryParam("recvWindow",recvWindow)
                        .queryParam("timestamp",timestamp)
                        .queryParam("signature", signature)
                        .build())
                .header("X-MBX-APIKEY", apiKey)  // API key để trong header
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> {
                    // Đọc body lỗi từ Binance
                    return response.bodyToMono(JsonNode.class).flatMap(errorBody -> {
                        log.error("Chi tiết lỗi từ Binance: {}", errorBody);
                        int errorCode = errorBody.get("code").asInt();
                        String errorMsg = errorBody.get("msg").asText();

                        return Mono.error(new BinanceApiException(errorCode, errorMsg));
                    });
                })
                .bodyToMono(BinanceOrderResponse.class)
                .block();
    }

    public PositionRiskResponse getLeverageAndMargin(String symbol){
        int userID = SecurityUtils.getCurrentUserId();
        GetAPIKeyDTO key = accountRepository.getByUserId(userID);
        String apiKey = encryptionService.decrypt(key.getApiKey());
        String secretKey = encryptionService.decrypt(key.getSecretKey());

        long timestamp = timestampUtils.getBinanceServerTime();
        long recvWindow = 10000L; // Nới lỏng lên 60 giây

        // 3. Tạo query string - PHẢI nối thêm recvWindow vào chuỗi để ký
        String queryString = "symbol=" + symbol + "&timestamp=" + timestamp;

        // 4. Ký query string
        String signature = signatureUtils.sign(queryString,secretKey);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v2/positionRisk")
                        .queryParam("symbol",symbol)
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
                .bodyToMono(new ParameterizedTypeReference<List<PositionRiskResponse>>() {})
                .block()
                .get(0);
    }

    public List<ListOrderResponse> getAllOrder(){
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
                        .path("/fapi/v1/openOrders")
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
                .bodyToMono(new ParameterizedTypeReference<List<ListOrderResponse>>() {})
                .block();
    }

    public CancelBinanceOrderResponse cancelOrder(String symbol, long id){
        int userID = SecurityUtils.getCurrentUserId();
        GetAPIKeyDTO key = accountRepository.getByUserId(userID);
        String apiKey = encryptionService.decrypt(key.getApiKey());
        String secretKey = encryptionService.decrypt(key.getSecretKey());

        long timestamp = timestampUtils.getBinanceServerTime();
        long recvWindow = 10000L; // Nới lỏng lên 60 giây

        // 3. Tạo query string - PHẢI nối thêm recvWindow vào chuỗi để ký
        String queryString = "symbol=" + symbol + "&orderId=" + id +"&timestamp=" + timestamp;

        // 4. Ký query string
        String signature = signatureUtils.sign(queryString,secretKey);

        return webClient.delete()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v1/order")
                        .queryParam("symbol",symbol)
                        .queryParam("orderId",id)
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
                .bodyToMono(CancelBinanceOrderResponse.class)
                .block();
    }

    public BinanceOrderResponse createMarketOrder(OrderRequestDTO payload){
        int userID = SecurityUtils.getCurrentUserId();
        GetAPIKeyDTO key = accountRepository.getByUserId(userID);
        String apiKey = encryptionService.decrypt(key.getApiKey());
        String secretKey = encryptionService.decrypt(key.getSecretKey());

        long timestamp = timestampUtils.getBinanceServerTime();
        long recvWindow = 10000L; // Nới lỏng lên 60 giây

        // 3. Tạo query string - PHẢI nối thêm recvWindow vào chuỗi để ký
        String queryString = String.format("symbol=%s&side=%s&type=%s&quantity=%s&newOrderRespType=RESULT&recvWindow=10000&timestamp=%d",
                payload.getSymbol(),
                payload.getSide(),
                payload.getType(),
                payload.getQuantity(),
                timestamp);
        // 4. Ký query string
        String signature = signatureUtils.sign(queryString,secretKey);

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v1/order")
                        .queryParam("symbol",payload.getSymbol())
                        .queryParam("side",payload.getSide())
                        .queryParam("type",payload.getType())
                        .queryParam("quantity",payload.getQuantity())
                        .queryParam("newOrderRespType","RESULT")
                        .queryParam("recvWindow", 10000) // BẮT BUỘC THÊM DÒNG NÀY
                        .queryParam("timestamp",timestamp)
                        .queryParam("signature", signature)
                        .build())
                .header("X-MBX-APIKEY", apiKey)  // API key để trong header
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> {
                    // Đọc body lỗi từ Binance
                    return response.bodyToMono(JsonNode.class).flatMap(errorBody -> {
                        log.error("Chi tiết lỗi từ Binance: {}", errorBody);
                        int errorCode = errorBody.get("code").asInt();
                        String errorMsg = errorBody.get("msg").asText();

                        return Mono.error(new BinanceApiException(errorCode, errorMsg));
                    });
                })
                .bodyToMono(BinanceOrderResponse.class)
                .block();
    }
}
