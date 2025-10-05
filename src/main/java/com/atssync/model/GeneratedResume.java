// src/main/java/com/atssync/model/GeneratedResume.java

package com.atssync.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class GeneratedResume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One back to the owner Profile
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    // One-to-One link back to the JobDescription that prompted this generation (Owner Side)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_description_id", nullable = false, unique = true)
    private JobDescription jobDescription;

    @Column(length = 100)
    private String companyName;

    @Column(length = 150)
    private String jobTitle; // The title used for tailoring
    
    @Column(length = 50)
    private String category; // Job category (e.g., 'Software Development')

    private Integer matchScore; // AI relevance score (1-100)

    // Stores the final resume content (e.g., in HTML or JSON structure)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
}