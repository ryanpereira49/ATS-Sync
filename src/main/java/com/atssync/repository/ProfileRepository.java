// src/main/java/com/atssync/repository/ProfileRepository.java

package com.atssync.repository;

import com.atssync.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    // Custom method to quickly fetch a profile by its associated User ID
    Profile findByUserId(Long userId);
}