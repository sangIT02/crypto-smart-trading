package com.financial.stockapp.service.Impl;


import com.financial.stockapp.dto.request.AddKeyAccountRequest;
import com.financial.stockapp.dto.response.*;
import com.financial.stockapp.entity.BinanceAccount;
import com.financial.stockapp.entity.User;
import com.financial.stockapp.exception.UserNotFoundException;
import com.financial.stockapp.repository.IBinanceAccountRepository;
import com.financial.stockapp.repository.IUserRepository;
import com.financial.stockapp.util.BinanceSignatureUtils;
import com.financial.stockapp.util.BinanceTimestampUtils;
import com.financial.stockapp.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BinanceService {
    private final RestTemplate restTemplate;
    private final IBinanceAccountRepository accountRepository;
    private final AesEncryptionService encryptionService;
    private final IUserRepository userRepository;
    private final WebClient webClient;
    private final BinanceSignatureUtils signatureUtils;
    private final BinanceTimestampUtils timestampUtils;
    // BinanceService.java — thêm method này nếu chưa có
    public List<List<Object>> getKlinesForPrediction(String symbol,String interval ) {
        String url = "https://api.binance.com/api/v3/klines"
                + "?symbol=" + symbol
                + "&interval=1d"   // ← luôn 1d vì model train bằng 1d
                + "&limit=200";

        List batch = restTemplate.getForObject(url, List.class);
        return (List<List<Object>>) batch;
    }

    public ApiKeyResponse  AddKeyAccount(AddKeyAccountRequest request){
        int userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("không thấy user"));

        String apiKey = encryptionService.encrypt(request.apiKey());
        String secretKey = encryptionService.encrypt(request.secretKey());

        BinanceAccount ba = BinanceAccount.builder()
                .apiKey(apiKey)
                .secretKey(secretKey)
                .user(user)
                .nameAccount(request.nameAccount())
                .isActive(true)
                .build();
        String esecretKey = encryptionService.decrypt(secretKey);
        String eapiKey = encryptionService.decrypt(apiKey);
        System.out.println(eapiKey);
        System.out.println("secret: "+esecretKey);

        BinanceAccount saved = accountRepository.save(ba);
        ApiKeyResponse response = new ApiKeyResponse(saved.getId(),
            saved.getApiKey(), saved.getSecretKey(), saved.getNameAccount(), saved.getUpdatedAt(), saved.getIsActive()
        );
        return response;
    }

    public BinanceAccountResponse getAccountBalance(String encryptedApiKey, String encryptedSecretKey) {
        String apiKey = encryptionService.decrypt(encryptedApiKey);
        String secretKey = encryptionService.decrypt(encryptedSecretKey);

        long timestamp = timestampUtils.getBinanceServerTime();
        long recvWindow = 10000L; // Nới lỏng lên 60 giây

        // 3. Tạo query string - PHẢI nối thêm recvWindow vào chuỗi để ký
        String queryString = "recvWindow=" + recvWindow + "&timestamp=" + timestamp;

        // 4. Ký query string
        String signature = signatureUtils.sign(queryString,secretKey);

        // 5. Gọi API Binance Testnet
        BinanceAccountResponse binanceResponse =  webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v2/account")
                        .queryParam("recvWindow", recvWindow) // Thêm vào URI
                        .queryParam("timestamp", timestamp)
                        .queryParam("signature", signature)
                        .build())
                .header("X-MBX-APIKEY", apiKey)  // API key để trong header
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class).flatMap(errorBody -> {
                            log.error("=== LỖI TỪ BINANCE: {} ===", errorBody);
                            return Mono.error(new RuntimeException("Binance error: " + errorBody));
                        }))
                .bodyToMono(BinanceAccountResponse.class)
                .block();
        List<BinanceAssetDto> activeAssets = binanceResponse.assets().stream()
                .filter(asset -> new BigDecimal(asset.walletBalance()).compareTo(BigDecimal.ZERO) > 0)
                .collect(Collectors.toList());

// Lọc những vị thế (positions) đang mở (có khối lượng giao dịch khác 0)
        List<BinancePositionDto> openPositions = binanceResponse.positions().stream()
                .filter(pos -> new BigDecimal(pos.positionAmt()).compareTo(BigDecimal.ZERO) != 0 || pos.symbol().equals("BTCUSDT"))
                .collect(Collectors.toList());
        return new BinanceAccountResponse(
                // Trạng thái (Lấy trực tiếp)
                binanceResponse.canTrade(),
                binanceResponse.canWithdraw(),

                // Số dư (Chuyển String -> BigDecimal)
                binanceResponse.totalWalletBalance(),
                binanceResponse.totalUnrealizedProfit(),
                binanceResponse.totalMarginBalance(),
                binanceResponse.availableBalance(),

                // Gắn 2 list vừa lọc xong vào
                activeAssets,
                openPositions
        );
    }

    public GetKeyProjection getKey(){
        int id = SecurityUtils.getCurrentUserId();
        log.info("userId: "+id);
        GetKeyProjection ba = accountRepository.findBinanceAccountByIdNative(id);
        return ba;
    }





}
