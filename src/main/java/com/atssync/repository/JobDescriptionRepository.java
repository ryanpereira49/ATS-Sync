// src/main/java/com/atssync/repository/JobDescriptionRepository.java

package com.atssync.repository;

import com.atssync.model.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {
    // Standard CRUD methods inherited
}