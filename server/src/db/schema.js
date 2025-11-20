import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/* ---------------------- USERS ---------------------- */

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow()
});

/* ---------------------- PROFILES ---------------------- */

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),

  fullName: text('full_name'),
  email: text('email'),
  phoneNumber: text('phone_number'),
  summary: text('summary'),

  bio: text('bio'),
  phone: text('phone'),
  location: text('location'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

/* ---------------------- SKILLS ---------------------- */

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),

  type: text('type').notNull(),      // Technical, Soft, etc.
  list: text('list').array().notNull() // array of skill strings
});

/* ---------------------- WORK EXPERIENCE ---------------------- */

export const workExperience = pgTable('work_experience', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),

  company: text('company').notNull(),
  role: text('role').notNull(),
  startDate: varchar('start_date', { length: 10 }).notNull(), // YYYY-MM
  endDate: varchar('end_date', { length: 10 }).notNull(),     // YYYY-MM or 'Present'

  responsibilities: text('responsibilities').array().notNull() // list of strings
});

/* ---------------------- EDUCATION ---------------------- */

export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),

  institution: text('institution').notNull(),
  degree: text('degree').notNull(),

  startDate: varchar('start_date', { length: 4 }).notNull(), // YYYY
  endDate: varchar('end_date', { length: 4 }).notNull(),     // YYYY

  gpa: text('gpa'),
  honors: text('honors').array() // array of honors strings
});

/* ---------------------- PROJECTS ---------------------- */

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  description: text('description').notNull(),

  technologiesUsed: text('technologies_used').array().notNull(),
  url: text('url')
});

/* ---------------------- CERTIFICATIONS ---------------------- */

export const certifications = pgTable('certifications', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),

  name: text('name').notNull()
});

/* ---------------------- AWARDS ---------------------- */

export const awards = pgTable('awards', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  organization: text('organization').notNull(),
  date: varchar('date', { length: 10 }).notNull() // YYYY-MM
});

/* ---------------------- LANGUAGES ---------------------- */

export const languages = pgTable('languages', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),

  language: text('language').notNull(),
  proficiency: text('proficiency').notNull() // Native, Fluent, etc.
});

/* ---------------------- RELATIONS ---------------------- */

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId]
  })
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id]
  }),

  skills: many(skills),
  workExperience: many(workExperience),
  education: many(education),
  projects: many(projects),
  certifications: many(certifications),
  awards: many(awards),
  languages: many(languages)
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  profile: one(profiles, {
    fields: [skills.profileId],
    references: [profiles.id],
  }),
}));

export const workExperienceRelations = relations(workExperience, ({ one }) => ({
  profile: one(profiles, {
    fields: [workExperience.profileId],
    references: [profiles.id],
  }),
}));

export const educationRelations = relations(education, ({ one }) => ({
  profile: one(profiles, {
    fields: [education.profileId],
    references: [profiles.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  profile: one(profiles, {
    fields: [projects.profileId],
    references: [profiles.id],
  }),
}));

export const certificationsRelations = relations(certifications, ({ one }) => ({
  profile: one(profiles, {
    fields: [certifications.profileId],
    references: [profiles.id],
  }),
}));

export const awardsRelations = relations(awards, ({ one }) => ({
  profile: one(profiles, {
    fields: [awards.profileId],
    references: [profiles.id],
  }),
}));

export const languagesRelations = relations(languages, ({ one }) => ({
  profile: one(profiles, {
    fields: [languages.profileId],
    references: [profiles.id],
  }),
}));
