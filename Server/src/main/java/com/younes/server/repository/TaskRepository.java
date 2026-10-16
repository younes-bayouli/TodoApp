package com.younes.server.repository;

import java.time.LocalTime;
import java.util.List;

import com.younes.server.model.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("""
                SELECT t
                FROM Task t
                WHERE t.start < :end
                  AND t.end > :start
            """)
    List<Task> findTasksOverlapping(
            @Param("start") LocalTime start,
            @Param("end") LocalTime end);

        List<Task> findByStart(LocalTime start);
}
