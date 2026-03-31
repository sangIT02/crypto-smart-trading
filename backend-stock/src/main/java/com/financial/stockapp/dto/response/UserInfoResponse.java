package com.financial.stockapp.dto.response;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
    private long id;
    private String email;
    private String user_name;
    private String avatar_url;
}
