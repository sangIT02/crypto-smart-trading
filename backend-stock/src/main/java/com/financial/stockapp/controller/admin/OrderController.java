package com.financial.stockapp.controller.admin;

import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.response.SymbolOrderDto;
import com.financial.stockapp.service.Impl.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("adminOrderController")
@RequestMapping("${api.prefix}/admin/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/symbol-total")
    public ApiResponse<List<SymbolOrderDto>> getSymbolTotalOrder(){
        return ApiResponse.success(orderService.getSymbolTotal());
    }
}
