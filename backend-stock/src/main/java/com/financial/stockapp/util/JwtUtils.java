package com.financial.stockapp.util;

import com.financial.stockapp.entity.CustomUserDetails;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    @Value("${jwt.secret-key}")
    private String SIGNER_KEY;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration; // vd: 3600000 (1 giờ, tính bằng ms)


    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration; // vd: 2592000000 (30 ngày, tính bằng ms)

    public String generateToken(CustomUserDetails userDetails){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        // 2. Tạo Payload (Claims)
        JWTClaimsSet.Builder claimsBuilder = new JWTClaimsSet.Builder()
                .subject(userDetails.getUser().getEmail())
                .claim("role", userDetails.getUser().getRole().getName())
                .claim("type", "ACCESS")
                .issuer("http://financial-app.com") // Ai phát hành (Optional)
                .issueTime(new Date()) // Thời gian phát hành
                .expirationTime(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .jwtID(java.util.UUID.randomUUID().toString())
                .claim("userId", userDetails.getUser().getId());

        if (userDetails.getAuthorities() != null) {
            claimsBuilder.claim("scope", userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .collect(Collectors.toList()));
        }

        JWTClaimsSet claimsSet = claimsBuilder.build();

        // 3. Tạo đối tượng SignedJWT (Kết hợp Header + Payload)
        SignedJWT signedJWT = new SignedJWT(header, claimsSet);

        // 4. Ký Token (Sign)
        try {
            JWSSigner signer = new MACSigner(SIGNER_KEY.getBytes());
            signedJWT.sign(signer);
        } catch (JOSEException e) {
            throw new RuntimeException("Lỗi khi ký Token: " + e.getMessage());
        }

        // 5. Serialize ra chuỗi String
        return signedJWT.serialize();
    }


    public String generateRefreshToken(CustomUserDetails userDetails) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        // 2. Tạo Payload (Claims)
        JWTClaimsSet.Builder claimsBuilder = new JWTClaimsSet.Builder()
                .subject(userDetails.getUser().getEmail())
                .claim("type", "REFRESH")   // phân biệt với access token
                .issuer("http://financial-app.com") // Ai phát hành (Optional)
                .issueTime(new Date()) // Thời gian phát hành
                .expirationTime(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .jwtID(java.util.UUID.randomUUID().toString())
                .claim("userId", userDetails.getUser().getId());

        // Xử lý Roles: Convert từ GrantedAuthority sang List String
        // Ví dụ: ["ROLE_USER", "ROLE_ADMIN"]
        if (userDetails.getAuthorities() != null) {
            claimsBuilder.claim("scope", userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .collect(Collectors.toList()));
        }

        JWTClaimsSet claimsSet = claimsBuilder.build();

        // 3. Tạo đối tượng SignedJWT (Kết hợp Header + Payload)
        SignedJWT signedJWT = new SignedJWT(header, claimsSet);

        // 4. Ký Token (Sign)
        try {
            JWSSigner signer = new MACSigner(SIGNER_KEY.getBytes());
            signedJWT.sign(signer);
        } catch (JOSEException e) {
            throw new RuntimeException("Lỗi khi ký Token: " + e.getMessage());
        }

        // 5. Serialize ra chuỗi String
        return signedJWT.serialize();
    }

    // 1. HÀM CORE: Trích xuất toàn bộ Claims từ Token
    // -------------------------------------------------------------
    private JWTClaimsSet getClaimsFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            if (!signedJWT.verify(verifier)) {
                throw new RuntimeException("Chữ ký token không hợp lệ");
            }
            return signedJWT.getJWTClaimsSet();
        } catch (Exception e) {
            return null;
        }
    }
    public long getExpirationTime() {
        return accessTokenExpiration / 1000; // đổi ms → giây
    }

    public String extractEmail(String token) {
        JWTClaimsSet claims = getClaimsFromToken(token);
        return claims != null ? claims.getSubject() : null;
    }

    // Lấy User ID (Custom Claim bạn đã nhét vào lúc gen)
    public Long extractUserId(String token) {
        JWTClaimsSet claims = getClaimsFromToken(token);
        try {
            // Lưu ý: Nimbus lấy số trả về Long hoặc Integer tùy context, nên dùng getLongClaim cho chắc
            return claims != null ? claims.getLongClaim("userId") : null;
        } catch (ParseException e) {
            return null;
        }
    }

    // Lấy thời gian hết hạn
    public Date extractExpiration(String token) {
        JWTClaimsSet claims = getClaimsFromToken(token);
        return claims != null ? claims.getExpirationTime() : null;
    }

    // Lấy danh sách Quyền (Scope/Roles)
    public List<String> extractScopes(String token) {
        JWTClaimsSet claims = getClaimsFromToken(token);
        try {
            return claims != null ? claims.getStringListClaim("scope") : null;
        } catch (ParseException e) {
            return null;
        }
    }

    // -------------------------------------------------------------
    // 3. HÀM KIỂM TRA TÍNH HỢP LỆ (Quan trọng nhất)
    // -------------------------------------------------------------
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            // Bước 1: Parse token
            SignedJWT signedJWT = SignedJWT.parse(token);

            // Bước 2: Kiểm tra Chữ ký (Signature) xem có đúng là Server mình ký không
            // Đây là bước quan trọng để chống hack sửa token
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            boolean isVerified = signedJWT.verify(verifier);

            // Bước 3: Kiểm tra Hết hạn (Expiration)
            // new Date() lấy giờ hiện tại. before(expiration) nghĩa là hiện tại chưa vượt quá giờ hết hạn
            boolean isNotExpired = new Date().before(signedJWT.getJWTClaimsSet().getExpirationTime());

            // Bước 4: Kiểm tra Username có khớp với UserDetails trong DB không
            String usernameInToken = signedJWT.getJWTClaimsSet().getSubject();
            boolean isUsernameMatch = usernameInToken.equals(userDetails.getUsername());

            // Token hợp lệ khi thỏa mãn cả 3 điều kiện
            return isVerified && isNotExpired && isUsernameMatch;

        } catch (Exception e) {
            // Bất cứ lỗi gì (Sai chữ ký, sai format...) đều coi là không hợp lệ
            return false;
        }
    }
}
