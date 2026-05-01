package com.financial.stockapp.service.Impl;

import com.financial.stockapp.repository.projection.CoinInfoResponse;
import com.financial.stockapp.entity.Coin;
import com.financial.stockapp.repository.ICoinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CoinService {

    private final ICoinRepository coinRepository;
    private final RestTemplate restTemplate = new RestTemplate();


    public void fetchAndSaveCoins() throws InterruptedException {
        for(int i = 1; i <= 5; i++){
            String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page="+i;

            List<Map<String, Object>> coins = restTemplate.getForObject(url, List.class);

            for (Map<String, Object> c : coins) {
                String symbol = ((String) c.get("symbol")).toUpperCase();
                String name = (String) c.get("name");
                String logo = (String) c.get("image");

                // tránh trùng
                if (coinRepository.existsBySymbol(symbol)) continue;
                if(name.length() >= 15) continue;
                Coin coin = new Coin();
                coin.setSymbol(symbol);
                coin.setName(name);
                coin.setTradingPair(symbol + "USDT");
                coin.setLogoUrl(logo);

                coinRepository.save(coin);
                Thread.sleep(1500); // nghỉ 1.5 giây

            }
        }
    }

    public Slice<CoinInfoResponse> getAllCoins(Pageable pageable){
        Slice<CoinInfoResponse> coins = coinRepository.getAllCoinInfo(pageable);
        return coins;
    }
}