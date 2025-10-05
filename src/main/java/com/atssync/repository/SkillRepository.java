// src/main/java/com/atssync/repository/SkillRepository.java

package com.atssync.repository;

import com.atssync.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    // Standard CRUD methods inherited
}