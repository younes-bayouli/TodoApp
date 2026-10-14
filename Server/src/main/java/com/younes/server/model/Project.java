package com.younes.server.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;
    private String description;
    private LocalDate deadline;
    private String owner;
    private String status = "Active";
    private String color="#bd4b4b";
    private boolean isMain = false;

    @ElementCollection
    private List<String> teamMembers;

    @ElementCollection
    private List<ProjectTodo> todos;
}
