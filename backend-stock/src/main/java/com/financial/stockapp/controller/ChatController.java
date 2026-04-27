package com.financial.stockapp.controller;


import com.financial.stockapp.dto.request.AnalyzeRequest;
import com.financial.stockapp.dto.response.AnalyzeResponse;
import com.financial.stockapp.service.Impl.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/chat")
    public AnalyzeResponse chat(@RequestBody AnalyzeRequest request){
        return chatService.analyzePredict(request);
    }


    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestParam(value = "session_id",required = false) String sessionId, @RequestParam("message")String message){
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }
        String response = chatService.chatWithIntent(sessionId,message);
        return ResponseEntity.ok(response);
    }
}
