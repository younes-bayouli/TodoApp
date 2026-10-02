package com.younes.server.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.younes.server.model.Settings;
import com.younes.server.repository.SettingsRepository;

class SettingsControllerTest {

    @Test
    void updateSettingsPersistsBothSleepSegmentsWhenEnabled() {
        SettingsRepository repository = mock(SettingsRepository.class);
        when(repository.findAll()).thenReturn(List.of());
        when(repository.save(any(Settings.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Settings request = new Settings();
        request.setSleepStart(LocalTime.of(21, 30));
        request.setSleepEnd(LocalTime.of(1, 30));
        request.setSecondSleepEnabled(true);
        request.setSecondSleepStart(LocalTime.of(3, 0));
        request.setSecondSleepEnd(LocalTime.of(6, 30));

        Settings saved = new SettingsController(repository)
                .updateSettings(request)
                .getBody();

        assertNotNull(saved);
        assertEquals(LocalTime.of(21, 30), saved.getSleepStart());
        assertEquals(LocalTime.of(1, 30), saved.getSleepEnd());
        assertEquals(true, saved.isSecondSleepEnabled());
        assertEquals(LocalTime.of(3, 0), saved.getSecondSleepStart());
        assertEquals(LocalTime.of(6, 30), saved.getSecondSleepEnd());
    }
}