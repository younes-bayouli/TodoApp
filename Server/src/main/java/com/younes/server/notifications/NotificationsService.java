package com.younes.server.notifications;

import java.security.Security;
import java.util.List;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.Notification;
import com.younes.server.notifications.subscriptions.FcmToken;
import com.younes.server.notifications.subscriptions.Handlers.FcmTokenRepository;

@Service 
public class NotificationsService {
    private final FirebaseMessaging firebaseMessaging;
    private final FcmTokenRepository fcmTokenRepository;

    public NotificationsService(@Value("${vapid.public-key}") String publicKey,
                          @Value("${vapid.private-key}") String privateKey,
                          @Value("${vapid.subject}") String subject,
                          FirebaseMessaging firebaseMessaging,
                          FcmTokenRepository fcmTokenRepository) throws Exception {
        Security.addProvider(new BouncyCastleProvider());
        this.firebaseMessaging = firebaseMessaging;
        this.fcmTokenRepository = fcmTokenRepository;
    }

    public void register(FcmToken token) {
        fcmTokenRepository.save(token);
        System.out.println("Added FCM token: " + token.getToken());
    }

    public void broadcast(String title, String body, String url) {
        List<FcmToken> tokens = fcmTokenRepository.findAll();
        for (FcmToken token : tokens) {
            System.out.println("sending to token: " + token.getToken());
            Message message = Message.builder()
                    .setToken(token.getToken())
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .build();
            try {
                firebaseMessaging.send(message);
                System.out.println("sent!");
            } catch (FirebaseMessagingException e) {
                if (e.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED) {
                    fcmTokenRepository.delete(token);
                    System.out.println("token removed: " + token);
                }
            }
            System.out.println("sent notification to token: " + token);
        }
    }
    
}
