package com.financial.stockapp.config;

import com.financial.stockapp.entity.CustomUserDetails;
import com.financial.stockapp.filter.JwtAuthenticationFilter;
import com.financial.stockapp.service.Impl.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.net.http.HttpRequest;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final CustomUserDetailsService userDetailsService; // Inject cái service vừa viết ở trên
    private final JwtAuthenticationFilter jwtAuthFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF (Vì dùng JWT không cần cái này)
                .csrf(csrf -> csrf.disable())
                // 2. Cấu hình CORS (Dùng cấu hình ở WebConfig hoặc CorsFilter đã nói ở các câu trước)
                .cors(Customizer.withDefaults())
                // 3. Phân quyền (Authorize)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/users/login", "/api/users/register").permitAll() // public
                        .anyRequest().authenticated()
                )

                // 4. Quản lý Session (Quan trọng: Stateless)
                // Vì dùng JWT nên server không cần lưu Session -> Tiết kiệm RAM
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 6. CHÈN FILTER CỦA MÌNH VÀO TRƯỚC FILTER MẶC ĐỊNH
                // Ý nghĩa: "Kiểm tra Token trước khi làm bất cứ việc gì khác"
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Bean AuthenticationManager dùng để gọi hàm authenticate() trong Controller login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
