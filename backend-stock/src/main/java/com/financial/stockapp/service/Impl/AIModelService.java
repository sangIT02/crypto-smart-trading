package com.financial.stockapp.service.Impl;

import com.financial.stockapp.repository.projection.AIModelResponse;
import com.financial.stockapp.dto.response.TotalAIModelResponse;
import com.financial.stockapp.entity.AiModel;
import com.financial.stockapp.repository.AIModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIModelService {
    private final AIModelRepository modelRepository;

    public TotalAIModelResponse getTotalmodel(){
        int totalModel = modelRepository.getTotalAIModel();
        int totalActive = modelRepository.getTotalAIModelActive();
        return new TotalAIModelResponse(totalModel, totalActive, totalModel-totalActive);
    }

    public Page<AIModelResponse> getAllModel(int page, int size){
        int currentPage = (page > 0) ? page - 1 : 0;
        Pageable pageable = PageRequest.of(currentPage,size);
        return modelRepository.getModels(pageable);
    }

    public void updateModelAIStatus(long id){
        AiModel model = modelRepository.findById(id).orElse(null);
        if(model == null) return;
        model.setIsActive(!model.getIsActive());
        modelRepository.save(model);
    }
}
