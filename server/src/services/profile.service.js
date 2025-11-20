import { db } from "../db/index.js";
import { profiles, users, skills, workExperience, education, projects, certifications, awards, languages } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const profileService = {
  // Get profile by user ID
  getProfileByUserId: async (userId) => {
    return await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
      with: {
        skills: true,
        workExperience: true,
        education: true,
        projects: true,
        certifications: true,
        awards: true,
        languages: true,
      },
    });
  },

  // Create profile for a user
  createProfile: async (userId, profileData) => {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (user.length === 0) {
      throw new Error("User not found.");
    }

    // Check if profile already exists
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (existingProfile.length > 0) {
      throw new Error("Profile already exists for this user.");
    }

    return await db
      .insert(profiles)
      .values({ userId, ...profileData })
      .returning();
  },

  // Update profile by user ID
  updateProfile: async (userId, profileData) => {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (existingProfile.length === 0) {
      throw new Error("Profile not found for this user.");
    }

    return await db
      .update(profiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
  },

  // Delete profile by user ID
  deleteProfile: async (userId) => {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (existingProfile.length === 0) {
      throw new Error("Profile not found for this user.");
    }

    return await db
      .delete(profiles)
      .where(eq(profiles.userId, userId))
      .returning();
  },

  // Save extracted resume data
  saveExtractedResumeData: async (userId, extractedData) => {
    return await db.transaction(async (tx) => {
      // 1. Create or Update Profile
      let profileId;
      const existingProfile = await tx
        .select()
        .from(profiles)
        .where(eq(profiles.userId, userId));

      if (existingProfile.length > 0) {
        profileId = existingProfile[0].id;
        await tx
          .update(profiles)
          .set({
            fullName: extractedData.fullName,
            email: extractedData.email,
            phoneNumber: extractedData.phoneNumber,
            summary: extractedData.summary,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, profileId));
      } else {
        const newProfile = await tx
          .insert(profiles)
          .values({
            userId,
            fullName: extractedData.fullName,
            email: extractedData.email,
            phoneNumber: extractedData.phoneNumber,
            summary: extractedData.summary,
          })
          .returning();
        profileId = newProfile[0].id;
      }

      // 2. Helper to delete and insert related data
      const replaceRelatedData = async (table, data) => {
        await tx.delete(table).where(eq(table.profileId, profileId));
        if (data && data.length > 0) {
          const dataWithProfileId = data.map((item) => ({
            ...item,
            profileId,
          }));
          await tx.insert(table).values(dataWithProfileId);
        }
      };

      // 3. Update Related Tables
      await replaceRelatedData(skills, extractedData.skills);
      await replaceRelatedData(workExperience, extractedData.workExperience);
      await replaceRelatedData(education, extractedData.education);
      await replaceRelatedData(projects, extractedData.projects);
      
      // Handle simple string arrays for certifications
      await tx.delete(certifications).where(eq(certifications.profileId, profileId));
      if (extractedData.certifications && extractedData.certifications.length > 0) {
          const certs = extractedData.certifications.map(name => ({
              name,
              profileId
          }));
          await tx.insert(certifications).values(certs);
      }

      await replaceRelatedData(awards, extractedData.awards);
      await replaceRelatedData(languages, extractedData.languages);

      return { message: "Resume data saved successfully", profileId };
    });
  },
};
