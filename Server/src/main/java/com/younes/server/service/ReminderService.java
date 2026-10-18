package com.younes.server.service;

import com.younes.server.model.Event;
import com.younes.server.model.Task;
import com.younes.server.repository.EventRepository;
import com.younes.server.repository.TaskRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
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

    @Scheduled(cron = "0 15 8 * * *")
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

    @Scheduled(cron = "0 * * * * *")   // second 0 of every minute
    @Transactional (readOnly = true)    // needed: `days` is a lazy @ElementCollection
    public void checkTasks() {
        System.out.println("Checking tasks at " + LocalDateTime.now());
        LocalTime nowMinute = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        int dayIndex = LocalDate.now().getDayOfWeek().getValue() - 1; // Monday=0 ... Sunday=6
    
        List<Task> tasks = taskRepository.findByStart(nowMinute);
    
        for (Task task : tasks) {
            List<Boolean> days = task.getDays();
            if (days == null || days.size() <= dayIndex || !Boolean.TRUE.equals(days.get(dayIndex))) {
                continue;
            }
            System.out.println("Found task: " + task.getTitle());
            notificationService.broadCast(buildTitle(task), buildBody(task));
        }
    }
    
    private String buildTitle(Task task) {
        return "⏰ " + task.getTitle();
    }
    
    private String buildBody(Task task) {
        StringBuilder body = new StringBuilder("Starts now");
        if (task.getEnd() != null) {
            body.append(" · until ").append(task.getEnd().format(DateTimeFormatter.ofPattern("HH:mm")));
        }
        if (task.getDetails() != null && !task.getDetails().isBlank()) {
            body.append("\n").append(task.getDetails());
        }
        return body.toString();
    }
}
