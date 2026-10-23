package com.younes.server.notifications.subscriptions.Handlers;

import org.springframework.data.jpa.repository.JpaRepository;

import com.younes.server.notifications.subscriptions.FcmToken;

public interface FcmTokenRepository extends JpaRepository<FcmToken, String> {}