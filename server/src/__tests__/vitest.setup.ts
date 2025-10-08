import dotenv from "dotenv";
import { resolve } from "path";

const mode = process.env.NODE_ENV || "dev";
const envFile = `.env.${mode}`;
dotenv.config({ path: resolve(process.cwd(), envFile) });

console.log(`Loaded ${envFile} for Vitest`);
