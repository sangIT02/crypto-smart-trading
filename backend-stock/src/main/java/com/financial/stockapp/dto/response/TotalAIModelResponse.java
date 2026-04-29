package com.financial.stockapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TotalAIModelResponse {
    private int totalAIModel;
    private int totalAIModelActive;
    private int totalAIModelInActive;
}
