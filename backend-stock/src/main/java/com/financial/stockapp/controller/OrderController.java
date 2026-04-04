package com.financial.stockapp.controller;

import com.financial.stockapp.dto.request.ChangeMarginTypeRequest;
import com.financial.stockapp.dto.response.ChangeMarginTypeResponse;
import com.financial.stockapp.service.Impl.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
