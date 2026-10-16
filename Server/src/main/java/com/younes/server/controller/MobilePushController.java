package com.younes.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.younes.server.service.MobilePushService;

@RestController 
@RequestMapping ("/api")
public class MobilePushController {

    private final MobilePushService mobilePush;

    public MobilePushController(MobilePushService mobilePush) {
        this.mobilePush = mobilePush;
    }

    public record TokenDto(String token) {}

    @PostMapping("/push/register-mobile")
    public ResponseEntity<Void> register(@RequestBody TokenDto dto) {
        System.out.println("Registering mobile device with token: " + dto.token());
        mobilePush.register(dto.token());
        return ResponseEntity.ok().build();
    }
}