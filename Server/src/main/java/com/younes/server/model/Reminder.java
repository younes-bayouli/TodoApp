package com.younes.server.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long eventId;
    private String reminderTime; // e.g. "1week", "3days", "1day"
    private LocalDateTime deliveredAt;
    private Boolean delivered = false;
}
