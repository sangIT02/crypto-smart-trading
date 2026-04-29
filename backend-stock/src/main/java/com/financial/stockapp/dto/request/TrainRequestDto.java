package com.financial.stockapp.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TrainRequestDto {
    private String symbol;
    private String interval;
    private int time_steps = 60;
    private int limit = 1000;
}