// src/main/java/com/atssync/model/PersonalDetails.java

package com.atssync.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PersonalDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One-to-One link back to Profile (Owner Side of the relationship)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false, unique = true)
    private Profile profile;

    @Column(length = 100)
    private String fullName;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 255)
    private String linkedinUrl;
    
    @Column(length = 50)
    private String city;
}