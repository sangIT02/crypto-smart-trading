package com.financial.stockapp.service.Impl;

import com.financial.stockapp.component.BinanceExchangeInfoParser;
import com.financial.stockapp.dto.response.SymbolInfoDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BinanceSyncService {

    private final WebClient webClient;
    private final BinanceExchangeInfoParser parser;

    // Sửa lại thành <String, Object> để khớp với RedisConfig của bạn
    private final RedisTemplate<String, Object> redisTemplate;

    public void syncFuturesExchangeInfo() {
        try {
            // 1. Gọi API lấy JSON
            String rawJsonPayload = webClient.get()
                    .uri("/fapi/v1/exchangeInfo")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // 2. Parse JSON thành List DTO
            if (rawJsonPayload != null) {
                List<SymbolInfoDTO> cleanSymbols = parser.parsePayload(rawJsonPayload);
                log.info("Đã parse thành công {} cặp coin. Bắt đầu lưu Redis...", cleanSymbols.size());

                // 3. Chuẩn bị dữ liệu: Chuyển List thành Map<String, Object>
                // - Key của Map là symbol (VD: "BTCUSDT")
                // - Value của Map là object DTO
                Map<String, Object> symbolMap = cleanSymbols.stream()
                        .collect(Collectors.toMap(
                                SymbolInfoDTO::getSymbol, // Lấy tên coin làm key
                                dto -> dto                // Lấy cả object làm value
                        ));

                // 4. Lưu vào Redis Hash
                String hashKey = "binance:symbols";

                // Mẹo: Nên xóa hash cũ trước khi ghi đè để dọn dẹp các đồng coin đã bị sàn Binance xóa (delist)
                redisTemplate.delete(hashKey);

                // Đẩy toàn bộ Map lên Redis chỉ bằng 1 lệnh (Cực kỳ nhanh)
                redisTemplate.opsForHash().putAll(hashKey, symbolMap);

                log.info("Hoàn tất đồng bộ dữ liệu Binance lên Redis!");
            }
        } catch (Exception e) {
            log.error("Lỗi khi gọi API Binance hoặc lưu Redis: ", e);
        }
    }
}