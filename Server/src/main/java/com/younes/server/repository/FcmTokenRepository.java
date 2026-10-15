package com.younes.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.younes.server.model.FcmToken;

public interface FcmTokenRepository extends JpaRepository<FcmToken, String> {}