import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "#db/schema.js";
import { beforeAll, afterAll } from "vitest";
if (!process.env.TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is not set in environment variables");
}
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL!;

export function getTestDb() {
  const client = new Client({ connectionString: TEST_DATABASE_URL });
  // Connect once per test run
  beforeAll(async () => {
    await client.connect();
  });
  // Disconnect after all tests are done
  afterAll(async () => {
    await client.end();
  });

  return drizzle(client, { schema });
}
