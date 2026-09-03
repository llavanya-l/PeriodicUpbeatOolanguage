import type { InsertApplication } from "@workspace/db";

type EligibilityInput = Pick<
  InsertApplication,
  | "annualIncome"
  | "householdSize"
  | "employmentStatus"
  | "hasDisability"
>;

export function calculateEligibility(input: EligibilityInput) {
  const incomePerPerson = input.annualIncome / Math.max(input.householdSize, 1);
  let score = 0;

  if (incomePerPerson <= 12000) score += 55;
  else if (incomePerPerson <= 20000) score += 40;
  else if (incomePerPerson <= 32000) score += 24;
  else score += 8;

  if (input.householdSize >= 5) score += 18;
  else if (input.householdSize >= 3) score += 12;
  else score += 5;

  if (input.hasDisability) score += 15;
  if (input.employmentStatus === "unemployed") score += 10;
  if (input.employmentStatus === "student") score += 7;

  const eligibilityStatus =
    score >= 70 ? "eligible" : score >= 45 ? "review" : "not_eligible";

  return { eligibilityScore: score, eligibilityStatus } as const;
}