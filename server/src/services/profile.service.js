import { db } from "../db/index.js";
import { profiles, users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const profileService = {
  // Get profile by user ID
  getProfileByUserId: async (userId) => {
    return await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
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
};
