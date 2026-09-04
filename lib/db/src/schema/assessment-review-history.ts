import { createInsertSchema } from "drizzle-zod";
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { assessmentsTable } from "./assessments";

export const assessmentReviewHistoryTable = pgTable(
  "assessment_review_history",
  {
    id: serial("id").primaryKey(),
    assessmentId: integer("assessment_id")
      .notNull()
      .references(() => assessmentsTable.id, { onDelete: "cascade" }),
    status: text("status").notNull(),
    note: text("note"),
    adminNote: text("admin_note"),
    actorId: text("actor_id").notNull(),
    actorRole: text("actor_role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("assessment_review_history_assessment_idx").on(table.assessmentId)],
);

export const insertAssessmentReviewHistorySchema = createInsertSchema(
  assessmentReviewHistoryTable,
).omit({
  id: true,
  createdAt: true,
});

export type InsertAssessmentReviewHistory = z.infer<
  typeof insertAssessmentReviewHistorySchema
>;
export type AssessmentReviewHistory =
  typeof assessmentReviewHistoryTable.$inferSelect;