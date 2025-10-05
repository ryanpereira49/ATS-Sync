// src/main/java/com/atssync/repository/BulletPointRepository.java

package com.atssync.repository;

import com.atssync.model.BulletPoint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BulletPointRepository extends JpaRepository<BulletPoint, Long> {
    // Standard CRUD methods inherited
}