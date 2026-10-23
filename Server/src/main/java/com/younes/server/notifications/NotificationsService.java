package com.younes.server.notifications;

import java.security.Security;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.Notification;
import com.younes.server.notifications.subscriptions.FcmToken;
import com.younes.server.notifications.subscriptions.WebPushSubscription;
import com.younes.server.notifications.subscriptions.Handlers.FcmTokenRepository;
import com.younes.server.notifications.subscriptions.Handlers.WebPushSubscriptionRepository;

import nl.martijndwars.webpush.PushService;

@Service 
public class NotificationsService {
    private final FirebaseMessaging firebaseMessaging;

    private final PushService pushService;

    private final WebPushSubscriptionRepository webSubscriptionRepository;
    private final FcmTokenRepository fcmTokenRepository;

    public NotificationsService(@Value("${vapid.public-key}") String publicKey,
                          @Value("${vapid.private-key}") String privateKey,
                          @Value("${vapid.subject}") String subject,
                          FirebaseMessaging firebaseMessaging,
                          WebPushSubscriptionRepository webSubscriptionRepository,
                          FcmTokenRepository fcmTokenRepository) throws Exception {
        System.out.println("vapid public key: " + publicKey);
        System.out.println("vapid private key: " + privateKey);
        Security.addProvider(new BouncyCastleProvider());
        this.pushService = new PushService(publicKey, privateKey, subject);
        this.firebaseMessaging = firebaseMessaging;
        this.webSubscriptionRepository = webSubscriptionRepository;
        this.fcmTokenRepository = fcmTokenRepository;
    }

    public void subscribe(WebPushSubscription subscription) {
        webSubscriptionRepository.save(subscription);
        System.out.println("added subscription: "+subscription);
    }

    public void register(FcmToken token) {
        fcmTokenRepository.save(token);
        System.out.println("added token: "+token);
    }

    public void broadcast(String title, String body, String url) {
        List<WebPushSubscription> subscriptions = webSubscriptionRepository.findAll();
        List<FcmToken> tokens = fcmTokenRepository.findAll();
        String Payload = String.format("{\"title\":\"%s\",\"body\":\"%s\",\"url\":\"%s\"}",
                title, body, url == null ? "/" : url);
        System.out.println("sending to : " + subscriptions);
        for (WebPushSubscription s : subscriptions) {
            try {
                nl.martijndwars.webpush.Notification notification = new nl.martijndwars.webpush.Notification(
                    s.getEndpoint(), s.getP256dh(), s.getAuth(), Payload);
                var response = pushService.send(notification);
                int status = response.getStatusLine().getStatusCode();
                String respBody = org.apache.http.util.EntityUtils.toString(response.getEntity());
                System.out.println("Push status: " + status + " body: " + respBody);
                if (status == 404 || status == 410) 
                {
                    subscriptions.remove(s);
                    System.out.println("removed sub: "+s);
                }
                System.out.println("sent notification to: "+s.getEndpoint());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
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
