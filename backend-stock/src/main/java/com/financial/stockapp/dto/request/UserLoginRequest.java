package com.financial.stockapp.dto.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginRequest {
    private String email;
    private String password;
}
