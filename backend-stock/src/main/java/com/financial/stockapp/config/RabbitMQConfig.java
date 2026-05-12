package com.financial.stockapp.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String NOTIF_QUEUE = "notification.queue";
    public static final String NOTIF_EXCHANGE = "notification.exchange";
    public static final String NOTIF_ROUTING_KEY = "notification.routingKey";

    @Bean
    public Queue queue() { return new Queue(NOTIF_QUEUE, true); }

    @Bean
    public TopicExchange exchange() { return new TopicExchange(NOTIF_EXCHANGE); }

    @Bean
    public Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(NOTIF_ROUTING_KEY);
    }

    // Quan trọng: Giúp gửi nhận dưới dạng JSON thay vì Byte
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
//    @Bean
//    public AmqpTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
//        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
//        rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
//        return rabbitTemplate;
//    }
}