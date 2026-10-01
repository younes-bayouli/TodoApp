package com.younes.server.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.younes.server.repository.EventRepository;
import com.younes.server.repository.ProjectRepository;
import com.younes.server.repository.SettingsRepository;
import com.younes.server.repository.TaskRepository;
import com.younes.server.repository.TodoRepository;

class DataResetServiceTest {
    @TempDir
    Path uploadDirectory;

    @Test
    void resetDeletesUploadedPhotosAndAllStoredData() throws Exception {
        EventRepository eventRepository = mock(EventRepository.class);
        ProjectRepository projectRepository = mock(ProjectRepository.class);
        SettingsRepository settingsRepository = mock(SettingsRepository.class);
        TaskRepository taskRepository = mock(TaskRepository.class);
        TodoRepository todoRepository = mock(TodoRepository.class);
        Path photo = Files.writeString(uploadDirectory.resolve("photo.jpg"), "image");
        DataResetService service = new DataResetService(
                eventRepository,
                projectRepository,
                settingsRepository,
                taskRepository,
                todoRepository,
                uploadDirectory.toString());

        service.reset();

        assertFalse(Files.exists(photo));
        verify(eventRepository).deleteAll();
        verify(projectRepository).deleteAll();
        verify(settingsRepository).deleteAll();
        verify(taskRepository).deleteAll();
        verify(todoRepository).deleteAll();
    }
}