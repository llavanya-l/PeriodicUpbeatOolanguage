import { and, desc, eq, ilike, or } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, applicationsTable } from "@workspace/db";
import {
  CreateApplicationBody,
  CreateApplicationResponse,
  DecideApplicationBody,
  DecideApplicationParams,
  DecideApplicationResponse,
  GetApplicationParams,
  GetApplicationResponse,
  GetApplicationSummaryResponse,
  ListApplicationsQueryParams,
  ListApplicationsResponse,
} from "@workspace/api-zod";
import { calculateEligibility } from "../lib/eligibility";

const router: IRouter = Router();

function serializeApplication(application: typeof applicationsTable.$inferSelect) {
  return {
    ...application,
    reviewedAt: application.reviewedAt?.toISOString() ?? null,
  };
}

router.get("/applications", async (req, res): Promise<void> => {
  const parsedQuery = ListApplicationsQueryParams.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).json({ error: parsedQuery.error.message });
    return;
  }

  const { email, search, status } = parsedQuery.data;
  const filters = [];
  if (email) filters.push(eq(applicationsTable.email, email));
  if (status && status !== "all") filters.push(eq(applicationsTable.status, status));
  if (search) {
    filters.push(
      or(
        ilike(applicationsTable.applicantName, `%${search}%`),
        ilike(applicationsTable.email, `%${search}%`),
        ilike(applicationsTable.program, `%${search}%`),
      ),
    );
  }

  const applications = await db
    .select()
    .from(applicationsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(applicationsTable.submittedAt));

  res.json(ListApplicationsResponse.parse(applications.map(serializeApplication)));
});

router.post("/applications", async (req, res): Promise<void> => {
  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid application body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const eligibility = calculateEligibility(parsed.data);
  const [application] = await db
    .insert(applicationsTable)
    .values({
      ...parsed.data,
      ...eligibility,
      status: "pending",
    })
    .returning();

  res.status(201).json(CreateApplicationResponse.parse(serializeApplication(application)));
});

router.get("/applications/summary", async (_req, res): Promise<void> => {
  const applications = await db.select().from(applicationsTable);
  const summary = {
    total: applications.length,
    pending: applications.filter((item) => item.status === "pending").length,
    approved: applications.filter((item) => item.status === "approved").length,
    rejected: applications.filter((item) => item.status === "rejected").length,
    eligible: applications.filter((item) => item.eligibilityStatus === "eligible").length,
    review: applications.filter((item) => item.eligibilityStatus === "review").length,
    notEligible: applications.filter((item) => item.eligibilityStatus === "not_eligible").length,
  };

  res.json(GetApplicationSummaryResponse.parse(summary));
});

router.get("/applications/:id", async (req, res): Promise<void> => {
  const parsedParams = GetApplicationParams.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json({ error: parsedParams.error.message });
    return;
  }

  const [application] = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.id, parsedParams.data.id));

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(GetApplicationResponse.parse(serializeApplication(application)));
});

router.patch("/applications/:id/decision", async (req, res): Promise<void> => {
  const parsedParams = DecideApplicationParams.safeParse(req.params);
  const parsedBody = DecideApplicationBody.safeParse(req.body);
  if (!parsedParams.success || !parsedBody.success) {
    const error = !parsedParams.success
      ? parsedParams.error.message
      : !parsedBody.success
        ? parsedBody.error.message
        : "Invalid request";
    res.status(400).json({
      error,
    });
    return;
  }

  const [application] = await db
    .update(applicationsTable)
    .set({
      status: parsedBody.data.status,
      reviewNote: parsedBody.data.reviewNote ?? null,
      reviewedAt: new Date(),
    })
    .where(eq(applicationsTable.id, parsedParams.data.id))
    .returning();

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(DecideApplicationResponse.parse(serializeApplication(application)));
});

export default router;