package com.younes.server.controller;

import com.younes.server.model.Project;
import com.younes.server.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService service;

    @GetMapping
    public List<Project> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Project getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return service.save(project);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Project project) {
        return service.update(id, project);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
