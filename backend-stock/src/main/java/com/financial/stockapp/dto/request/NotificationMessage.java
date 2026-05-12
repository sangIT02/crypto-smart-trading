package com.financial.stockapp.dto.request;


import lombok.*;
import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationMessage implements Serializable {

    private Long campaignId;

    private String title;
    private String content;

    // Loại thông báo (SYSTEM, PROMOTION,...) để lưu vào bảng notifications cho user
    private String type;

    // Danh sách ID người nhận (Ví dụ: [1, 2, 10, 500...])
    // Worker sẽ lặp qua list này để tạo bản ghi cho từng user
    private List<Long> targetUserIds;

}