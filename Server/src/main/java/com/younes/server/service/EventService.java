package com.younes.server.service;

import com.younes.server.model.Event;
import com.younes.server.repository.EventRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

import com.younes.server.exceptions.DataNotFoundException;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository repository;

    public List<Event> findAll() {
        return repository.findAll();
    }

    public Event findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new DataNotFoundException("Event not found with id: " + id));
    }

    public Event save(Event event) {
        return repository.save(event);
    }

    public Event update(Long id, Event event) {
        repository.findById(id).orElseThrow(() -> new DataNotFoundException("Event with id: " + id+" does not exist"));
        event.setId(id);
        return repository.save(event);
    }

    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new DataNotFoundException("Event not found with id: " + id));
        repository.deleteById(id);
    }
}
