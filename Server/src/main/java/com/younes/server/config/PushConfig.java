package com.younes.server.config;

import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.GeneralSecurityException;
import java.security.Security;

@Configuration
public class PushConfig {

    @Bean
    public PushService pushService(
            @Value("${vapid.public-key}") String publicKey,
            @Value("${vapid.private-key}") String privateKey,
            @Value("${vapid.subject}") String subject) throws GeneralSecurityException {

        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
        return new PushService(publicKey, privateKey, subject);
    }
}