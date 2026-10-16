package com.younes.server.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private MobilePushService mobilePushService;
    private WebPushSubscriptionService webPushSubscriptionService;

    

    public NotificationService(MobilePushService mobilePushService,
            WebPushSubscriptionService webPushSubscriptionService) {
        this.mobilePushService = mobilePushService;
        this.webPushSubscriptionService = webPushSubscriptionService;
    }



    public void broadCast(String title,String msg) {
        int mobile = mobilePushService.sendToAll(title, msg);
        int web = webPushSubscriptionService.sendToAll(title, msg, "/");
    }
}
