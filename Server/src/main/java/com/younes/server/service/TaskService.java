package com.younes.server.service;

import com.younes.server.model.Task;
import com.younes.server.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository repository;

    public List<Task> findAll() {
        return repository.findAll();
    }

    public Task findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Task save(Task task) {
        return repository.save(task);
    }

    public Task update(Long id, Task task) {
        if (!repository.existsById(id)) return null;
        task.setId(id);
        return repository.save(task);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
