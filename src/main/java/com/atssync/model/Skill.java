// src/main/java/com/atssync/model/Skill.java

package com.atssync.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One relationship back to the owner Profile
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Column(nullable = false)
    private String name;

    // Used for AI prioritization (e.g., EXPERT, ADVANCED, INTERMEDIATE)
    @Column(length = 20) 
    private String proficiency; 
    
    // Category (e.g., 'Programming Language', 'Cloud Platform', 'Soft Skill')
    @Column(length = 50)
    private String category; 
}