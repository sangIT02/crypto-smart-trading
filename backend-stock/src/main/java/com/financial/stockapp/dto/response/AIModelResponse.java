package com.financial.stockapp.dto.response;


import java.time.LocalDateTime;

public interface AIModelResponse {
    int getId();
    String getModelName();
    double getMae();
    double getRmse();
    double getDirectionAcc();
    LocalDateTime getTrainedAt();
    boolean getIsActive();

}
