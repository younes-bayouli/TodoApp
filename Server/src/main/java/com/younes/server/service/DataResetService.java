package com.younes.server.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.younes.server.repository.EventRepository;
import com.younes.server.repository.ProjectRepository;
import com.younes.server.repository.SettingsRepository;
import com.younes.server.repository.TaskRepository;
import com.younes.server.repository.TodoRepository;

@Service
public class DataResetService {
    private final EventRepository eventRepository;
    private final ProjectRepository projectRepository;
    private final SettingsRepository settingsRepository;
    private final TaskRepository taskRepository;
    private final TodoRepository todoRepository;
    private final Path uploadDirectory;

    public DataResetService(
            EventRepository eventRepository,
            ProjectRepository projectRepository,
            SettingsRepository settingsRepository,
            TaskRepository taskRepository,
            TodoRepository todoRepository,
            @Value("${app.upload-dir:uploads/photos}") String uploadDirectory) {
        this.eventRepository = eventRepository;
        this.projectRepository = projectRepository;
        this.settingsRepository = settingsRepository;
        this.taskRepository = taskRepository;
        this.todoRepository = todoRepository;
        this.uploadDirectory = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    }

    @Transactional(rollbackFor = IOException.class)
    public void reset() throws IOException {
        if (Files.isDirectory(uploadDirectory)) {
            try (Stream<Path> files = Files.list(uploadDirectory)) {
                for (Path file : files
                        .filter(path -> Files.isRegularFile(path, LinkOption.NOFOLLOW_LINKS))
                        .toList()) {
                    Files.deleteIfExists(file);
                }
            }
        }

        eventRepository.deleteAll();
        projectRepository.deleteAll();
        taskRepository.deleteAll();
        todoRepository.deleteAll();
        settingsRepository.deleteAll();
    }
}