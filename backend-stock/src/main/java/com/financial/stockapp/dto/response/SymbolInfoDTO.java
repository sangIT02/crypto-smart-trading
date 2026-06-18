package com.financial.stockapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SymbolInfoDTO {
    // 1. Định danh
    private String symbol;
    private String baseAsset;
    private String quoteAsset;

    // 2. Format UI
    private int pricePrecision;
    private int quantityPrecision;

    // 3. Logic Đặt lệnh (Trích xuất từ Filters)
    private BigDecimal tickSize;    // Bước giá
    private BigDecimal minQty;      // Khối lượng tối thiểu
    private BigDecimal stepSize;    // Bước khối lượng
    private BigDecimal minNotional; // Tổng giá trị lệnh tối thiểu (Price * Qty)
}