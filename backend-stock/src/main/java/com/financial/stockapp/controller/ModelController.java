package com.financial.stockapp.controller;


import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.request.TrainAcceptedResponseDto;
import com.financial.stockapp.dto.response.AIModelResponse;
import com.financial.stockapp.dto.response.TotalAIModelResponse;
import com.financial.stockapp.entity.Model;
import com.financial.stockapp.repository.IModelRepository;
import com.financial.stockapp.service.Impl.AIModelService;
import com.financial.stockapp.service.Impl.AiServiceClient;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/models")
@RequiredArgsConstructor
public class ModelController {
    private final IModelRepository modelRepository;
    private final AiServiceClient aiService;
    private final AIModelService aiModelService;
    @GetMapping()
    public ApiResponse<List<Model>> getAllModel(){
        List<Model> rs = modelRepository.findAll();
        return ApiResponse.<List<Model>>builder().data(rs).build();
    }

    @PostMapping("/train-model")
    public ApiResponse<TrainAcceptedResponseDto> trainModel(
            @RequestParam("symbol")String symbol,
            @RequestParam("interval")String interval,
            @RequestParam(value = "time_step", defaultValue = "60")int time_step,
            @RequestParam(value = "limit", defaultValue = "1000")int limit
    ){
        return ApiResponse.success(aiService.trainningModel(symbol,interval,time_step,limit));
    }

    @GetMapping("/total")
    public ApiResponse<TotalAIModelResponse> getTotalModel(){
        TotalAIModelResponse response = aiModelService.getTotalmodel();
        return  ApiResponse.success(response);
    }

    @GetMapping("/all-model")
    public ApiResponse<Page<AIModelResponse>> getAllModelAI(
            @RequestParam(value = "page", defaultValue = "0")int page,
            @RequestParam(value = "size", defaultValue = "10")int size
    ){
        return ApiResponse.success(aiModelService.getAllModel(page,size));
    }

    @PutMapping("/update-active/{id}")
    public ApiResponse<?> updateModelStatus(@PathVariable long id){
        aiModelService.updateModelAIStatus(id);
        return ApiResponse.success("Cập nhật trạng thái thành công");
    }
}
