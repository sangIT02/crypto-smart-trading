package com.financial.stockapp.service.Impl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BinanceService {
    private final RestTemplate restTemplate;
    // BinanceService.java — thêm method này nếu chưa có
    public List<List<Object>> getKlinesForPrediction(String symbol,String interval ) {
        String url = "https://api.binance.com/api/v3/klines"
                + "?symbol=" + symbol
                + "&interval=1d"   // ← luôn 1d vì model train bằng 1d
                + "&limit=200";

        List batch = restTemplate.getForObject(url, List.class);
        return (List<List<Object>>) batch;
    }
}
