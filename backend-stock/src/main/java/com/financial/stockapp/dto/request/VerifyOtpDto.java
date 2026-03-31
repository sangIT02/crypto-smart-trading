package com.financial.stockapp.dto.request;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VerifyOtpDto {
    private String email;
    private String password;
    private String otp;
}
