package com.financial.stockapp.service.Impl;

import com.financial.stockapp.system_prompts.ChatRouterPrompt;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;

@Service
public class ChatRouterService {
    private final ChatClient chatClient;

    public ChatRouterService(ChatClient.Builder builder) {
        // Nên dùng model nhẹ như gemini-1.5-flash để chạy cực nhanh và rẻ
        this.chatClient = builder.build();
    }

    public String routerAI(String userMessage) {
        return chatClient.prompt()
                .system(ChatRouterPrompt.CHAT_ROUTER)
                .user(userMessage)
                .call()
                .content()
                .trim()
                .toUpperCase();
    }
}
