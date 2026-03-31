package com.financial.stockapp.service.Impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.financial.stockapp.dto.request.AnalyzeRequest;
import com.financial.stockapp.dto.response.AnalyzeResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ChatService {

    private final ChatClient chatClient;
    @Autowired
    private ObjectMapper objectMapper;

    public ChatService(ChatClient.Builder builder) {
        chatClient = builder.build();
    }

    public AnalyzeResponse analyzePredict(AnalyzeRequest request) {
        SystemMessage systemMessage = new SystemMessage("""
                Bạn là chuyên gia quản lý rủi ro giao dịch crypto với nhiều năm kinh nghiệm.
              Dựa trên dữ liệu tín hiệu AI và thông tin người dùng, hãy đưa ra gợi ý giao dịch CHI TIẾT, LUÔN PHẢI CÓ KẾ HOẠCH GIAO DỊCH (KHÔNG được trả lời chung chung).

              ⚠️ QUAN TRỌNG:
              - LUÔN phải đề xuất entry, stop loss và take profit (không được bỏ trống)
              - KHÔNG được né tránh bằng cách chỉ nói "không nên giao dịch" nếu vẫn có thể quản lý rủi ro
              - Nếu tín hiệu yếu hoặc FLAT → chuyển sang chiến lược an toàn (scalp, range trading, position nhỏ)

              🎯 Quy tắc đánh giá:
              - confidence < 55% → "KHÔNG NÊN"
              - 55% - 65% → "CẦN THẬN" (vẫn vào lệnh nhưng position nhỏ, SL chặt)
              - > 65% → "NÊN VÀO LỆNH"

              - directionAcc < 55%:
                → giảm leverage
                → tăng cảnh báo
                → ưu tiên SL chặt

              📊 Xử lý tín hiệu:
              - LONG → setup long bình thường
              - SHORT → setup short bình thường
              - FLAT:
                → KHÔNG được bỏ qua
                → dùng chiến lược range trading (mua gần hỗ trợ, bán gần kháng cự)
                → TP ngắn, SL chặt

                💰 Quản lý rủi ro:
                
                - Risk thấp:
                  leverage ≤ 5
                  SL ~1–1.5%
                  position ≤ 10% vốn
                
                - Risk trung:
                  leverage ≤ 10
                  SL ~1.5–2%
                  position ≤ 15% vốn
                
                - Risk cao:
                  leverage ≤ 20
                  SL ~2–3%
                  position ≤ 20% vốn
                
                ⚠️ Ưu tiên:
                - maxLoss ≤ 2% tổng vốn

              📐 Bắt buộc:
              - Tính toán đầy đủ: entry, SL, TP dựa trên predictedPrice
              - riskRewardRatio tối thiểu 1.2 nếu có thể
              - maxLoss phải đúng theo capital và positionSize
              - positionSize phải hợp lý với risk

              Trả về ĐÚNG định dạng JSON sau, không thêm bất kỳ text nào khác:

              {
                "verdict": "NÊN VÀO LỆNH" | "CẦN THẬN" | "KHÔNG NÊN",
                "verdictReason": "lý do ngắn gọn 1 câu",
                "leverage": số nguyên (1-100),
                "leverageReason": "lý do chọn đòn bẩy này",
                "entryPrice": số,
                "stopLoss": số,
                "stopLossPercent": số,
                "takeProfit1": số,
                "takeProfit2": số,
                "takeProfit3": số,
                "tpPercent1": số,
                "tpPercent2": số,
                "tpPercent3": số,
                "riskRewardRatio": số,
                "maxLoss": số,
                "positionSize": số,
                "positionSizePercent": số,
                "warnings": ["cảnh báo 1", "cảnh báo 2"],
                "analysis": "phân tích chi tiết 3-5 câu"
              }
                """);

        UserMessage userMessage = new UserMessage("""
            Dữ liệu tín hiệu AI:
            %s
            Thông tin trader:
            - Vốn: %.2f USDT
            - Mức độ rủi ro: %s
            
            Yêu cầu:
            Phân tích tín hiệu và đề xuất lệnh giao dịch phù hợp với mức rủi ro đã chọn.
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
}
