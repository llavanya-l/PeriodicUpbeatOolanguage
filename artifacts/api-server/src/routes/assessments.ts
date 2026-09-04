import { and, desc, eq, ilike, or } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, assessmentsTable, assessmentReviewHistoryTable } from "@workspace/db";
import {
  CreateAssessmentBody,
  CreateAssessmentResponse,
  GetAdminAssessmentParams,
  GetAdminAssessmentResponse,
  GetAdminSummaryResponse,
  GetAssessmentParams,
  GetAssessmentResponse,
  ListAdminAssessmentsQueryParams,
  ListAdminAssessmentsResponse,
  ListAssessmentsResponse,
  ReviewAssessmentBody,
  ReviewAssessmentParams,
  ReviewAssessmentResponse,
} from "@workspace/api-zod";
import { calculateCsrAssessment } from "../lib/csr-assessment";
import { requireAdmin, requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function optionalText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function getReviewHistory(assessmentId: number) {
  return db
    .select()
    .from(assessmentReviewHistoryTable)
    .where(eq(assessmentReviewHistoryTable.assessmentId, assessmentId))
    .orderBy(desc(assessmentReviewHistoryTable.createdAt));
}

function toAssessmentResponse(assessment: typeof assessmentsTable.$inferSelect) {
  return assessment;
}

async function toAdminAssessmentResponse(
  assessment: typeof assessmentsTable.$inferSelect,
) {
  const history = await getReviewHistory(assessment.id);
  return {
    ...assessment,
    reviewHistory: history.map((entry) => ({
      id: entry.id,
      status: entry.status,
      note: entry.note,
      adminNote: entry.adminNote,
      actorRole: entry.actorRole,
      createdAt: entry.createdAt,
    })),
  };
}

router.get("/assessments", requireAuth, async (req, res): Promise<void> => {
  const assessments = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.userId, req.authUser!.id))
    .orderBy(desc(assessmentsTable.createdAt));

  res.json(ListAssessmentsResponse.parse(assessments.map(toAssessmentResponse)));
});

router.post("/assessments", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateAssessmentBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid assessment body");
    res.status(400).json({ error: "Please check the required assessment fields." });
    return;
  }

  const calculation = calculateCsrAssessment(parsed.data);
  const userId = req.authUser!.id;
  const assessment = await db.transaction(async (transaction) => {
    const [created] = await transaction
      .insert(assessmentsTable)
      .values({
        userId,
        companyName: parsed.data.companyName.trim(),
        cin: parsed.data.cin.trim().toUpperCase(),
        companyType: parsed.data.companyType,
        financialYear: parsed.data.financialYear,
        registeredState: optionalText(parsed.data.registeredState),
        industry: optionalText(parsed.data.industry),
        netWorth: parsed.data.netWorth,
        turnover: parsed.data.turnover,
        netProfit: parsed.data.netProfit,
        profitYear1: parsed.data.profitYear1 ?? null,
        profitYear2: parsed.data.profitYear2 ?? null,
        profitYear3: parsed.data.profitYear3 ?? null,
        averageProfit: calculation.averageProfit,
        indicativeCsrObligation: calculation.indicativeCsrObligation,
        csrApplicable: calculation.csrApplicable,
        applicabilityReason: calculation.applicabilityReason,
        csrPolicyStatus: optionalText(parsed.data.csrPolicyStatus),
        governanceStatus: optionalText(parsed.data.governanceStatus),
        annualActionPlanStatus: optionalText(parsed.data.annualActionPlanStatus),
        implementingAgencyStatus: optionalText(parsed.data.implementingAgencyStatus),
        csrFocusAreas: parsed.data.csrFocusAreas ?? [],
        additionalNotes: optionalText(parsed.data.additionalNotes),
        reviewStatus: "pending",
        reviewNote: null,
        adminNote: null,
      })
      .returning();

    await transaction.insert(assessmentReviewHistoryTable).values({
      assessmentId: created.id,
      status: "pending",
      note: null,
      adminNote: null,
      actorId: userId,
      actorRole: "user",
    });

    return created;
  });

  res.status(201).json(CreateAssessmentResponse.parse(toAssessmentResponse(assessment)));
});

