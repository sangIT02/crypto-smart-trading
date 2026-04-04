package com.financial.stockapp.service.Impl;

import com.financial.stockapp.dto.request.ChangeMarginTypeRequest;
import com.financial.stockapp.dto.request.GetAPIKeyDTO;
import com.financial.stockapp.dto.response.ChangeMarginTypeResponse;
import com.financial.stockapp.repository.IBinanceAccountRepository;
import com.financial.stockapp.util.BinanceSignatureUtils;
import com.financial.stockapp.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final WebClient webClient;
    private final IBinanceAccountRepository accountRepository;
    private final AesEncryptionService encryptionService;
    private final BinanceSignatureUtils signatureUtils;

    public ChangeMarginTypeResponse changeMarginType(ChangeMarginTypeRequest request){
        int userID = SecurityUtils.getCurrentUserId();
        GetAPIKeyDTO key = accountRepository.getByUserId(userID);
        String apiKey = encryptionService.decrypt(key.getApiKey());
        String secretKey = encryptionService.decrypt(key.getSecretKey());

        long timestamp = System.currentTimeMillis();
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
}
