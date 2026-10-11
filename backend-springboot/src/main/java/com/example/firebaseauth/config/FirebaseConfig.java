package com.example.firebaseauth.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.credentials.path}")
    private Resource serviceAccount;

    @PostConstruct
    public void init() {
        try {
            // Khởi tạo Firebase Admin SDK nếu chưa có app nào được khởi tạo
            if (FirebaseApp.getApps().isEmpty()) {
                InputStream serviceAccountStream = serviceAccount.getInputStream();
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                        .build();

                FirebaseApp.initializeApp(options);
                logger.info("Firebase Admin SDK đã được khởi tạo thành công.");
            }
        } catch (Exception e) {
            logger.error("Lỗi khi khởi tạo Firebase: {}", e.getMessage());
        }
    }
}
