package com.financial.stockapp.filter;

import com.financial.stockapp.util.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Lấy token từ header Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String email;

        // Nếu không có header hoặc không bắt đầu bằng "Bearer " -> Cho qua (để các filter sau xử lý hoặc chặn)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Cắt bỏ chữ "Bearer " để lấy token trần
        jwt = authHeader.substring(7);

        email = jwtUtils.extractEmail(jwt);

        // 4. Nếu có email và chưa được xác thực trong Context hiện tại
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);

            // 5. Kiểm tra token có hợp lệ không (hạn dùng, đúng user...)
            if (jwtUtils.isTokenValid(jwt, userDetails)) {

                // Tạo đối tượng Authentication
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                // Gắn thêm thông tin request (IP, Session ID...)
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. CẬP NHẬT CONTEXT -> Báo cho Spring biết "Thằng này uy tín!"
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 7. Cho phép request đi tiếp sang filter tiếp theo
        filterChain.doFilter(request, response);
    }
}