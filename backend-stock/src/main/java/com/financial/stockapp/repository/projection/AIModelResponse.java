package com.financial.stockapp.repository.projection;


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
