package com.financial.stockapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Áp dụng cho mọi API
                .allowedOrigins("https://crypto-smart-trading.vercel.app/") // Chỉ cho phép FE này truy cập
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Cho phép các method này
                .allowedHeaders("*")
                .allowCredentials(true) // Quan trọng: Nếu dùng Cookie hoặc JWT xác thực
                .maxAge(3600);
    }
}