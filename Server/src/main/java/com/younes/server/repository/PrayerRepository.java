package com.younes.server.repository;

import com.younes.server.model.Prayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrayerRepository extends JpaRepository<Prayer, Long> {
}
