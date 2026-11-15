package com.younes.server;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.younes.server.notifications.NotificationsService;

@RestController 
@RequestMapping ("/api")
public class RequestsController {

    private NotificationsService notificationsService;

    public RequestsController(NotificationsService notificationsService) {
        this.notificationsService = notificationsService;
    }

    @GetMapping("/broadcast")
    public String broadcast() {
        try {
            notificationsService.broadcast("heloo", "request.body()", "request.url()"   );
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Broadcast endpoint is working!";
    }
}
