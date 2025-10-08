// tests/models/user.test.ts

import { describe, it, expect, beforeAll } from "vitest";
import { getTestDb } from "./test.setup.js";
import { users } from "#db/schema.js";
import { eq } from "drizzle-orm";

const db = getTestDb();

describe("User Model CRUD Operations", () => {
  beforeAll(async () => {
    await db.delete(users);
  });

  it("should create and retrieve a user successfully", async () => {
    const testUsername = "testuser123";
    const testEmail = "test123@example.com";
    const passwordHash = "fakehashedpassword";

    // CREATE operation
    const insertedUsers = await db
      .insert(users)
      .values({
        username: testUsername,
        passwordHash: passwordHash,
        email: testEmail,
      })
      .returning();

    expect(insertedUsers.length).toBe(1);
    const insertedUser = insertedUsers[0];

    // READ operation (by ID)
    const retrievedUsers = await db.select().from(users).where(eq(users.id, insertedUser.id));

    expect(retrievedUsers.length).toBe(1);
    const retrievedUser = retrievedUsers[0];

    // Assertions
    expect(retrievedUser.username).toBe(testUsername);
    expect(retrievedUser.passwordHash).toBe(passwordHash);
    expect(retrievedUser.email).toBe(testEmail);
    expect(retrievedUser.id).toBeTypeOf("number");
  });

  // 4. Test: Unique Constraint Failure (Security/Integrity Check)
  it("should fail to create a user with a duplicate username (Unique Constraint)", async () => {
    // First, insert a user successfully
    const duplicateUsername = "duplicate_user";
    await db.insert(users).values({
      username: duplicateUsername,
      passwordHash: "p1",
      email: "unique1@mail.com",
    });

    // Attempt to insert the same username again
    await expect(
      db.insert(users).values({
        username: duplicateUsername,
        passwordHash: "p2",
        email: "unique2@mail.com", // Unique email still won't help here
      }),
    ).rejects.toThrow(); // Drizzle will throw a Postgres error on unique violation
  });

  // 5. Test: Update (e.g., changing email)
  it("should update the user email successfully", async () => {
    const initialEmail = "update_test@old.com";
    const newEmail = "update_test@new.com";
    const testUsername = "updater_user";

    const [insertedUser] = await db
      .insert(users)
      .values({
        username: testUsername,
        passwordHash: "test",
        email: initialEmail,
      })
      .returning();

    // UPDATE operation
    const [updatedUser] = await db.update(users).set({ email: newEmail }).where(eq(users.id, insertedUser.id)).returning();

    expect(updatedUser.email).toBe(newEmail);

    // Verify READ operation
    const [verifiedUser] = await db.select().from(users).where(eq(users.id, insertedUser.id));
    expect(verifiedUser.email).toBe(newEmail);
  });
});
