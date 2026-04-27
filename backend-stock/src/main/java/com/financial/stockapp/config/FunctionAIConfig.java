package com.financial.stockapp.config;

import com.financial.stockapp.dto.request.FunctionDataRequest.MarketPriceRequest;
import com.financial.stockapp.dto.response.FunctionDataResponse.PriceMarketDataResponse;
import com.financial.stockapp.service.Impl.BinanceService;
import com.financial.stockapp.service.Impl.FunctionRestData;
import com.financial.stockapp.service.Impl.PositionService;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.function.FunctionToolCallback;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Configuration
public class FunctionAIConfig {
    public record EmptyRequest() {}
//    @Bean
//    @Description("Lấy giá hiện tại của một đồng coin từ sàn Binance (ví dụ: BTCUSDT, ETHUSDT)")
//    public Function<MarketPriceRequest, PriceMarketDataResponse> getCryptoPrice(FunctionRestData restData) {
//        return request -> {
//            // Tự động chuẩn hóa symbol nếu người dùng chỉ gõ "btc"
//            String symbol = request.symbol().toUpperCase();
//            if (!symbol.endsWith("USDT")) {
//                symbol += "USDT";
//            }
//            return restData.getMarketPriceBySymbol(symbol);
//        };
//    }
//    @Bean
//    public ToolCallback binancePriceToolInfo(FunctionRestData restData) {
//        return FunctionToolCallback.builder("getBinancePrice", restData::getMarketPriceBySymbol)
//                .description("Lấy giá thị trường hiện tại của một đồng coin từ sàn Binance Futures. Tham số symbol phải là cặp giao dịch (ví dụ: BTCUSDT, ETHUSDT).")
//                .inputType(MarketPriceRequest.class) // Record bạn đã tạo từ trước
//                .build();
//    }

//    @Bean
//    public List<ToolCallback> tradingTools(FunctionRestData restData, PositionService positionService, BinanceService binanceService) {
//        return List.of(
//                FunctionToolCallback.builder("getBinancePrice", restData::getMarketPriceBySymbol)
//                        .description("Lấy giá thị trường hiện tại của một đồng coin từ sàn Binance Futures. Tham số symbol phải là cặp giao dịch (ví dụ: BTCUSDT, ETHUSDT).")
//                        .inputType(MarketPriceRequest.class)
//                        .build(),
//
//                FunctionToolCallback.builder("getAllPosition", positionService::getAllPosition)
//                        .description("Lấy danh sách các vị thế (positions) đang mở của người dùng trên sàn giao dịch, " +
//                                "Dùng hàm này khi người dùng hỏi về danh mục đầu tư, muốn xem các lệnh đang chạy, hoặc khi cần kiểm tra trạng thái lời/lỗ hiện tại.\"")
//                        .inputType(Map.class)
//                        .build(),
//                FunctionToolCallback.builder("getAccountBalance", binanceService::getAccountBalance)
//                        .description("Lấy thông tin số dư ví future cua người dùng.")
//                        .build()
//        );
//    }
    @Bean
    public ToolCallback binancePriceTool(FunctionRestData restData) {
        return FunctionToolCallback.builder("getBinancePrice", restData::getMarketPriceBySymbol)
                .description("Returns the current market price of a cryptocurrency from Binance Futures. Input: symbol (string) - trading pair such as BTCUSDT, ETHUSDT, UNIUSDT.")
                .inputType(MarketPriceRequest.class)
                .build();
    }

    // Bean 2: Lấy số dư (Không cần tham số - Dùng Map để tránh lỗi)
    @Bean
    public ToolCallback balanceTool(BinanceService binanceService) {
        return FunctionToolCallback.builder("getAccountBalance", (Map<String, Object> req) -> binanceService.getAccountBalance())
                .description("Returns the current USDT wallet balance of the user. No input required.")
                .inputType(Map.class)
                .build();
    }

    // Bean 3: Lấy vị thế (Không cần tham số - Dùng Map để tránh lỗi)
    @Bean
    public ToolCallback listPositionsTool(PositionService positionService) {
        return FunctionToolCallback.builder("getUserPositions", (Map<String, Object> req) -> positionService.getAllPosition())
                .description("Returns a list of all currently open trading positions and their PnL. No input required.")
                .inputType(Map.class)
                .build();
    }
}

