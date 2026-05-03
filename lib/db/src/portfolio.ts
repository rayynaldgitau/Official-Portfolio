import { pgTable, serial, text, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ─── Projects ───────────────────────────────────────────────────────────────
export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"),
  tags: jsonb("tags").notNull().default([]),
  views: integer("views").notNull().default(0),
  url: text("url"),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;

// ─── Skills ─────────────────────────────────────────────────────────────────
export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level").notNull().default(80),
  category: text("category").notNull().default(""),
});

export const insertSkillSchema = createInsertSchema(skillsTable).omit({ id: true });
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skillsTable.$inferSelect;

// ─── Experience ─────────────────────────────────────────────────────────────
export const experienceTable = pgTable("experience", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull().default(""),
  startDate: text("start_date").notNull().default(""),
  endDate: text("end_date").notNull().default(""),
  current: boolean("current").notNull().default(false),
  description: text("description").notNull().default(""),
  achievements: jsonb("achievements").notNull().default([]),
});

export const insertExperienceSchema = createInsertSchema(experienceTable).omit({ id: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experienceTable.$inferSelect;

// ─── Certifications ──────────────────────────────────────────────────────────
export const certificationsTable = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  year: text("year").notNull().default(""),
  url: text("url").notNull().default(""),
});

export const insertCertSchema = createInsertSchema(certificationsTable).omit({ id: true });
export type InsertCert = z.infer<typeof insertCertSchema>;
export type Cert = typeof certificationsTable.$inferSelect;

// ─── Profile ─────────────────────────────────────────────────────────────────
export const profileTable = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  title: text("title").notNull().default(""),
  bio: text("bio").notNull().default(""),
  university: text("university").notNull().default(""),
  currentCompany: text("current_company").notNull().default(""),
  profilePicUrl: text("profile_pic_url"),
  logoUrl: text("logo_url"),
  resumeUrl: text("resume_url"),
  resumeName: text("resume_name"),
});

export const insertProfileSchema = createInsertSchema(profileTable).omit({ id: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profileTable.$inferSelect;

// ─── Social Links ────────────────────────────────────────────────────────────
export const socialLinksTable = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  label: text("label").notNull(),
  url: text("url").notNull(),
});

export const insertSocialLinkSchema = createInsertSchema(socialLinksTable).omit({ id: true });
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type SocialLink = typeof socialLinksTable.$inferSelect;

// ─── About ───────────────────────────────────────────────────────────────────
export const aboutTable = pgTable("about", {
  id: serial("id").primaryKey(),
  subtitle: text("subtitle").notNull().default(""),
  cards: jsonb("cards").notNull().default([]),
  stats: jsonb("stats").notNull().default({}),
});

export const insertAboutSchema = createInsertSchema(aboutTable).omit({ id: true });
export type InsertAbout = z.infer<typeof insertAboutSchema>;
export type About = typeof aboutTable.$inferSelect;
