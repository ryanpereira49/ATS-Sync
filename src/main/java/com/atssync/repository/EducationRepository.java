// src/main/java/com/atssync/repository/EducationRepository.java

package com.atssync.repository;

import com.atssync.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> {
    // Standard CRUD methods inherited
}