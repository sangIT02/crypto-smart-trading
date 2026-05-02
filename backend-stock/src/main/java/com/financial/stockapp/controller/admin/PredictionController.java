package com.financial.stockapp.controller.admin;


import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.response.TotalOrderTypeResponse;
import com.financial.stockapp.service.Impl.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("adminPredictController")
@RequestMapping("${api.prefix}/admin/predict")
@RequiredArgsConstructor
public class PredictionController {
    private final PredictionService predictionService;

    @GetMapping("/total-order-type")
    public ApiResponse<List<TotalOrderTypeResponse>> getTotalOrderType(){
        return ApiResponse.success(predictionService.getTotalOrdertype());
    }
}
