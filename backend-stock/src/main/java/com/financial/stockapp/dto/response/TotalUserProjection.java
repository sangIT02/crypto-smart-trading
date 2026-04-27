package com.financial.stockapp.dto.response;

import lombok.*;

import java.time.LocalDateTime;

public interface TotalUserProjection {
    Long getId();
    String getFullName(); // Khớp với cột full_name
    String getEmail();
    Boolean getIsActive();
    LocalDateTime getCreatedAt();
    Integer getTotalOrder(); // Khớp với số đếm COUNT(o.id)
}
