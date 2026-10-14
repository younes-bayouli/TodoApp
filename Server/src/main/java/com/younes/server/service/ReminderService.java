package com.younes.server.service;

import com.younes.server.model.Event;
import com.younes.server.model.Reminder;
import com.younes.server.repository.EventRepository;
import com.younes.server.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReminderService {
    private final EventRepository eventRepository;
    private final ReminderRepository reminderRepository;

    @Scheduled(fixedRate = 60000)
    public void checkEventsReminders() {
        LocalDate today = LocalDate.now();

        List<Event> events = eventRepository.findAll();

        for (Event event : events) {
            for (String option : event.getReminderOptions()) {

                LocalDate reminderDate = switch (option) {
                    case "1week" -> event.getStart().minusWeeks(1);
                    case "3days" -> event.getStart().minusDays(3);
                    case "1day" -> event.getStart().minusDays(1);
                    default -> null;
                };

                if (reminderDate == null || !reminderDate.equals(today)) {
                    continue;
                }

                boolean alreadyDelivered =
                        reminderRepository.existsByEventIdAndReminderTimeAndDeliveredTrue(
                                event.getId(), option
                        );

                if (alreadyDelivered) {
                    continue;
                }

                Reminder reminder = new Reminder();
                reminder.setEventId(event.getId());
                reminder.setReminderTime(option);
                reminder.setDeliveredAt(LocalDateTime.now());
                reminder.setDelivered(true);

                reminderRepository.save(reminder);


            }
        }
    }
}
