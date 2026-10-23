package com.younes.server.service;

import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.springframework.stereotype.Service;

import com.younes.server.dto.PushSubscriptionDto;
import com.younes.server.notifications.subscriptions.WebPushSubscription;
import com.younes.server.notifications.subscriptions.Handlers.WebPushSubscriptionRepository;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class WebPushSubscriptionService {

    private final PushService pushService;
    private final WebPushSubscriptionRepository repository;

    public WebPushSubscriptionService(PushService pushService,
                                      WebPushSubscriptionRepository repository) {
        this.pushService = pushService;
        this.repository = repository;
    }

    public void register(PushSubscriptionDto dto) {
        if (dto == null || dto.endpoint() == null || dto.keys() == null) return;
        // save() inserts a new row, or updates the keys if the endpoint already exists
        repository.save(new WebPushSubscription(
                dto.endpoint(), dto.keys().p256dh(), dto.keys().auth()));
    }

    public int sendToAll(String title, String body, String url) {
        String payload = """
                {"title":"%s","body":"%s","url":"%s"}
                """.formatted(title, body, url);

        int sent = 0;
        List<String> expired = new ArrayList<>();

        for (WebPushSubscription sub : repository.findAll()) {
            try {
                Notification notification = Notification.builder()
                        .endpoint(sub.getEndpoint())
                        .userPublicKey(sub.getP256dh())
                        .userAuth(sub.getAuth())
                        .payload(payload.getBytes(StandardCharsets.UTF_8))
                        .ttl(86400)
                        .build();

                var response = pushService.send(notification);
                int status = response.getStatusLine().getStatusCode();

                if (status == 404 || status == 410) {
                    expired.add(sub.getEndpoint());
                } else if (status >= 200 && status < 300) {
                    sent++;
                } else {
                    body = org.apache.http.util.EntityUtils.toString(response.getEntity());
                    System.err.println("Push failed: status=" + status
                            + " endpoint=" + sub.getEndpoint().substring(0, 40) + "... body=" + body);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (!expired.isEmpty()) {
            repository.deleteAllById(expired);
        }
        return sent;
    }
}