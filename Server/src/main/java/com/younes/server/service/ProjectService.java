package com.younes.server.service;

import com.younes.server.model.Project;
import com.younes.server.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository repository;

    public List<Project> findAll() {
        return repository.findAll();
    }

    public Project findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Project save(Project project) {
        return repository.save(project);
    }

    public Project update(Long id, Project project) {
        if (!repository.existsById(id)) return null;
        project.setId(id);
        return repository.save(project);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
