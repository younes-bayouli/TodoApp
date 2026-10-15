package com.younes.server.service;

import com.younes.server.model.Event;
import com.younes.server.repository.EventRepository;
import com.younes.server.repository.TaskRepository;
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

    //@Scheduled(cron = "0 0 9 * * *", zone = "Africa/Tunis")
    @Scheduled(fixedRate = 60000)
    public void checkEventsReminders() {
        LocalDate today = LocalDate.now();
        LocalDate oneWeekLater = today.plusWeeks(1);

        List<Event> events = eventRepository.findByStartBetween(today, oneWeekLater);

        for (Event event : events) {
            String option = event.getReminderOption();
            String msg="";
            LocalDate reminderDate ;
             switch (option) {
                    case "1week" -> {
                        msg = "Reminder: Your event '" + event.getTitle() + "' is scheduled for Tomorrow.";
                        reminderDate = event.getStart().minusWeeks(1);
                    }
                    case "3days" -> {
                        reminderDate = event.getStart().minusDays(3);
                        msg = "Reminder: Your event '" + event.getTitle() + "' is scheduled for 3 days from now.";
                    }
                    case "1day" -> {
                        reminderDate = event.getStart().minusDays(1);
                        msg = "Reminder: Your event '" + event.getTitle() + "' is scheduled for tomorrow.";
                    }
                    default -> reminderDate = null;
                };

                if (reminderDate == null || !reminderDate.equals(today)) {
                    continue;
                }

            System.out.println(msg);
        }
    }
}
