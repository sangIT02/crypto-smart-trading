package com.financial.stockapp.controller;

import com.financial.stockapp.dto.request.ClosePositionRequest;
import com.financial.stockapp.dto.response.ListOrderResponse;
import com.financial.stockapp.dto.response.PositionDTO;
import com.financial.stockapp.service.Impl.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/position")
public class PositionController {
    private final PositionService positionService;

    @GetMapping("all")
    public ResponseEntity<List<PositionDTO>> getAllPosition(){
        List<PositionDTO> response = positionService.getAllPosition();
        List<PositionDTO> activePositions = response.stream()
                .filter(pos -> {
                    // Chuyển string sang double để so sánh an toàn
                    double amount = Double.parseDouble(pos.positionAmt());
                    return amount != 0.0;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(activePositions);
    }
    @PostMapping("close")
    public ResponseEntity<ListOrderResponse> closePosition(@RequestBody ClosePositionRequest request){
        ListOrderResponse response = positionService.closePosition(request);
        return ResponseEntity.ok(response);
    }

}
