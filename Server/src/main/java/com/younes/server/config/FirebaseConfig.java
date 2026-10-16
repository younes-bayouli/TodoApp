package com.younes.server.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() throws Exception {
        if (FirebaseApp.getApps().isEmpty()) {
            String serviceAccountJson =
                    System.getenv("FIREBASE_SERVICE_ACCOUNT_JSON");

            if (serviceAccountJson == null || serviceAccountJson.isBlank()) {
                throw new IllegalStateException(
                        "FIREBASE_SERVICE_ACCOUNT_JSON environment variable is missing"
                );
            }

            try (ByteArrayInputStream in = new ByteArrayInputStream(
                    serviceAccountJson.getBytes(StandardCharsets.UTF_8))) {

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(in))
                        .build();

                FirebaseApp.initializeApp(options);
            }
        }
    }
}