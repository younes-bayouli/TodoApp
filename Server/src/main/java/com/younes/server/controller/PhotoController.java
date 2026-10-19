package com.younes.server.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
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

    @GetMapping("/{filename}")
public ResponseEntity<Resource> getPhoto(@PathVariable String filename) throws IOException {
    Path filePath = uploadDir.resolve(filename).normalize();
    if (!filePath.startsWith(uploadDir) || !Files.isRegularFile(filePath)) {
        return ResponseEntity.notFound().build();
    }

    String contentType = Files.probeContentType(filePath);
    if (contentType == null) {
        contentType = "application/octet-stream";
    }

    return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .cacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic())
            .body(new UrlResource(filePath.toUri()));
}

    @DeleteMapping("/{filename}")
    public ResponseEntity<Void> delete(@PathVariable String filename) throws IOException {

        Path filePath = uploadDir.resolve(filename);

        Files.deleteIfExists(filePath);

        return ResponseEntity.noContent().build();
    }
}