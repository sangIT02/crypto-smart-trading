package com.financial.stockapp.controller;


import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.entity.Model;
import com.financial.stockapp.repository.IModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/models")
@RequiredArgsConstructor
public class ModelController {
    private final IModelRepository modelRepository;

    @GetMapping()
    public ApiResponse<List<Model>> getAllModel(){
        List<Model> rs = modelRepository.findAll();
        return ApiResponse.<List<Model>>builder().data(rs).build();
    }
}
