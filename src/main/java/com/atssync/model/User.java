// src/main/java/com/atssync/model/User.java

package com.atssync.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users") // Good practice to avoid SQL keyword conflicts
@Data
@EqualsAndHashCode(of = "id")
public class User implements UserDetails {

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

    // --- UserDetails Implementation ---

    // Define the user's roles/authorities
    // For ATS Sync, we can start with a single role 'USER'
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    // This uses the existing 'username' field (which implements the required interface method)
    // @Override
    // public String getUsername() { return username; } 

    // This uses the existing 'password' field (which implements the required interface method)
    // @Override
    // public String getPassword() { return password; }

    // Account state flags (set to true by default for a new user)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}