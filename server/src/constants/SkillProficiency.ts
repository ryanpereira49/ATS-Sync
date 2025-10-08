// constants/SkillProficiency.ts

// 1. TypeScript Enum for code usage
export enum SkillProficiency {
  EXPERT = "EXPERT",
  ADVANCED = "ADVANCED",
  INTERMEDIATE = "INTERMEDIATE",
  BEGINNER = "BEGINNER",
}

// 2. Drizzle PG Enum for database schema
import { pgEnum } from "drizzle-orm/pg-core";

export const skillProficiencyEnum = pgEnum("proficiency_enum", [
  SkillProficiency.EXPERT,
  SkillProficiency.ADVANCED,
  SkillProficiency.INTERMEDIATE,
  SkillProficiency.BEGINNER,
]);
