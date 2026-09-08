package com.younes.server.service;

import com.younes.server.model.Project;
import com.younes.server.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import com.younes.server.exceptions.DataNotFoundException;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository repository;

    public List<Project> findAll() {
        return repository.findAll();
    }

    public Project findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new DataNotFoundException("Project not found with id: " + id));
    }

    public Project save(Project project) {
        return repository.save(project);
    }

    public Project update(Long id, Project project) {
        repository.findById(id).orElseThrow(() -> new DataNotFoundException("Project with id: " + id+" does not exist"));
        project.setId(id);
        return repository.save(project);
    }

    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new DataNotFoundException("Project not found with id: " + id));
        repository.deleteById(id);
    }
}
