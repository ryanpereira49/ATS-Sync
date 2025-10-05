package com.atssync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ManyToOne back to the owner Profile
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String title;

    private LocalDate startDate;
    private LocalDate endDate; // Nullable for current job

    // High-level summary of the role
    @Column(columnDefinition = "TEXT")
    private String description; 

    // One-to-Many to BulletPoints (the quantifiable achievements)
    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<BulletPoint> bulletPoints = new HashSet<>();
}