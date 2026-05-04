package com.financial.stockapp.controller;


import com.financial.stockapp.dto.request.AnalyzeRequest;
import com.financial.stockapp.dto.request.ChatMessageRequest;
import com.financial.stockapp.dto.request.ChatRequest;
import com.financial.stockapp.dto.response.AnalyzeResponse;
import com.financial.stockapp.dto.response.ChatResponse;
import com.financial.stockapp.service.Impl.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.UUID;

@RestController
@RequestMapping("${api.prefix}/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/predict")
    public AnalyzeResponse chat(@RequestBody AnalyzeRequest request){
        return chatService.analyzePredict(request);
    }


    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> ask(@RequestBody ChatMessageRequest request){
        String sessionId = request.getSession_id();
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }
        ChatResponse response = chatService.chatWithIntent(sessionId,request.getMessage());
        return ResponseEntity.ok(response);
    }
}
