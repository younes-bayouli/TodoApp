package com.younes.server.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.younes.server.service.DataResetService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/reset")
public class DataResetController {
    private final DataResetService dataResetService;

    public DataResetController(DataResetService dataResetService) {
        this.dataResetService = dataResetService;
    }

    @DeleteMapping
    public ResponseEntity<Void> reset() throws IOException {
        dataResetService.reset();
        return ResponseEntity.noContent().build();
    }
}