package com.example.firebaseauth.controller;

import com.example.firebaseauth.dto.UserResponse;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {

    // Endpoint kiểm tra (công khai)
    @GetMapping("/")
    public Map<String, String> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Hệ thống đang hoạt động tốt!");
        return response;
    }

    // Endpoint công khai
    @GetMapping("/api/public")
    public Map<String, String> getPublicData() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đây là API công khai, không cần token Firebase để truy cập.");
        return response;
    }

    // Endpoint bảo vệ, cần có token hợp lệ
    @GetMapping("/api/protected")
    public Map<String, String> getProtectedData() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Bạn đã truy cập thành công API được bảo mật!");
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof FirebaseToken token) {
            response.put("user_id", token.getUid());
        }
        
        return response;
    }

    // Trả về thông tin chi tiết user
    @GetMapping("/api/user-info")
    public UserResponse getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof FirebaseToken token) {
            return new UserResponse(
                    token.getUid(),
                    token.getEmail(),
                    token.getName(),
                    token.getPicture(),
                    token.isEmailVerified()
            );
        }
        throw new RuntimeException("Không tìm thấy thông tin xác thực");
    }
}
