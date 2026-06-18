package com.financial.stockapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/system")
public class HealthServerCheckController {

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        // Chỉ đơn giản là trả về mã 200 và một dòng text
        return ResponseEntity.ok("pong");
    }
}
