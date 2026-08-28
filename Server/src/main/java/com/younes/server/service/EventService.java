package com.younes.server.service;

import com.younes.server.model.Event;
import com.younes.server.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository repository;

    public List<Event> findAll() {
        return repository.findAll();
    }

    public Event findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Event save(Event event) {
        return repository.save(event);
    }

    public Event update(Long id, Event event) {
        if (!repository.existsById(id)) return null;
        event.setId(id);
        return repository.save(event);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
