package com.financial.stockapp.exception;

import com.financial.stockapp.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Bắt lỗi Custom (AppException) - Do lập trình viên tự ném ra
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleAppException(UserNotFoundException ex) {
        return ResponseEntity.badRequest().body("User Not Found");
    }

    // 2. Bắt lỗi Validation (@Valid) - Ví dụ: Email sai định dạng, Pass ngắn...
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // Duyệt qua từng lỗi field để lấy message
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        // Trả về Map lỗi (Frontend sẽ dùng key để hiển thị đỏ dưới từng ô input)
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // 3. Bắt lỗi Đăng nhập (Sai pass/username)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Unauthorized")
                .message("Tài khoản hoặc mật khẩu không chính xác")
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // 4. Bắt lỗi Không có quyền (Forbidden)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .error("Forbidden")
                .message("Bạn không có quyền thực hiện hành động này")
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    // 5. Bắt tất cả các lỗi còn lại (Lỗi hệ thống 500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        // Log lỗi ra console để dev fix
        ex.printStackTrace();

        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message("Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.") // Không trả message lỗi thật của Java cho user
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UserAlreadyExist.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExist(Exception ex) {
        // Log lỗi ra console để dev fix
        ex.printStackTrace();

        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message("Người dùng đã tồn tại.") // Không trả message lỗi thật của Java cho user
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(BinanceApiException.class)
    public ResponseEntity<Map<String, Object>> handleBinanceApiException(BinanceApiException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("binanceCode", ex.getCode());
        errorResponse.put("message", ex.getMsg()); // "Limit price can't be lower than 66131.64."

        // Trả về mã 400 cho Frontend dễ xử lý
        return ResponseEntity.badRequest().body(errorResponse);
    }
}