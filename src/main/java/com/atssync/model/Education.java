// src/main/java/com/atssync/model/Education.java

package com.atssync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One relationship back to the owner Profile
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Column(nullable = false)
    private String schoolName;

    @Column(nullable = false)
    private String degree;

    private LocalDate graduationDate;
}