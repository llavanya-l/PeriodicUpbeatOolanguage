import { count } from "drizzle-orm";
import { db, applicationsTable } from "@workspace/db";

export async function seedApplications() {
  const [{ total }] = await db.select({ total: count() }).from(applicationsTable);
  if (total > 0) return;

  await db.insert(applicationsTable).values([
    {
      applicantName: "Maya Patel",
      email: "maya.patel@example.com",
      phone: "+91 98765 43210",
      program: "Community education grant",
      region: "Pune, Maharashtra",
      annualIncome: 180000,
      householdSize: 4,
      employmentStatus: "self_employed",
      hasDisability: false,
      requestedSupport: "Tuition and learning materials",
      notes: "Returning to school while supporting two children.",
      eligibilityScore: 67,
      eligibilityStatus: "review",
      status: "pending",
      submittedAt: new Date("2026-09-01T08:30:00.000Z"),
    },
    {
      applicantName: "Arjun Mehta",
      email: "arjun.mehta@example.com",
      phone: "+91 99887 77665",
      program: "Livelihood starter support",
      region: "Jaipur, Rajasthan",
      annualIncome: 120000,
      householdSize: 5,
      employmentStatus: "unemployed",
      hasDisability: true,
      requestedSupport: "Tools and vocational training",
      notes: "Seeking support to start a local repair service.",
      eligibilityScore: 98,
      eligibilityStatus: "eligible",
      status: "approved",
      submittedAt: new Date("2026-08-28T10:15:00.000Z"),
      reviewedAt: new Date("2026-08-29T06:20:00.000Z"),
      reviewNote: "Meets the eligibility threshold. Approved for the current cohort.",
    },
    {
      applicantName: "Neha Sharma",
      email: "neha.sharma@example.com",
      phone: "+91 91234 56789",
      program: "Healthcare access fund",
      region: "Lucknow, Uttar Pradesh",
      annualIncome: 540000,
      householdSize: 2,
      employmentStatus: "employed",
      hasDisability: false,
      requestedSupport: "Specialist care and medication",
      notes: "Requesting support for ongoing specialist treatment.",
      eligibilityScore: 13,
      eligibilityStatus: "not_eligible",
      status: "rejected",
      submittedAt: new Date("2026-08-22T12:45:00.000Z"),
      reviewedAt: new Date("2026-08-24T07:10:00.000Z"),
      reviewNote: "Income threshold is above the current program criteria.",
    },
  ]);
}