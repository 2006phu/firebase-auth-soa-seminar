package com.example.firebaseauth.config;

import com.example.firebaseauth.filter.FirebaseTokenFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final FirebaseTokenFilter firebaseTokenFilter;

    public SecurityConfig(FirebaseTokenFilter firebaseTokenFilter) {
        this.firebaseTokenFilter = firebaseTokenFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Tắt CSRF vì đây là REST API
            .csrf(AbstractHttpConfigurer::disable)
            // Cấu hình CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Không sử dụng session (Stateless)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Cho phép truy cập công khai
                .requestMatchers("/", "/api/public").permitAll()
                // Yêu cầu xác thực cho các route còn lại
                .anyRequest().authenticated()
            )
            // Thêm filter kiểm tra token Firebase trước UsernamePasswordAuthenticationFilter
            .addFilterBefore(firebaseTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép tất cả các nguồn (chỉ dùng cho mục đích demo)
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
