package com.financial.stockapp.service.Impl;


import com.financial.stockapp.dto.request.FunctionDataRequest.MarketPriceRequest;
import com.financial.stockapp.dto.response.FunctionDataResponse.PriceMarketDataResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class FunctionRestData {
    private final WebClient webClient;


    public PriceMarketDataResponse getMarketPriceBySymbol(MarketPriceRequest request){
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/fapi/v1/ticker/price")
                        .queryParam("symbol",request.symbol())
                        .build())
                .retrieve()
                .bodyToMono(PriceMarketDataResponse.class)
                .block();
    }
}
