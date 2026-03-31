package com.financial.stockapp.entity.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Verdict {
    @JsonProperty("NÊN VÀO LỆNH")
    SHOULD_ENTER,

    @JsonProperty("CẦN THẬN")
    BE_CAREFUL,

    @JsonProperty("KHÔNG NÊN")
    SHOULD_NOT
}