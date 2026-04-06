package com.financial.stockapp.controller;

import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.request.ChangeLeverageRequest;
import com.financial.stockapp.dto.request.ChangeMarginTypeRequest;
import com.financial.stockapp.dto.request.OrderRequestDTO;
import com.financial.stockapp.dto.response.*;
import com.financial.stockapp.service.Impl.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("change-margin-type")
    public ResponseEntity<ChangeMarginTypeResponse> changeMarginType(@RequestBody ChangeMarginTypeRequest request){
        ChangeMarginTypeResponse response = orderService.changeMarginType(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("change-leverage")
    public ResponseEntity<ChangeLeverageResponse> changLeverage(@RequestBody ChangeLeverageRequest request){
        ChangeLeverageResponse response = orderService.changLeverage(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/limit")
    public ResponseEntity<BinanceOrderResponse> placeLimitOrder(@RequestBody OrderRequestDTO request) {
        BinanceOrderResponse response = orderService.createLimitOrder(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/market")
    public ResponseEntity<BinanceOrderResponse> placeMarketOrder(@RequestBody OrderRequestDTO request) {
        BinanceOrderResponse response = orderService.createMarketOrder(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("leverage-margin")
    public ResponseEntity<PositionRiskResponse> getLeverageAndMargin(@RequestParam("symbol") String symbol){
        PositionRiskResponse response = orderService.getLeverageAndMargin(symbol);
        return ResponseEntity.ok(response);
    }

    @GetMapping("all-orders")
    public ResponseEntity<List<ListOrderResponse>> getAllOrder(){
        List<ListOrderResponse> responses = orderService.getAllOrder();
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("cancel-order")
    public ResponseEntity<CancelBinanceOrderResponse> cancelOrder(@RequestParam("symbol")String symbol,
                                                                  @RequestParam("orderId")long id){
        CancelBinanceOrderResponse response = orderService.cancelOrder(symbol, id);
        return  ResponseEntity.ok(response);
    }
}
