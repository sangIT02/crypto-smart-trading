package com.financial.stockapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TotalOrderTypeResponse {
    private String type;
    private Long count;
}
