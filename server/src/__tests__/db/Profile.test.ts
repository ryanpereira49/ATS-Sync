// tests/models/profile.test.ts

import { describe, it, expect, beforeAll } from "vitest";
import { getTestDb } from "./test.setup.js";
import { users, profiles, skills } from "../../db/schema.js"; // Import relevant tables
import { eq } from "drizzle-orm";
import { SkillProficiency } from "../../constants/SkillProficiency.js"; // Import the Enum

const db = getTestDb();

describe("Profile Model Relationship Testing", () => {
  // Setup: Clean the database tables before testing
  beforeAll(async () => {
    // Cascade delete ensures dependent records are removed
    await db.delete(profiles);
    await db.delete(users);
  });

  // Test data constants
  const testUsername = "profile_test_user";
  const testEmail = "profile_test@example.com";

  // 1. Test One-to-One and Basic Creation
  it("should create a User and correctly link a Profile to it (1:1)", async () => {
    // 1a. Create the parent User
    const [insertedUser] = await db
      .insert(users)
      .values({
        username: testUsername,
        passwordHash: "hashed123",
        email: testEmail,
      })
      .returning();

    expect(insertedUser).toBeDefined();

    // 1b. CREATE Profile, linking it via the userId FK
    const [insertedProfile] = await db
      .insert(profiles)
      .values({
        userId: insertedUser.id,
      })
      .returning();

    // Assertions
    expect(insertedProfile).toBeDefined();
    expect(insertedProfile.userId).toBe(insertedUser.id);
  });

  // 2. Test One-to-Many relationship (linking a Skill)
  it("should allow creating and retrieving associated skills (1:N)", async () => {
    // Re-fetch the previously created user/profile for linking
    const [userRecord] = await db.select().from(users).where(eq(users.username, testUsername));
    const [profileRecord] = await db.select().from(profiles).where(eq(profiles.userId, userRecord.id));

    // CREATE two Skill records linked to the Profile
    await db.insert(skills).values([
      {
        profileId: profileRecord.id,
        name: "TypeScript",
        proficiency: SkillProficiency.EXPERT,
        category: "Language",
      },
      {
        profileId: profileRecord.id,
        name: "PostgreSQL",
        proficiency: SkillProficiency.ADVANCED,
        category: "Database",
      },
    ]);

    // Count assertion
    const associatedSkills = await db.select().from(skills).where(eq(skills.profileId, profileRecord.id));
    expect(associatedSkills.length).toBe(2);
    expect(associatedSkills.every((s) => s.profileId === profileRecord.id)).toBe(true);
  });

  // 3. Test Eager Loading (Verifying Drizzle Relations)
  it("should fetch Profile with its User and related Skills (Eager Load)", async () => {
    const [profileRecord] = await db
      .select()
      .from(profiles)
      .where(
        // Fetch the Profile that belongs to the test user
        eq(profiles.userId, (await db.select({ id: users.id }).from(users).where(eq(users.username, testUsername)))[0].id),
      )
      .limit(1)
      .execute();

    // FETCH Profile with relations (this tests the Drizzle `relations` definitions)
    const [fetchedProfile] = await db.query.profiles.findMany({
      where: eq(profiles.id, profileRecord.id),
      with: {
        user: true, // One-to-One
        skills: true, // One-to-Many
      },
    });

    // Assertions on relationships
    expect(fetchedProfile).toBeDefined();

    // 1:1 assertion
    expect(fetchedProfile.user).toBeDefined();
    expect(fetchedProfile.user.username).toBe(testUsername);

    // 1:N assertion
    expect(fetchedProfile.skills).toBeDefined();
    expect(fetchedProfile.skills.length).toBe(2);
    expect(fetchedProfile.skills.map((s) => s.name)).toContain("TypeScript");
  });

  // 4. Test Foreign Key Constraint (Integrity Check)
  it("should fail to create a Profile for a non-existent User ID", async () => {
    const nonExistentUserId = 999999;

    // Attempt to insert a profile with a bad FK
    await expect(
      db.insert(profiles).values({
        userId: nonExistentUserId,
      }),
    ).rejects.toThrow(); // Expect a PostgreSQL foreign key violation error
  });
});
