package com.younes.server.service;

import com.younes.server.model.Prayer;
import com.younes.server.repository.PrayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrayerService {
    private final PrayerRepository repository;

    public List<Prayer> findAll() {
        return repository.findAll();
    }

    public Prayer findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Prayer save(Prayer prayer) {
        return repository.save(prayer);
    }

    public Prayer update(Long id, Prayer prayer) {
        if (!repository.existsById(id)) return null;
        prayer.setId(id);
        return repository.save(prayer);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
