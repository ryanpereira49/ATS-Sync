// src/main/java/com/atssync/repository/UserRepository.java

package com.atssync.repository;

import com.atssync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Custom method required for Spring Security login process (Step 2)
    Optional<User> findByUsername(String username);
}