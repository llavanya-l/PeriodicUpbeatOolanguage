import { and, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, supportMessagesTable } from "@workspace/db";
import {
  CreateSupportMessageBody,
  CreateSupportMessageResponse,
  ListAdminSupportMessagesResponse,
  ListSupportMessagesResponse,
  UpdateSupportMessageBody,
  UpdateSupportMessageParams,
  UpdateSupportMessageResponse,
} from "@workspace/api-zod";
import { requireAdmin, requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function clean(value: string): string {
  return value.trim();
}

router.get("/support/messages", requireAuth, async (req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(supportMessagesTable)
    .where(eq(supportMessagesTable.userId, req.authUser!.id))
    .orderBy(desc(supportMessagesTable.createdAt));
  res.json(ListSupportMessagesResponse.parse(messages));
});

router.post("/support/messages", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateSupportMessageBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid support message");
    res.status(400).json({ error: "Please complete all support message fields." });
    return;
  }

  const [message] = await db
    .insert(supportMessagesTable)
    .values({
      userId: req.authUser!.id,
      name: clean(parsed.data.name),
      email: req.authUser!.email || clean(parsed.data.email),
      subject: clean(parsed.data.subject),
      message: clean(parsed.data.message),
      status: "open",
      adminResponse: null,
    })
    .returning();
  res.status(201).json(CreateSupportMessageResponse.parse(message));
});

router.get("/admin/support/messages", requireAdmin, async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(supportMessagesTable)
    .orderBy(desc(supportMessagesTable.createdAt));
  res.json(ListAdminSupportMessagesResponse.parse(messages));
});

router.patch("/admin/support/messages/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateSupportMessageParams.safeParse(req.params);
  const parsed = UpdateSupportMessageBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Invalid support message update." });
    return;
  }

  const [message] = await db
    .select()
    .from(supportMessagesTable)
    .where(eq(supportMessagesTable.id, params.data.id));
  if (!message) {
    res.status(404).json({ error: "Support message not found." });
    return;
  }

  const [updated] = await db
    .update(supportMessagesTable)
    .set({
      status: parsed.data.status,
      adminResponse:
        parsed.data.adminResponse === undefined
          ? message.adminResponse
          : clean(parsed.data.adminResponse) || null,
      updatedAt: new Date(),
    })
    .where(and(eq(supportMessagesTable.id, params.data.id)))
    .returning();
  res.json(UpdateSupportMessageResponse.parse(updated));
});

export default router;