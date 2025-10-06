// src/main/java/com/atssync/config/SecurityConfig.java

package com.atssync.config;

import com.atssync.security.JwtAuthFilter; // Will be created in step 3
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter; // Injected JWT filter
    private final AuthenticationProvider authenticationProvider; // Injected Authentication Provider

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF protection (since we are stateless and use JWT)
            .csrf(csrf -> csrf.disable())

            // 2. Define authorization rules
            .authorizeHttpRequests(auth -> auth
                // Allow public access to registration and authentication endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                // Require authentication for all other requests
                .anyRequest().authenticated()
            )

            // 3. Set session management to STATELESS
            .sessionManagement(sess -> sess
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 4. Set the Authentication Provider
            .authenticationProvider(authenticationProvider)

            // 5. Add our custom JWT filter BEFORE the standard Spring filter
            .addFilterBefore(
                jwtAuthFilter, 
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}