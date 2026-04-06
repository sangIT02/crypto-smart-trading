package com.financial.stockapp.util;

import com.financial.stockapp.dto.response.BinanceTimeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@RequiredArgsConstructor
@Service
public class BinanceTimestampUtils {
    private final WebClient webClient;


    public long getBinanceServerTime() {
        try {
            BinanceTimeResponse response = webClient.get()
                    .uri("/fapi/v1/time")
                    .retrieve()
                    .bodyToMono(BinanceTimeResponse.class)
                    .block();
            return response != null ? response.serverTime() : System.currentTimeMillis();
        } catch (Exception e) {
            // Nếu lỗi mạng, fallback về thời gian hệ thống để không làm chết App
            return System.currentTimeMillis();
        }
    }

}
