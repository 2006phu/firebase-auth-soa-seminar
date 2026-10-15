# Hướng Dẫn Kỹ Thuật: Tích Hợp Nhận Token Firebase Cho Bạn Quân (soa-auth-system)

Tài liệu này cung cấp **chính xác từng đoạn mã** mà bạn Quân cần bổ sung vào dự án `quanzai123/soa-auth-system` để mở thêm cổng REST API chấp nhận **Google ID Token** từ ứng dụng Firebase, tự động đồng bộ tài khoản người dùng vào cơ sở dữ liệu SQL Server và cấp JWT theo đúng chuẩn SOA.

---

## 🛠️ BƯỚC 1: Thêm Dependency vào `pom.xml` (soa-auth-system)

Mở file `pom.xml` của dự án `soa-auth-system`, thêm dependency sau vào trong thẻ `<dependencies>...</dependencies>`:

```xml
<!-- Thư viện chính thức của Google để giải mã và xác thực chữ ký số Google ID Token (RS256) -->
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>2.2.0</version>
</dependency>
```

> **Lưu ý:** Sau khi dán xong, mở Terminal chạy `mvn clean compile` (hoặc chuột phải vào project trong IDE chọn *Maven -> Reload project*) để tải thư viện về.

---

## 🛠️ BƯỚC 2: Cập Nhật `SecurityConfig.java` (Cho phép gọi API không cần Token)

Mở file:  
`src/main/java/com/soa/auth/config/SecurityConfig.java`

Tại phần cấu hình phân quyền `.authorizeHttpRequests(...)`, bổ sung đường dẫn `/api/auth/google/firebase-token` vào danh sách `permitAll()`:

```java
.authorizeHttpRequests(auth -> auth
    // Các endpoint công khai hiện có của Quân:
    .requestMatchers(
        "/api/auth/google/url",
        "/api/auth/google/callback",
        "/api/auth/google/config",
        "/api/auth/google/firebase-token", // 👈 THÊM DÒNG NÀY ĐỂ MỞ CỔNG MỚI
        "/api/auth/refresh",
        "/api/auth/latest-token",
        "/api/users/database-viewer",
        "/", "/index.html", "/database.html", "/docs.html", "/favicon.ico"
    ).permitAll()
    .anyRequest().authenticated()
)
```

---

## 🛠️ BƯỚC 3: Bổ Sung Method Xử Lý Trong `AuthService.java`

Mở file:  
`src/main/java/com/soa/auth/service/AuthService.java`

Thêm các import cần thiết ở đầu file:
```java
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;
```

Và thêm method `handleGoogleIdToken` vào trong class `AuthService`:

```java
    /**
     * 🟢 TÍCH HỢP SOA: Xử lý Google ID Token nhận trực tiếp từ ứng dụng Firebase Frontend.
     * Sử dụng thư viện GoogleIdTokenVerifier để kiểm tra chữ ký số RS256 và Issuer.
     * Tự động trích xuất thông tin, đồng bộ vào SQL Server và cấp JWT của hệ thống soa-auth-system.
     */
    @Transactional
    public AuthResponse handleGoogleIdToken(String idTokenString) {
        try {
            // 1. Khởi tạo bộ xác thực chữ ký số Google ID Token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleOAuthService.getClientId()))
                    .build();

            // 2. Kiểm tra tính hợp lệ của Token với Google JWKS
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                log.warn("Google ID Token từ Firebase không hợp lệ hoặc đã hết hạn!");
                throw new IllegalArgumentException("Google ID Token không hợp lệ hoặc đã hết hạn!");
            }

            // 3. Trích xuất thông tin người dùng từ Payload (Đã được Google chứng thực)
            GoogleIdToken.Payload payload = idToken.getPayload();
            GoogleUserInfo userInfo = new GoogleUserInfo();
            userInfo.setEmail(payload.getEmail());
            userInfo.setEmailVerified(payload.getEmailVerified());
            userInfo.setName((String) payload.get("name"));
            userInfo.setPicture((String) payload.get("picture"));
            userInfo.setSub(payload.getSubject());

            log.info("Xác thực Google ID Token thành công cho email: {}", userInfo.getEmail());

            // 4. Tái sử dụng logic hiện có: phân loại STUDENT/PERSONAL, lưu User vào DB và sinh JWT
            return processGoogleUserInfo(userInfo, null);

        } catch (Exception e) {
            log.error("Lỗi khi giải mã Google ID Token từ Firebase: {}", e.getMessage());
            throw new IllegalArgumentException("Xác thực Google ID Token thất bại: " + e.getMessage());
        }
    }
```

---

## 🛠️ BƯỚC 4: Mở Endpoint Mới Trong `AuthController.java`

Mở file:  
`src/main/java/com/soa/auth/controller/AuthController.java`

Thêm phương thức sau vào trong class:

```java
    /**
     * 🟢 PUBLIC REST API: Tiếp nhận Google ID Token từ phía Firebase Frontend
     * POST /api/auth/google/firebase-token
     */
    @PostMapping("/google/firebase-token")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithFirebaseToken(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Google ID Token không được để trống!"));
        }

        AuthResponse authResponse = authService.handleGoogleIdToken(idToken);
        return ResponseEntity.ok(ApiResponse.ok("Đồng bộ danh tính Firebase vào SQL Server thành công!", authResponse));
    }
```

---

## 🧪 BƯỚC 5: Kiểm Thử Độc Lập Bằng cURL

Sau khi bạn Quân khởi động lại backend Spring Boot, bạn có thể kiểm thử trực tiếp endpoint này:

```bash
curl -X POST http://localhost:8080/api/auth/google/firebase-token \
  -H "Content-Type: application/json" \
  -d '{"idToken": "CHUOI_GOOGLE_ID_TOKEN"}'
```

**Kết quả trả về mong đợi (`200 OK`):**
```json
{
  "success": true,
  "message": "Đồng bộ danh tính Firebase vào SQL Server thành công!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzM4NCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "email": "lephu@gmail.com",
    "role": "ROLE_PERSONAL"
  }
}
```

Và trên trang kiểm tra database của Quân `http://localhost:8080/database.html`, tài khoản của bạn sẽ lập tức xuất hiện trong bảng `users`!
