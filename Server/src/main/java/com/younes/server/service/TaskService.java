package com.younes.server.service;

import com.younes.server.model.Task;
import com.younes.server.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import com.younes.server.exceptions.DataNotFoundException;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository repository;

    public List<Task> findAll() {
        return repository.findAll();
    }

    public Task findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new DataNotFoundException("Task not found with id: " + id));
    }

    public Task save(Task task) {
        return repository.save(task);
    }

    public Task update(Long id, Task task) {
        repository.findById(id).orElseThrow(() -> new DataNotFoundException("Task with id: " + id+" does not exist"));
        task.setId(id);
        return repository.save(task);
    }

    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new DataNotFoundException("Task not found with id: " + id));
        repository.deleteById(id);
    }
}