router.get("/assessments/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetAssessmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid assessment id." });
    return;
  }

  const [assessment] = await db
    .select()
    .from(assessmentsTable)
    .where(
      and(
        eq(assessmentsTable.id, params.data.id),
        eq(assessmentsTable.userId, req.authUser!.id),
      ),
    );
  if (!assessment) {
    res.status(404).json({ error: "Assessment not found." });
    return;
  }

  res.json(GetAssessmentResponse.parse(toAssessmentResponse(assessment)));
});

router.get("/admin/summary", requireAdmin, async (_req, res): Promise<void> => {
  const assessments = await db.select().from(assessmentsTable);
  const recentCutoff = new Date();
  recentCutoff.setDate(recentCutoff.getDate() - 30);
  const summary = {
    total: assessments.length,
    applicable: assessments.filter((item) => item.csrApplicable).length,
    notApplicable: assessments.filter((item) => !item.csrApplicable).length,
    pending: assessments.filter((item) => item.reviewStatus === "pending").length,
    approved: assessments.filter((item) => item.reviewStatus === "approved").length,
    clarification: assessments.filter((item) => item.reviewStatus === "clarification").length,
    rejected: assessments.filter((item) => item.reviewStatus === "rejected").length,
    recent: assessments.filter((item) => item.createdAt >= recentCutoff).length,
  };

  res.json(GetAdminSummaryResponse.parse(summary));
});

router.get("/admin/assessments", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListAdminAssessmentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid assessment filters." });
    return;
  }

  const filters = [];
  if (parsed.data.reviewStatus) {
    filters.push(eq(assessmentsTable.reviewStatus, parsed.data.reviewStatus));
  }
  if (parsed.data.financialYear) {
    filters.push(eq(assessmentsTable.financialYear, parsed.data.financialYear));
  }
  const rawApplicable = req.query.csrApplicable;
  if (rawApplicable === "true") filters.push(eq(assessmentsTable.csrApplicable, true));
  if (rawApplicable === "false") filters.push(eq(assessmentsTable.csrApplicable, false));
  if (parsed.data.search) {
    const search = `%${parsed.data.search}%`;
    filters.push(
      or(
        ilike(assessmentsTable.companyName, search),
        ilike(assessmentsTable.cin, search),
      ),
    );
  }

  const assessments = await db
    .select()
    .from(assessmentsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(assessmentsTable.createdAt));
  const results = await Promise.all(assessments.map(toAdminAssessmentResponse));
  res.json(ListAdminAssessmentsResponse.parse(results));
});

router.get("/admin/assessments/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = GetAdminAssessmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid assessment id." });
    return;
  }

  const [assessment] = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.id, params.data.id));
  if (!assessment) {
    res.status(404).json({ error: "Assessment not found." });
    return;
  }

  res.json(GetAdminAssessmentResponse.parse(await toAdminAssessmentResponse(assessment)));
});

router.patch("/admin/assessments/:id/review", requireAdmin, async (req, res): Promise<void> => {
  const params = ReviewAssessmentParams.safeParse(req.params);
  const parsed = ReviewAssessmentBody.safeParse(req.body);
  if (!params.success || !parsed.success || parsed.data.status === "pending") {
    res.status(400).json({ error: "Choose an approved, clarification, or rejected review status." });
    return;
  }

  const [existing] = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Assessment not found." });
    return;
  }

  const reviewNote =
    parsed.data.reviewNote === undefined
      ? existing.reviewNote
      : optionalText(parsed.data.reviewNote);
  const adminNote =
    parsed.data.adminNote === undefined
      ? existing.adminNote
      : optionalText(parsed.data.adminNote);

  const updated = await db.transaction(async (transaction) => {
    const [result] = await transaction
      .update(assessmentsTable)
      .set({
        reviewStatus: parsed.data.status,
        reviewNote,
        adminNote,
        updatedAt: new Date(),
      })
      .where(eq(assessmentsTable.id, params.data.id))
      .returning();

    await transaction.insert(assessmentReviewHistoryTable).values({
      assessmentId: result.id,
      status: parsed.data.status,
      note: reviewNote,
      adminNote,
      actorId: req.authUser!.id,
      actorRole: "admin",
    });
    return result;
  });

  res.json(
    ReviewAssessmentResponse.parse(await toAdminAssessmentResponse(updated)),
  );
});

export default router;