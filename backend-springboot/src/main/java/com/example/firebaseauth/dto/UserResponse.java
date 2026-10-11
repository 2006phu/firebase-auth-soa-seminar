package com.example.firebaseauth.dto;

public record UserResponse(
        String uid,
        String email,
        String name,
        String picture,
        boolean emailVerified
) {
}
