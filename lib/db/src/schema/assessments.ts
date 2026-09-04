import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const assessmentsTable = pgTable(
  "assessments",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    companyName: text("company_name").notNull(),
    cin: text("cin").notNull(),
    companyType: text("company_type").notNull(),
    financialYear: text("financial_year").notNull(),
    registeredState: text("registered_state"),
    industry: text("industry"),
    netWorth: doublePrecision("net_worth").notNull(),
    turnover: doublePrecision("turnover").notNull(),
    netProfit: doublePrecision("net_profit").notNull(),
    profitYear1: doublePrecision("profit_year_1"),
    profitYear2: doublePrecision("profit_year_2"),
    profitYear3: doublePrecision("profit_year_3"),
    averageProfit: doublePrecision("average_profit"),
    indicativeCsrObligation: doublePrecision("indicative_csr_obligation"),
    csrApplicable: boolean("csr_applicable").notNull(),
    applicabilityReason: text("applicability_reason").notNull(),
    csrPolicyStatus: text("csr_policy_status"),
    governanceStatus: text("governance_status"),
    annualActionPlanStatus: text("annual_action_plan_status"),
    implementingAgencyStatus: text("implementing_agency_status"),
    csrFocusAreas: text("csr_focus_areas").array().notNull().default([]),
    additionalNotes: text("additional_notes"),
    reviewStatus: text("review_status").notNull().default("pending"),
    reviewNote: text("review_note"),
    adminNote: text("admin_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("assessments_user_id_idx").on(table.userId),
    index("assessments_review_status_idx").on(table.reviewStatus),
    index("assessments_created_at_idx").on(table.createdAt),
  ],
);

export const insertAssessmentSchema = createInsertSchema(assessmentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentsTable.$inferSelect;