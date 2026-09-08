package com.younes.server.service;

import com.younes.server.model.Todo;
import com.younes.server.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import com.younes.server.exceptions.DataNotFoundException;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository repository;

    public List<Todo> findAll() {
        return repository.findAll();
    }

    public Todo findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new DataNotFoundException("Todo not found with id: " + id));
    }

    public Todo save(Todo todo) {
        return repository.save(todo);
    }

    public Todo update(Long id, Todo todo) {
        repository.findById(id).orElseThrow(() -> new DataNotFoundException("Todo with id: " + id+" does not exist"));
        todo.setId(id);
        return repository.save(todo);
    }

    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new DataNotFoundException("Todo not found with id: " + id));
        repository.deleteById(id);
    }
}
