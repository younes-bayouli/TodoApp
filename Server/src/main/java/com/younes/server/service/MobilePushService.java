package com.younes.server.service;

import com.google.firebase.messaging.*;
import com.younes.server.notifications.subscriptions.FcmToken;
import com.younes.server.notifications.subscriptions.Handlers.FcmTokenRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MobilePushService {

    private final FcmTokenRepository repository;

    public MobilePushService(FcmTokenRepository repository) {
        this.repository = repository;
    }

    public void register(String token) {
        if (token == null || token.isBlank()) return;
        if (!repository.existsById(token)) {
            repository.save(new FcmToken(token));
        }
    }

    public int sendToAll(String title, String body) {
        List<String> all = repository.findAll().stream().map(FcmToken::getToken).toList();
        int success = 0;

        // FCM accepts at most 500 tokens per multicast call
        for (int i = 0; i < all.size(); i += 500) {
            List<String> batch = all.subList(i, Math.min(i + 500, all.size()));
            success += sendBatch(batch, title, body);
        }
        return success;
    }

    private int sendBatch(List<String> batch, String title, String body) {
        MulticastMessage message = MulticastMessage.builder()
                .addAllTokens(batch)
                .setNotification(com.google.firebase.messaging.Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .setAndroidConfig(AndroidConfig.builder()
                        .setPriority(AndroidConfig.Priority.HIGH)
                        .build())
                .build();

        try {
            BatchResponse response = FirebaseMessaging.getInstance().sendEachForMulticast(message);

            List<String> invalid = new ArrayList<>();
            List<SendResponse> results = response.getResponses();
            for (int i = 0; i < results.size(); i++) {
                if (!results.get(i).isSuccessful()) {
                    MessagingErrorCode code = results.get(i).getException().getMessagingErrorCode();
                    if (code == MessagingErrorCode.UNREGISTERED
                            || code == MessagingErrorCode.INVALID_ARGUMENT) {
                        invalid.add(batch.get(i));
                    }
                }
            }
            if (!invalid.isEmpty()) {
                repository.deleteAllById(invalid);
            }
            return response.getSuccessCount();
        } catch (FirebaseMessagingException e) {
            e.printStackTrace();
            return 0;
        }
    }
}