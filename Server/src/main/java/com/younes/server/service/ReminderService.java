package com.younes.server.service;

import com.google.api.client.util.DateTime;
import com.younes.server.model.Event;
import com.younes.server.model.Task;
import com.younes.server.repository.EventRepository;
import com.younes.server.repository.TaskRepository;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReminderService {
    private final EventRepository eventRepository;
    private final TaskRepository taskRepository;
    private NotificationService notificationService;

    public ReminderService(EventRepository eventRepository, TaskRepository taskRepository,
            NotificationService notificationService) {
        this.eventRepository = eventRepository;
        this.taskRepository = taskRepository;
        this.notificationService = notificationService;
    }

    //@Scheduled(cron = "0 48 9 * * *")
    @Scheduled(fixedRate = 30000)
    public void checkReminders() {
        LocalDate today = LocalDate.now();
        LocalDate oneWeekLater = today.plusWeeks(1);

        List<Event> events = eventRepository.findByStartBetween(today, oneWeekLater);

        for (Event event : events) {
            String option = event.getReminderOption();
            String msg="";
            LocalDate reminderDate ;
             switch (option) {
                    case "1week" -> {
                        msg = "Your event '" + event.getTitle() + "' is scheduled for one week from now.";
                        reminderDate = event.getStart().minusWeeks(1);
                    }
                    case "3days" -> {
                        reminderDate = event.getStart().minusDays(3);
                        msg = "Your event '" + event.getTitle() + "' is scheduled for 3 days from now.";
                    }
                    case "1day" -> {
                        reminderDate = event.getStart().minusDays(1);
                        msg = "Your event '" + event.getTitle() + "' is scheduled for tomorrow.";
                    }
                    default -> reminderDate = null;
                };

                if (reminderDate == null || !reminderDate.equals(today)) {
                    continue;
                }

            notificationService.broadCast("Reminder: ", msg);
        }
    }

    @Scheduled(fixedRate = 60000)
    public void checkTasks() {
        LocalDateTime now= LocalDateTime.now();
        System.out.println(now);
    }
}
