import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

// You can specify any property from the node-postgres connection options
export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
  },
});
