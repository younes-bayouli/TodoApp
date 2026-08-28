package com.younes.server.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class ProjectTodo {
    private Long id;
    private String title;
    private Boolean completed;
    private String priority;
}
