package com.example.firebaseauth.exception;

import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Xử lý lỗi liên quan đến Firebase Auth
    @ExceptionHandler(FirebaseAuthException.class)
    public ResponseEntity<Map<String, String>> handleFirebaseAuthException(FirebaseAuthException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Lỗi xác thực Firebase");
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    // Xử lý các lỗi chung khác
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Lỗi máy chủ nội bộ");
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
