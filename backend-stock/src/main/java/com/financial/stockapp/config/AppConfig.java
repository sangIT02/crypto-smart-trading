package com.financial.stockapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        // ✅ Timeout tránh treo request nếu AI service chậm
        HttpComponentsClientHttpRequestFactory factory =
                new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000);   // 5s kết nối
//        factory.setReadTimeout(30000);     // 30s chờ response (model chạy lâu)

        return new RestTemplate(factory);
    }
}