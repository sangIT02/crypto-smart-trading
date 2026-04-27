package com.financial.stockapp.service.Impl;


import com.financial.stockapp.dto.ErrorResponse;
import com.financial.stockapp.dto.request.AlertCreateRequest;
import com.financial.stockapp.dto.response.AlertPriceProjection;
import com.financial.stockapp.dto.response.AlertPriceResponse;
import com.financial.stockapp.entity.AlertPrice;
import com.financial.stockapp.entity.enums.ConditionType;
import com.financial.stockapp.repository.IAlertPriceRepository;
import com.financial.stockapp.repository.IUserRepository;
import com.financial.stockapp.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertPriceService {
    private final IAlertPriceRepository alertPriceRepository;
    private final IUserRepository userRepository;

    public AlertPriceResponse createAlertPrice(AlertCreateRequest request){
        long user_id = SecurityUtils.getCurrentUserId();
        List<AlertPrice> existingAlerts = alertPriceRepository.findAlertPricesByUserId(user_id);

        // Duyệt để check trùng: Cùng Symbol + Cùng TargetPrice + Cùng ConditionType + Chưa nổ
        boolean isDuplicate = existingAlerts.stream()
                .anyMatch(a -> a.getSymbol().equals(request.symbol())
                        && a.getTargetPrice().compareTo(request.targetPrice()) == 0
                        && a.getConditionType().equals(request.conditionType().name())
                        && a.getIsTriggered() == 0 // Chỉ check với cái chưa nổ
                        && a.getAlertMode().equals(request.alertMode().name())
                        && a.getIsActive() == 1);  // Và đang bật

        if (isDuplicate) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã có cảnh báo này rồi!");
        }

        // Nếu không trùng thì tạo mới
        AlertPrice savedAlert = alertPriceRepository.save(AlertPrice.builder()
                .user(userRepository.findById(user_id)) // Đừng quên gán userId vào entity
                .coinId(6l) // Nên lấy từ request thay vì fix cứng 1L
                .symbol(request.symbol())
                .conditionType(request.conditionType().name())
                .targetPrice(request.targetPrice())
                .isTriggered(0)
                .isActive(1)
                .alertMode(request.alertMode().name())
                .note(request.note())
                .build());
        AlertPriceResponse response = new AlertPriceResponse(
                savedAlert.getId(),
                savedAlert.getSymbol(),
                savedAlert.getConditionType(),
                savedAlert.getTargetPrice(),
                savedAlert.getAlertMode(),
                savedAlert.getNote(),
                savedAlert.getIsTriggered(),
                savedAlert.getIsActive(),
                savedAlert.getCreatedAt(),  // Thường là @CreatedDate tự động sinh
                savedAlert.getTriggeredAt()
        );
        return response;
    }

    public List<AlertPriceProjection> getAlertByUserId(){
        long userId = SecurityUtils.getCurrentUserId();
        List<AlertPriceProjection> response = alertPriceRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        return response;
    }


    public void pauseAlertPrice(long id){
        AlertPrice alert = alertPriceRepository.findById(id).orElseThrow(() -> new RuntimeException("không thấy cảnh báo giá"));
        if(alert.getIsActive() == 1){
            alert.setIsActive(0);
        }
        else{
            alert.setIsActive(1);
        }
        alertPriceRepository.save(alert);
    }

    public void deleteAlertPrice(long id){
        AlertPrice alert = alertPriceRepository.findById(id).orElseThrow(() -> new RuntimeException("không thấy cảnh báo giá"));
        alertPriceRepository.delete(alert);
    }
}
