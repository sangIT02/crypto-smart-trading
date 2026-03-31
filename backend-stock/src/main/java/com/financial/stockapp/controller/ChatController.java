package com.financial.stockapp.controller;


import com.financial.stockapp.dto.request.AnalyzeRequest;
import com.financial.stockapp.dto.response.AnalyzeResponse;
import com.financial.stockapp.service.Impl.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/chat")
    public AnalyzeResponse chat(@RequestBody AnalyzeRequest request){
        return chatService.analyzePredict(request);
    }
}
