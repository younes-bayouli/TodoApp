package com.younes.server.controller;

import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.younes.server.dto.PushSubscriptionDto;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class PushController {

    private final PushService pushService;
    // In-memory store, keyed by endpoint. Lost on restart (see notes below).
    private final Map<String, PushSubscriptionDto> subscriptions = new ConcurrentHashMap<>();

    public PushController(PushService pushService) {
        this.pushService = pushService;
    }

    @PostMapping("/push/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody PushSubscriptionDto sub) {
        subscriptions.put(sub.endpoint(), sub);
        return ResponseEntity.ok().build();
    }

    // Anyone who calls this triggers a notification to all subscribers
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        String payload = """
            {"title":"Someone hit your endpoint","body":"A request just came in.","url":"/"}
            """;

        int sent = 0;
        for (PushSubscriptionDto sub : subscriptions.values()) {
            try {
                Notification notification = new Notification(
                        sub.endpoint(),
                        sub.keys().p256dh(),
                        sub.keys().auth(),
                        payload.getBytes(java.nio.charset.StandardCharsets.UTF_8));

                int status = pushService.send(notification).getStatusLine().getStatusCode();

                if (status == 404 || status == 410) {
                    subscriptions.remove(sub.endpoint()); // expired or revoked
                } else if (status >= 200 && status < 300) {
                    sent++;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return ResponseEntity.ok("Notified " + sent + " subscriber(s)");
    }
}