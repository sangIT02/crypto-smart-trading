package com.financial.stockapp.util;

import com.financial.stockapp.entity.CustomUserDetails;
import com.financial.stockapp.exception.UserNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
    public static int getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new UserNotFoundException("Not authenticated");
        }
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return userDetails.getUser().getId();
    }

    public static String parseDevice(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) return "Unknown Device";

        String os = "Unknown OS";
        String browser = "Unknown Browser";

        // 1. Tìm Hệ điều hành
        if (userAgent.contains("Windows")) os = "Windows";
        else if (userAgent.contains("Mac OS")) os = "MacOS";
        else if (userAgent.contains("Linux")) os = "Linux";
        else if (userAgent.contains("Android")) os = "Android";
        else if (userAgent.contains("iPhone") || userAgent.contains("iPad")) os = "iOS";

        // 2. Tìm Trình duyệt (Lưu ý: Phải check Edge trước Chrome, vì Edge có chứa chữ Chrome)
        if (userAgent.contains("Edg")) browser = "Edge";
        else if (userAgent.contains("OPR") || userAgent.contains("Opera")) browser = "Opera";
        else if (userAgent.contains("Chrome")) browser = "Chrome";
        else if (userAgent.contains("Firefox")) browser = "Firefox";
        else if (userAgent.contains("Safari") && !userAgent.contains("Chrome")) browser = "Safari";

        // Kết quả: "Windows - Edge" hoặc "MacOS - Safari"
        return os + " - " + browser;
    }
}