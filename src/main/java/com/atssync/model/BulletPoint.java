// src/main/java/com/atssync/model/BulletPoint.java

package com.atssync.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class BulletPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One relationship back to the specific Experience job
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experience_id", nullable = false)
    private Experience experience;

    // The raw text of the achievement
    @Column(nullable = false, columnDefinition = "TEXT")
    private String rawText;

    // Optional: Quantifiable metric extracted or provided by user
    @Column(length = 255)
    private String metric; 
}