import { createInsertSchema } from "drizzle-zod";
import {
  index,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const supportMessagesTable = pgTable(
  "support_messages",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("open"),
    adminResponse: text("admin_response"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("support_messages_user_id_idx").on(table.userId),
    index("support_messages_status_idx").on(table.status),
    index("support_messages_created_at_idx").on(table.createdAt),
  ],
);

export const insertSupportMessageSchema = createInsertSchema(
  supportMessagesTable,
).omit({
  id: true,
  userId: true,
  status: true,
  adminResponse: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;
export type SupportMessage = typeof supportMessagesTable.$inferSelect;