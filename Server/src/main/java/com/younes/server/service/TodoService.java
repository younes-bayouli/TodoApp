package com.younes.server.service;

import com.younes.server.model.Todo;
import com.younes.server.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository repository;

    public List<Todo> findAll() {
        return repository.findAll();
    }

    public Todo findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Todo save(Todo todo) {
        return repository.save(todo);
    }

    public Todo update(Long id, Todo todo) {
        if (!repository.existsById(id)) return null;
        todo.setId(id);
        return repository.save(todo);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
