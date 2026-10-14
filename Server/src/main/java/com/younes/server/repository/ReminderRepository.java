package com.younes.server.repository;

import com.younes.server.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    boolean existsByEventIdAndReminderTimeAndDeliveredTrue(
            Long eventId,
            String reminderTime);
}
