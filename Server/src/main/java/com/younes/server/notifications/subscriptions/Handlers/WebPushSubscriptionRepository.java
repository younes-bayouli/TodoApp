package com.younes.server.notifications.subscriptions.Handlers;

import org.springframework.data.jpa.repository.JpaRepository;

import com.younes.server.notifications.subscriptions.WebPushSubscription;

public interface WebPushSubscriptionRepository
        extends JpaRepository<WebPushSubscription, String> {}