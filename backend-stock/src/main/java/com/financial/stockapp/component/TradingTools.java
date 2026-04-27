package com.financial.stockapp.component;

import com.financial.stockapp.dto.request.FunctionDataRequest.MarketPriceRequest;
import com.financial.stockapp.service.Impl.BinanceService;
import com.financial.stockapp.service.Impl.FunctionRestData;
import com.financial.stockapp.service.Impl.PositionService;
import lombok.AllArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class TradingTools {

    private final FunctionRestData restData;
    private final BinanceService binanceService;
    private final PositionService positionService;


    // Tool 1: Giá Binance
    @Tool(description = "Returns the current market price of a cryptocurrency from Binance Futures. Input: symbol (string) - trading pair such as BTCUSDT, ETHUSDT, UNIUSDT.")
    public Object getBinancePrice(MarketPriceRequest request) {
        return restData.getMarketPriceBySymbol(request);
    }

    // Tool 2: Số dư
    @Tool(description = "Returns the current USDT wallet balance of the user. No input required.")
    public Object getAccountBalance() {
        return binanceService.getAccountBalance();
    }

    // Tool 3: Vị thế
    @Tool(description = "Returns a list of all currently open trading positions and their PnL. No input required.")
    public Object getUserPositions() {
        return positionService.getAllPosition();
    }
}