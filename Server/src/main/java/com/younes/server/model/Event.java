package com.younes.server.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String start;
    private String end;
    private String backgroundColor;
    private String borderColor;
    private Boolean allDay;
}
