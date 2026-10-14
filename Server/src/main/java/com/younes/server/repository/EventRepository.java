package com.younes.server.repository;

import com.younes.server.model.Event;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStartBetween(LocalDate today, LocalDate oneWeekLater);
}
