package com.younes.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.younes.server.model.WebPushSubscription;

public interface WebPushSubscriptionRepository
        extends JpaRepository<WebPushSubscription, String> {}