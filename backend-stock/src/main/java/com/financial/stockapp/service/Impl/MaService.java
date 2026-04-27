package com.financial.stockapp.service.Impl;

import com.financial.stockapp.dto.request.FunctionDataRequest.MarketPriceRequest;
import com.financial.stockapp.dto.response.FunctionDataResponse.PriceMarketDataResponse;
import com.financial.stockapp.dto.response.MaSignalResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaService {
    private final WebClient client;
    private final FunctionRestData restData;
    public MaSignalResponse getMaSignal(String symbol, String interval) {

        List<List<Object>> data = client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v1/klines")
                        .queryParam("symbol", symbol)
                        .queryParam("interval", interval)
                        .queryParam("limit", 100)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<List<Object>>>() {})
                .block(); // 👈 chuyển async → sync

        if (data == null || data.size() < 99) {
            throw new RuntimeException("Không đủ dữ liệu");
        }

        // 👉 lấy close prices
        List<Double> closes = data.stream()
                .map(candle -> Double.parseDouble((String) candle.get(4)))
                .toList();

        // 👉 tính MA
        double sma7 = calculateSMA(closes, 7);
        double sma25 = calculateSMA(closes, 25);
        double sma99 = calculateSMA(closes, 99);

        double ema7 = calculateEMA(closes, 7);
        double ema25 = calculateEMA(closes, 25);
        double ema99 = calculateEMA(closes, 99);

        PriceMarketDataResponse rs = restData.getMarketPriceBySymbol(new MarketPriceRequest(symbol));
        int sellSignal = 0, buySignal = 0, neutral = 0;
        double marketPrice = Math.round(Double.parseDouble(rs.price()) * 100.0) / 100.0;
        if (marketPrice > ema7) buySignal++;
        else if (marketPrice < ema7) sellSignal++;
        else neutral++;

        if (marketPrice > ema25) buySignal++;
        else if (marketPrice < ema25) sellSignal++;
        else neutral++;

        if (marketPrice > ema99) buySignal++;
        else if (marketPrice < ema99) sellSignal++;
        else neutral++;

        if (marketPrice > sma7) buySignal++;
        else if (marketPrice < sma7) sellSignal++;
        else neutral++;

        if (marketPrice > sma25) buySignal++;
        else if (marketPrice < sma25) sellSignal++;
        else neutral++;

        if (marketPrice > sma99) buySignal++;
        else if (marketPrice < sma99) sellSignal++;
        else neutral++;
        return new MaSignalResponse(
                sma7, sma25, sma99,
                ema7, ema25, ema99,
                sellSignal,buySignal,neutral, marketPrice
        );
    }
    public double calculateEMA(List<Double> prices, int period) {
        if (prices == null || prices.size() < period) {
            throw new IllegalArgumentException("Không đủ dữ liệu để tính EMA");
        }

        double k = 2.0 / (period + 1);

        // 👉 EMA đầu tiên = SMA
        double ema = calculateSMA(prices.subList(0, period), period);

        // 👉 tính EMA cho các điểm tiếp theo
        for (int i = period; i < prices.size(); i++) {
            ema = prices.get(i) * k + ema * (1 - k);
        }

        return Math.round(ema * 100.0) / 100.0;
    }
    public double calculateSMA(List<Double> prices, int period) {
        // 1. Kiểm tra an toàn để chống sập App
        if (prices == null || prices.isEmpty() || period <= 0) {
            return 0.0;
        }

        // 2. Chống lỗi khi số lượng nến API trả về ít hơn period yêu cầu
        int actualPeriod = Math.min(prices.size(), period);

        // 3. Khởi tạo biến tổng bằng 0
        double sum = 0.0;

        // 4. Tìm vị trí bắt đầu (Cắt lấy actualPeriod cây nến CUỐI CÙNG)
        int startIndex = prices.size() - actualPeriod;

        // 5. Cộng dồn giá của các cây nến mới nhất
        for (int i = startIndex; i < prices.size(); i++) {
            sum += prices.get(i);
        }

        // 6. Tính trung bình và làm tròn 2 chữ số
        return Math.round((sum / actualPeriod) * 100.0) / 100.0;
    }
}
