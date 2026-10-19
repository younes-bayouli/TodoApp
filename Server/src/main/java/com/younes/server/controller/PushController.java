package com.younes.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.younes.server.dto.PushSubscriptionDto;
import com.younes.server.service.MobilePushService;
import com.younes.server.service.WebPushSubscriptionService;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class PushController {

    private final WebPushSubscriptionService webPush;
    private final MobilePushService mobilePush;

    public PushController(WebPushSubscriptionService webPush, MobilePushService mobilePush) {
        this.webPush = webPush;
        this.mobilePush = mobilePush;
    }

    @PostMapping("/push/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody PushSubscriptionDto sub) {
        System.out.println("Received subscription: " + sub);
        webPush.register(sub);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        System.out.println("Someone hit the /ping endpoint");
        int web = webPush.sendToAll("Someone hit your endpoint", "A request just came in.", "/");
        int mobile = mobilePush.sendToAll("Someone hit your endpoint", "A request just came in.");
        return ResponseEntity.ok("Web: " + web + ", mobile: " + mobile);
    }
}