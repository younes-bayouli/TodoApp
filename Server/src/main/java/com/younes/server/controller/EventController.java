package com.younes.server.controller;

import com.younes.server.model.Event;
import com.younes.server.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin("*")
@RequiredArgsConstructor
public class EventController {
    private final EventService service;

    @GetMapping
    public List<Event> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Event getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Event create(@RequestBody Event event) {
        return service.save(event);
    }

    @PutMapping("/{id}")
    public Event update(@PathVariable Long id, @RequestBody Event event) {
        return service.update(id, event);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
