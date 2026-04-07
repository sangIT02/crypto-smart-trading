package com.financial.stockapp.dto.response;

import java.time.LocalDateTime;

public interface LoginHistoryProjection {
    // Tên hàm phải khớp chính xác với tên biến trong Entity UserLoginHistory
    Long getId();
    String getIpAddress();
    String getDevice();
    String getLocation();
    String getStatus();
    LocalDateTime getCreatedAt();

    // Nếu bạn muốn lấy thêm Email của User từ bảng phụ (Join tự động)
    // Spring sẽ tự động join bảng User và lấy trường email ra!
    // UserView getUser();
}