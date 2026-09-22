package com.younes.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.younes.server.model.Settings;

public interface SettingsRepository extends JpaRepository<Settings, Long> {
}