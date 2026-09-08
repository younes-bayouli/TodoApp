package com.younes.server.model;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import com.younes.server.interfaces.HasStartEnd;
import com.younes.server.validation.StartBeforeEnd;

import jakarta.validation.constraints.NotBlank;

@Data
@Entity
@NoArgsConstructor
@StartBeforeEnd 
public class Task implements HasStartEnd<LocalTime> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;
    private LocalTime start;
    private LocalTime end;

    @ElementCollection
    private List<Boolean> days = new ArrayList<>(Collections.nCopies(7, false));
    
    private String details;

    @Override
    public LocalTime getStart() {
        return start;
    }

    @Override
    public LocalTime getEnd() {
        return end;
    }
}
