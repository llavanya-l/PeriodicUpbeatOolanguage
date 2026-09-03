import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id"),
  applicantName: text("applicant_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  age: integer("age"),
  cityDistrict: text("city_district"),
  state: text("state"),
  program: text("program").notNull(),
  region: text("region").notNull(),
  annualIncome: real("annual_income"),
  householdSize: integer("household_size").notNull(),
  employmentStatus: text("employment_status").notNull(),
  hasDisability: boolean("has_disability").notNull(),
  requestedSupport: text("requested_support").notNull(),
  reasonForApplying: text("reason_for_applying"),
  additionalInformation: text("additional_information"),
  notes: text("notes"),
  eligibilityScore: integer("eligibility_score").notNull(),
  eligibilityStatus: text("eligibility_status").notNull(),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewNote: text("review_note"),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({
  id: true,
  clerkUserId: true,
  submittedAt: true,
  reviewedAt: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;