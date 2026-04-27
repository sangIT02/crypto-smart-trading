package com.financial.stockapp.controller;

import com.financial.stockapp.dto.ApiResponse;
import com.financial.stockapp.dto.response.CountUserResponse;
import com.financial.stockapp.dto.response.TotalUserProjection;
import com.financial.stockapp.service.IUserService;
import com.financial.stockapp.service.Impl.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/admin/user")
public class ManageUserController {
    private final IUserService userService;

    @GetMapping("/get-all")
    public ApiResponse<CountUserResponse> countUser(){
        CountUserResponse response = userService.countUser();
        return ApiResponse.success(response);
    }

    @GetMapping("/get-total-user")
    public ApiResponse<Page<TotalUserProjection>> getTotalUsers(@RequestParam(value = "page", defaultValue = "0")int page,
                                                                @RequestParam(value = "size", defaultValue = "10")int size
    ){
        Page<TotalUserProjection> response = userService.getAllUsers(page,size);
        return ApiResponse.success(response);
    }

    @PutMapping("/status/{id}")
    public ApiResponse<?> updateUserStatus(@PathVariable int id){
        userService.updateUserStatus(id);
        return ApiResponse.success("cập nhật thành công");
    }
}
