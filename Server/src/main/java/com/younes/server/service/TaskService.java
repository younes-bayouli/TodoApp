package com.younes.server.service;

import com.younes.server.model.Task;
import com.younes.server.repository.TaskRepository;
import com.younes.server.exceptions.TaskOverlapException;
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
        List<Task> overlappingTasks = repository.findTasksOverlapping(task.getStart(), task.getEnd());

        boolean conflict = overlappingTasks.stream()
                .anyMatch(existing -> haveCommonDay(task, existing));

        if (conflict) {
            throw new TaskOverlapException("Task overlaps with an existing task.");
        }
        return repository.save(task);
    }

    private boolean haveCommonDay(Task a, Task b) {
        for (int i = 0; i < 7; i++) {
            if (a.getDays().get(i) && b.getDays().get(i)) {
                return true;
            }
        }

        return false;
    }

    public Task update(Long id, Task task) {
        repository.findById(id).orElseThrow(() -> new DataNotFoundException("Task with id: " + id + " does not exist"));
        List<Task> overlappingTasks = repository.findTasksOverlapping(task.getStart(), task.getEnd());

        System.out.println(overlappingTasks.toString());

        boolean conflict = overlappingTasks.stream().filter((t) -> !t.getId().equals(id))
                .anyMatch(existing -> haveCommonDay(task, existing));

        if (conflict) {
            throw new TaskOverlapException("Task overlaps with an existing task.");
        }

        task.setId(id);
        return repository.save(task);
    }

    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new DataNotFoundException("Task not found with id: " + id));
        repository.deleteById(id);
    }
}
