// src/main/java/com/atssync/model/User.java

package com.atssync.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "users") // Good practice to avoid SQL keyword conflicts
@Data
@EqualsAndHashCode(of = "id")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String username;

    @Column(nullable = false)
    private String password; // Stores BCrypt Hash

    @Column(unique = true, nullable = false)
    private String email;

    // Relationship to Profile (Inverse Side)
    // Cascade.ALL ensures if the User is deleted, the Profile is deleted.
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Profile profile;

    // Note: This User entity will also need to implement Spring Security's UserDetails later (Step 2).
}