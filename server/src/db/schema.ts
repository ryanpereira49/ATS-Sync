import { pgTable, serial, text, varchar, integer, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const skillProficiencyEnum = pgEnum("proficiency_enum", ["EXPERT", "ADVANCED", "INTERMEDIATE", "BEGINNER"]);

// --- 1. User ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(), // Renamed to accurately reflect storage
  email: varchar("email", { length: 256 }).unique(),
});

// --- 2. Profile ---
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }), // FK, OneToOne constraint enforced by unique()
});

// --- 3. PersonalDetails ---
export const personalDetails = pgTable("personal_details", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .unique()
    .references(() => profiles.id, { onDelete: "cascade" }), // FK, OneToOne
  fullName: varchar("full_name", { length: 256 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  linkedinUrl: varchar("linkedin_url", { length: 256 }),
  city: varchar("city", { length: 100 }),
});

// --- 4. Education ---
export const education = pgTable("education_entries", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }), // FK
  schoolName: varchar("school_name", { length: 256 }),
  degree: varchar("degree", { length: 256 }),
  graduationDate: date("graduation_date", { mode: "date" }), // LocalDate mapping
});

// --- 5. Skill ---
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }), // FK
  name: varchar("name", { length: 256 }),
  proficiency: skillProficiencyEnum("proficiency").notNull(),
  category: varchar("category", { length: 100 }),
});

// --- 6. Experience ---
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }), // FK
  company: varchar("company", { length: 256 }),
  title: varchar("title", { length: 256 }),
  startDate: date("start_date", { mode: "date" }),
  endDate: date("end_date", { mode: "date" }),
  description: text("description"),
});

// --- 7. BulletPoint ---
export const bulletPoints = pgTable("bullet_points", {
  id: serial("id").primaryKey(),
  experienceId: integer("experience_id")
    .notNull()
    .references(() => experiences.id, { onDelete: "cascade" }), // FK
  rawText: text("raw_text").notNull(), // TEXT, Required
  metric: varchar("metric", { length: 256 }), // Nullable
});

// --- 8. JobDescription ---
export const jobDescriptions = pgTable("job_descriptions", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }), // FK
  jobTitle: varchar("job_title", { length: 256 }),
  rawText: text("raw_text").notNull(), // TEXT, Required
  dateSubmitted: timestamp("date_submitted", { mode: "date" }).defaultNow().notNull(), // Instant mapping
});

// --- 9. GeneratedResume ---
export const generatedResumes = pgTable("generated_resumes", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }), // FK
  jobDescriptionId: integer("job_description_id")
    .notNull()
    .unique()
    .references(() => jobDescriptions.id, { onDelete: "cascade" }), // FK, OneToOne
  companyName: varchar("company_name", { length: 256 }),
  jobTitle: varchar("job_title", { length: 256 }),
  category: varchar("category", { length: 100 }),
  matchScore: integer("match_score"),
  content: text("content").notNull(), // Final resume content (HTML/JSON)
});

// --- Define Relations ---

// User <-> Profile (One-to-One)
export const userRelations = relations(users, ({ one }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
}));

// Profile Relations (The central hub)
export const profileRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
  personalDetails: one(personalDetails, { fields: [profiles.id], references: [personalDetails.profileId] }),

  experiences: many(experiences),
  educationEntries: many(education),
  skills: many(skills),
  jobDescriptions: many(jobDescriptions),
  generatedResumes: many(generatedResumes),
}));

// PersonalDetails <-> Profile (One-to-One)
export const personalDetailsRelations = relations(personalDetails, ({ one }) => ({
  profile: one(profiles, { fields: [personalDetails.profileId], references: [profiles.id] }),
}));

// Experience Relations
export const experienceRelations = relations(experiences, ({ one, many }) => ({
  profile: one(profiles, { fields: [experiences.profileId], references: [profiles.id] }),
  bulletPoints: many(bulletPoints),
}));

// BulletPoint Relations
export const bulletPointRelations = relations(bulletPoints, ({ one }) => ({
  experience: one(experiences, { fields: [bulletPoints.experienceId], references: [experiences.id] }),
}));

// JobDescription Relations
export const jobDescriptionRelations = relations(jobDescriptions, ({ one }) => ({
  profile: one(profiles, { fields: [jobDescriptions.profileId], references: [profiles.id] }),
  // JobDescription is the "owner" of the 1:1 link
  generatedResume: one(generatedResumes, { fields: [jobDescriptions.id], references: [generatedResumes.jobDescriptionId] }),
}));

// GeneratedResume Relations
export const generatedResumeRelations = relations(generatedResumes, ({ one }) => ({
  profile: one(profiles, { fields: [generatedResumes.profileId], references: [profiles.id] }),
  // Inverse side of the 1:1 link
  sourceJobDescription: one(jobDescriptions, { fields: [generatedResumes.jobDescriptionId], references: [jobDescriptions.id] }),
}));

// Education Relations (Simple Many-to-One)
export const educationRelations = relations(education, ({ one }) => ({
  profile: one(profiles, { fields: [education.profileId], references: [profiles.id] }),
}));

// Skill Relations (Simple Many-to-One)
export const skillRelations = relations(skills, ({ one }) => ({
  profile: one(profiles, { fields: [skills.profileId], references: [profiles.id] }),
}));
