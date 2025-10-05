// src/main/java/com/atssync/repository/ExperienceRepository.java

package com.atssync.repository;

import com.atssync.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    // Standard CRUD methods inherited
}