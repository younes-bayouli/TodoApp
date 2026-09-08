package com.younes.server.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@Embeddable
public class ProjectTodo {
    private Long id;
    @NotBlank
    private String title;
    private Boolean completed=false;
    private String priority="medium";
}
