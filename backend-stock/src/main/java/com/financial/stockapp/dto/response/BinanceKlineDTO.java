package com.financial.stockapp.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BinanceKlineDTO {
    private Long openTime;         // Index 0
    private BigDecimal openPrice;  // Index 1
    private BigDecimal highPrice;  // Index 2
    private BigDecimal lowPrice;   // Index 3
    private BigDecimal closePrice; // Index 4 (Giá đóng cửa bạn cần để so sánh)
    private BigDecimal volume;     // Index 5
    private Long closeTime;        // Index 6

    // Hàm Static để chuyển đổi từ List<Object> của Binance sang DTO
    public static BinanceKlineDTO fromBinanceArray(java.util.List<Object> kline) {
        return BinanceKlineDTO.builder()
                .openTime(Long.parseLong(kline.get(0).toString()))
                .openPrice(new BigDecimal(kline.get(1).toString()))
                .highPrice(new BigDecimal(kline.get(2).toString()))
                .lowPrice(new BigDecimal(kline.get(3).toString()))
                .closePrice(new BigDecimal(kline.get(4).toString()))
                .volume(new BigDecimal(kline.get(5).toString()))
                .closeTime(Long.parseLong(kline.get(6).toString()))
                .build();
    }
}