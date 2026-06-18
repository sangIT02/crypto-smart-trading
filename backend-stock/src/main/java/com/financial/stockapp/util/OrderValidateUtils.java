package com.financial.stockapp.util;

import com.financial.stockapp.dto.response.SymbolInfoDTO;
import com.financial.stockapp.exception.InvalidOrderException;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class OrderValidateUtils {

    public static void validateLimitOrder(SymbolInfoDTO config, BigDecimal price, BigDecimal quantity) {
        checkPrice(price, config.getTickSize());
        checkQuantity(quantity, config.getMinQty(), config.getStepSize());
        checkNotional(price, quantity, config.getMinNotional());
    }

    /**
     * Validate cho lệnh MARKET (Chỉ có khối lượng, cần giá thị trường để ước tính)
     */
    public static void validateMarketOrder(SymbolInfoDTO config, BigDecimal quantity, BigDecimal currentMarketPrice) {
        checkQuantity(quantity, config.getMinQty(), config.getStepSize());

        // Ước tính Notional và trừ hao 2% trượt giá an toàn
        BigDecimal safeMultiplier = new BigDecimal("1.02");
        BigDecimal requiredNotional = config.getMinNotional().multiply(safeMultiplier);
        checkNotional(currentMarketPrice, quantity, requiredNotional);
    }

    // --- Các hàm kiểm tra chi tiết (Private) ---

    private static void checkPrice(BigDecimal price, BigDecimal tickSize) {
        if (price.remainder(tickSize).compareTo(BigDecimal.ZERO) != 0) {
            throw new InvalidOrderException(String.format("Giá đặt (%s) không đúng bước giá quy định (%s).", price, tickSize));
        }
    }

    private static void checkQuantity(BigDecimal quantity, BigDecimal minQty, BigDecimal stepSize) {
        if (quantity.compareTo(minQty) < 0) {
            throw new InvalidOrderException(String.format("Khối lượng (%s) nhỏ hơn mức tối thiểu (%s).", quantity, minQty));
        }
        if (quantity.remainder(stepSize).compareTo(BigDecimal.ZERO) != 0) {
            throw new InvalidOrderException(String.format("Khối lượng (%s) không đúng bước nhảy (%s).", quantity, stepSize));
        }
    }

    private static void checkNotional(BigDecimal price, BigDecimal quantity, BigDecimal minNotional) {
        BigDecimal notional = price.multiply(quantity);
        if (notional.compareTo(minNotional) < 0) {
            throw new InvalidOrderException(String.format("Tổng giá trị lệnh (%s USDT) nhỏ hơn mức tối thiểu cho phép (%s USDT).", notional, minNotional));
        }
    }


    // ==========================================
    // 2. NHÓM HÀM AUTO-CORRECT (LÀM TRÒN THÔNG MINH)
    // Phục vụ cho Bot tự động tính toán mà không bị văng lỗi
    // ==========================================

    /**
     * Tự động cắt bỏ phần dư của khối lượng để khớp với stepSize
     * VD: qty = 0.0025, stepSize = 0.001 -> Kết quả: 0.002
     */
    public static BigDecimal formatQuantity(BigDecimal rawQuantity, BigDecimal stepSize) {
        // Công thức: (raw / step) làm tròn xuống * step
        return rawQuantity.divide(stepSize, 0, RoundingMode.DOWN).multiply(stepSize);
    }

    /**
     * Tự động làm tròn giá để khớp với tickSize
     * VD: price = 60000.15, tickSize = 0.1 -> Kết quả: 60000.1
     */
    public static BigDecimal formatPrice(BigDecimal rawPrice, BigDecimal tickSize) {
        // Thường với giá, ta có thể dùng HALF_UP (Làm tròn gần nhất) hoặc DOWN tùy chiến thuật
        return rawPrice.divide(tickSize, 0, RoundingMode.HALF_UP).multiply(tickSize);
    }
}
