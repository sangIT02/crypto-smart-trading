package com.financial.stockapp.service.Impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.financial.stockapp.component.DatabaseChatMemory;
import com.financial.stockapp.dto.request.AnalyzeRequest;
import com.financial.stockapp.dto.request.FunctionDataRequest.MarketPriceRequest;
import com.financial.stockapp.dto.response.AnalyzeResponse;
import com.financial.stockapp.system_prompts.SystemPrompt;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.function.FunctionToolCallback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ChatService {

    private final ChatClient chatClient;
    private final ChatRouterService chatRouterService;
    private final List<ToolCallback> tradingTools;
    @Autowired
    private ObjectMapper objectMapper;

    public ChatService(ChatClient.Builder builder,
                       DatabaseChatMemory dbChatMemory,
                       ChatRouterService chatRouterService,
                       ObjectMapper objectMapper,
                       FunctionRestData restData,
                       List<ToolCallback> tradingTools) {
        this.chatClient = builder
                .defaultSystem(SystemPrompt.CRYPTO_BASE_PROMPT)
                // Lấy tối đa 20 tin nhắn gần nhất làm ngữ cảnh
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(dbChatMemory)
                                .build()
                )
                .build();
        this.chatRouterService = chatRouterService;
        this.objectMapper = objectMapper;
        this.tradingTools = tradingTools;
    }

    public AnalyzeResponse analyzePredict(AnalyzeRequest request) {
        SystemMessage systemMessage = new SystemMessage(SystemPrompt.ANALYZE_PROMPT);

        UserMessage userMessage = new UserMessage("""
            Dữ liệu tín hiệu AI:
            %s
            Thông tin trader:
            - Vốn: %.2f USDT
            - Mức độ rủi ro: %s
            
            Yêu cầu:
            Phân tích tín hiệu và đề xuất lệnh giao dịch phù hợp với mức rủi ro đã chọn.
            trả về dưới dạng JSON
            """.formatted(
                            request.prediction(),
                            request.capital(),
                            request.risk()
                    ));
        Prompt prompt = new Prompt(systemMessage, userMessage);
        String aiResponse = chatClient.prompt(prompt).call().content();
        try {
            // 🔥 clean markdown nếu có
            aiResponse = aiResponse
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();
            log.info(aiResponse);
            return objectMapper.readValue(aiResponse, AnalyzeResponse.class);

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Parse AI response failed: " + aiResponse, e);
        }
    }

    public String chatWithIntent(String sessionId, String userMessage) {
        // 1. AI "gác cổng" phân loại xem user đang hỏi về cái gì
        String intent = chatRouterService.routerAI(userMessage);
        log.info("Detected Intent: {}", intent);

        // 2. Chọn bản Prompt chi tiết dựa trên Intent (Lấy từ SystemPrompt của bạn)
        String selectedSystemPrompt = switch (intent) {
            case "MARKET" -> SystemPrompt.MARKET_ANALYSIS_PROMPT;
            case "STRATEGY" -> SystemPrompt.STRATEGY_ANALYSIS_PROMPT;
            case "RISK" -> SystemPrompt.RISK_ANALYSIS_PROMPT;
            case "TRADE" -> SystemPrompt.TRADE_ANALYSIS_PROMPT;
            case "INFO" -> SystemPrompt.INFO_ANALYSIS_PROMPT;
            default -> SystemPrompt.CRYPTO_BASE_PROMPT;
        };

        // 3. Thực hiện chat với System Prompt đã chọn
        return chatClient.prompt()
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, sessionId))
                .system(selectedSystemPrompt) // Nạp "nhân cách" chuyên gia vào đây
                .user(userMessage)
                .toolCallbacks(tradingTools)
                .call()
                .content();
    }
}
