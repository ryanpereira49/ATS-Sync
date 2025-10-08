CREATE TYPE "public"."proficiency_enum" AS ENUM('EXPERT', 'ADVANCED', 'INTERMEDIATE', 'BEGINNER');--> statement-breakpoint
CREATE TABLE "bullet_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"experience_id" integer NOT NULL,
	"raw_text" text NOT NULL,
	"metric" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "education_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"school_name" varchar(256),
	"degree" varchar(256),
	"graduation_date" date
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"company" varchar(256),
	"title" varchar(256),
	"start_date" date,
	"end_date" date,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "generated_resumes" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"job_description_id" integer NOT NULL,
	"company_name" varchar(256),
	"job_title" varchar(256),
	"category" varchar(100),
	"match_score" integer,
	"content" text NOT NULL,
	CONSTRAINT "generated_resumes_job_description_id_unique" UNIQUE("job_description_id")
);
--> statement-breakpoint
CREATE TABLE "job_descriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"job_title" varchar(256),
	"raw_text" text NOT NULL,
	"date_submitted" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"full_name" varchar(256),
	"phone_number" varchar(20),
	"linkedin_url" varchar(256),
	"city" varchar(100),
	CONSTRAINT "personal_details_profile_id_unique" UNIQUE("profile_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"name" varchar(256),
	"proficiency" "proficiency_enum" NOT NULL,
	"category" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(256) NOT NULL,
	"password_hash" text NOT NULL,
	"email" varchar(256),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bullet_points" ADD CONSTRAINT "bullet_points_experience_id_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_entries" ADD CONSTRAINT "education_entries_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_resumes" ADD CONSTRAINT "generated_resumes_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_resumes" ADD CONSTRAINT "generated_resumes_job_description_id_job_descriptions_id_fk" FOREIGN KEY ("job_description_id") REFERENCES "public"."job_descriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_descriptions" ADD CONSTRAINT "job_descriptions_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_details" ADD CONSTRAINT "personal_details_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;