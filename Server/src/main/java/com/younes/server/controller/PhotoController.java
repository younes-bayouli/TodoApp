package com.younes.server.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/photos")
public class PhotoController {

    private final Path uploadDir = Paths.get("uploads/photos");

    @PostMapping
    public ResponseEntity<Void> upload(@RequestParam("image") MultipartFile image)
            throws IOException {

        Files.createDirectories(uploadDir);

        Path filePath = uploadDir.resolve(image.getOriginalFilename());

        Files.copy(image.getInputStream(), filePath);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<String>> getAllPhotos() throws IOException {

        Files.createDirectories(uploadDir);

        List<String> photos = Files.list(uploadDir)
                .filter(Files::isRegularFile)
                .map(path -> path.getFileName().toString())
                .toList();

        return ResponseEntity.ok(photos);
    }

    @DeleteMapping("/{filename}")
    public ResponseEntity<Void> delete(@PathVariable String filename) throws IOException {

        Path filePath = uploadDir.resolve(filename);

        Files.deleteIfExists(filePath);

        return ResponseEntity.noContent().build();
    }
}