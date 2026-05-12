package com.financial.stockapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
// Annotation QUAN TRỌNG NHẤT: Bật tính năng WebSocket và tự động tạo SimpMessagingTemplate
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Cổng (Endpoint) để Frontend (React/Mobile) cắm kết nối vào.
        // setAllowedOriginPatterns("*") giúp tránh lỗi CORS khi Frontend gọi từ port khác (như 3000)
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();

    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Kích hoạt một "trạm phát sóng" có tiền tố là /topic
        // Bất kỳ ai (Frontend) đăng ký nghe trên kênh bắt đầu bằng /topic sẽ nhận được tin.
        config.enableSimpleBroker("/topic");
        // (Tùy chọn) Tiền tố cho các API mà Client muốn gửi ngược lên Server
        config.setApplicationDestinationPrefixes("/app");
    }
}