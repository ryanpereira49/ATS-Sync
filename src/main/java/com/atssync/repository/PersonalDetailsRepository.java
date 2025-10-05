// src/main/java/com/atssync/repository/PersonalDetailsRepository.java

package com.atssync.repository;

import com.atssync.model.PersonalDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonalDetailsRepository extends JpaRepository<PersonalDetails, Long> {
    // Standard CRUD methods inherited
}