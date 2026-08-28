package com.younes.server.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String deadline;
    private String owner;
    private String color;

    @ElementCollection
    private List<String> teamMembers;

    @ElementCollection
    private List<ProjectTodo> todos;
}
