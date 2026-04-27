package com.financial.stockapp.controller;

import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.request.AddKeyAccountRequest;
import com.financial.stockapp.dto.response.ApiKeyResponse;
import com.financial.stockapp.dto.response.BinanceAccountResponse;
import com.financial.stockapp.dto.response.GetKeyProjection;
import com.financial.stockapp.entity.BinanceAccount;
import com.financial.stockapp.repository.IBinanceAccountRepository;
import com.financial.stockapp.service.Impl.AesEncryptionService;
import com.financial.stockapp.service.Impl.BinanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/account")
@RequiredArgsConstructor
public class AccountController {
    private final BinanceService binanceService;
    private final IBinanceAccountRepository accountRepository;
    private final AesEncryptionService encryptionService;

    @PostMapping("/add-key")
    public ApiResponse<ApiKeyResponse> addKeyAccount(@RequestBody AddKeyAccountRequest request){
        ApiKeyResponse response = binanceService.AddKeyAccount(request);
        return ApiResponse.<ApiKeyResponse>builder()
                .data(response)
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/balance")
    public ApiResponse<BinanceAccountResponse> getBalance() {
        // Lấy key từ DB theo userId
        BinanceAccountResponse balance = binanceService.getAccountBalance();
        return ApiResponse.<BinanceAccountResponse>builder()
                .data(balance)
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("get-key")
    public ApiResponse<GetKeyProjection> getKey(){
        GetKeyProjection response = binanceService.getKey();
        return ApiResponse.<GetKeyProjection>builder()
                .data(response)
                .build();
    }

}
