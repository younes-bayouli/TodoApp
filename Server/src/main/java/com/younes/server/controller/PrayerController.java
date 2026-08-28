package com.younes.server.controller;

import com.younes.server.model.Prayer;
import com.younes.server.service.PrayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prayers")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PrayerController {
    private final PrayerService service;

    @GetMapping
    public List<Prayer> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Prayer getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Prayer create(@RequestBody Prayer prayer) {
        return service.save(prayer);
    }

    @PutMapping("/{id}")
    public Prayer update(@PathVariable Long id, @RequestBody Prayer prayer) {
        return service.update(id, prayer);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
