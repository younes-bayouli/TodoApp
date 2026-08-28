package com.younes.server.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String start;
    private String end;
    
    @ElementCollection
    private List<Boolean> days;
    
    private String details;
}
