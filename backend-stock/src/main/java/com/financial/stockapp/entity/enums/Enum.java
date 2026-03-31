package com.financial.stockapp.entity.enums;

public class Enum {
    public enum AuthProvider { LOCAL, GOOGLE, FACEBOOK }

    public enum Exchange { HOSE, HNX, UPCOM }

    public enum TransactionType {
        DEPOSIT,
        WITHDRAW,
        ORDER_FREEZE,
        ORDER_UNFREEZE,
        TRADE_BUY,
        TRADE_SELL,
        FEE_TRANSACTION,
        TAX_SELL }
    public enum OrderSide { BUY, SELL }

    public enum OrderType {
        LIMIT,  // Lệnh giới hạn (LO)
        MARKET, // Lệnh thị trường (MP - HOSE)
        ATO,    // Phiên mở cửa
        ATC,    // Phiên đóng cửa
        PLO,    // Khớp lệnh sau giờ (HNX)
        MAK,    // Thị trường, phần chưa khớp hủy ngay (HNX)
        MOK,    // Thị trường, hủy toàn bộ nếu không khớp hết (HNX)
        MTL
    }// Thị trường, phần dư chuyển thành Limit (HNX) }

    public enum OrderStatus { PENDING, PARTIALLY_FILLED, FILLED, CANCELLED, REJECTED }

    public enum NotificationType { SYSTEM, ORDER_MATCHED, PRICE_ALERT, PROMOTION }

    public enum RoleType {
        ROLE_USER,
        ROLE_ADMIN,
        ROLE_STAFF
    }

    public enum KycStatus {
        PENDING,    // Đang chờ duyệt
        APPROVED,   // Đã duyệt thành công
        REJECTED,   // Bị từ chối (Do ảnh mờ, sai thông tin...)
        EXPIRED     // Hết hạn (CMND cũ hết hạn)
    }

    public enum Gender {
        MALE,
        FEMALE,
        OTHER
    }

    public enum GroupType {
        INDEX,      // VN30, VN100
        INDUSTRY,   // Ngành Ngân hàng, Thép...
        WATCHLIST   // Danh mục theo dõi cá nhân
    }

        public enum TransactionStatus {
            PENDING,    // Đang xử lý
            SUCCESS,    // Thành công
            FAILED,     // Thất bại (Lỗi ngân hàng)
            CANCELLED   // Người dùng hủy lệnh rút
        }
}
