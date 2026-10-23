package com.younes.server.notifications;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.younes.server.notifications.subscriptions.FcmToken;
import com.younes.server.notifications.subscriptions.WebPushSubscription;

@RestController 
@RequestMapping ("/api/notifications")
public class NotificationsController {

    public record PushRequest(String title, String body, String url) {}

    private NotificationsService notificationsService;

    public NotificationsController(NotificationsService notificationsService) {
        this.notificationsService = notificationsService;
    }

    @PostMapping ("broadcast")
    public void broadcast(@RequestBody PushRequest request) {
        try {
            notificationsService.broadcast(request.title(), request.body(), request.url());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @PostMapping ("send")
    public void send(@RequestBody PushRequest request) {
        System.out.println("sending notification: " + request.title() + " - " + request.body() + " - " + request.url());
    }

    @PostMapping ("web/subscribe")
    public void subscribe(@RequestBody WebPushSubscription subscription) {
        notificationsService.subscribe(subscription);
    }

    @PostMapping ("mobile/register")
    public void register(@RequestBody FcmToken Fcm) {
        notificationsService.register(Fcm);
    }
}
