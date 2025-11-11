import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export const userService = {
  getUsers: async () => {
    return db.select().from(users);
  },
  createUser: async (userData) => {
    if (!userData.name || !userData.email) {
      throw new Error("Name and email are required.");
    }

    return await db.insert(users).values(userData).returning();
  },
};
