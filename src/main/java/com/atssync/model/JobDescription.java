// src/main/java/com/atssync/model/JobDescription.java

package com.atssync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Data
public class JobDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One back to the owner Profile
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;
    
    @Column(nullable = false, length = 150)
    private String jobTitle;

    // Stores the full, raw text of the job description
    @Column(nullable = false, columnDefinition = "TEXT")
    private String rawText;

    @Column(nullable = false)
    private Instant dateSubmitted = Instant.now();

    // One-to-One link to the resulting tailored resume (Inverse Side)
    // The GeneratedResume entity will own the foreign key
    @OneToOne(mappedBy = "jobDescription", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private GeneratedResume generatedResume; 
}