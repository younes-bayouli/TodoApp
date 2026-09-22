package com.younes.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.younes.server.model.Settings;
import com.younes.server.repository.SettingsRepository;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsRepository settingsRepository;

    public SettingsController(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    @GetMapping
    public ResponseEntity<Settings> getSettings() {

        Settings settings = settingsRepository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    Settings defaultSettings = new Settings();
                    defaultSettings.setSleepStart(java.time.LocalTime.of(21, 30));
                    defaultSettings.setSleepEnd(java.time.LocalTime.of(4, 45));

                    return settingsRepository.save(defaultSettings);
                });

        return ResponseEntity.ok(settings);
    }

    @PutMapping
    public ResponseEntity<Settings> updateSettings(@RequestBody Settings settings) {

        Settings existing = settingsRepository.findAll()
                .stream()
                .findFirst()
                .orElseGet(Settings::new);

        existing.setSleepStart(settings.getSleepStart());
        existing.setSleepEnd(settings.getSleepEnd());

        return ResponseEntity.ok(settingsRepository.save(existing));
    }
}