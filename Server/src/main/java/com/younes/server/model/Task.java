package com.younes.server.model;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.younes.server.interfaces.HasStartEnd;
import com.younes.server.validation.StartBeforeEnd;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OrderColumn;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @OrderColumn
    private List<Boolean> days = new ArrayList<>(Collections.nCopies(7, false));
    
    private String details;

    
    @JsonFormat(pattern = "HH:mm")
    @Override
    public LocalTime getStart() {
        return start;
    }

    @JsonFormat(pattern = "HH:mm")
    @Override
    public LocalTime getEnd() {
        return end;
    }
}
