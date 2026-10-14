package com.younes.server.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.younes.server.interfaces.HasStartEnd;
import com.younes.server.validation.StartBeforeEnd;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@StartBeforeEnd
public class Event implements HasStartEnd<LocalDate> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotNull
    private LocalDate start;
    
    @NotNull
    private LocalDate end;

    private String backgroundColor="#bd4b4b";
    private String borderColor="#bd4b4b";
    private Boolean allDay=false;

    private String reminderOption = "none";

    @Override
    public LocalDate getStart() {
        return start;
    }

    @Override
    public LocalDate getEnd() {
        return end;
    }
}
