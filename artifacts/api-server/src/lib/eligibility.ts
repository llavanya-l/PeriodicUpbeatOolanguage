type EligibilityInput = {
  age: number;
  employmentStatus: string;
  program: string;
};

export function calculateEligibility(input: EligibilityInput) {
  let score = 0;

  if (input.age < 18) score += 18;
  else if (input.age <= 25) score += 14;
  else if (input.age >= 60) score += 18;
  else score += 10;

  if (input.employmentStatus === "unemployed") score += 38;
  else if (input.employmentStatus === "student") score += 32;
  else if (input.employmentStatus === "self_employed") score += 27;
  else if (input.employmentStatus === "retired") score += 24;
  else score += 18;

  if (["Health access", "Housing stability"].includes(input.program)) score += 24;
  else if (input.program === "Work & training support") score += 20;
  else score += 16;

  const eligibilityStatus =
    score >= 70 ? "eligible" : score >= 45 ? "review" : "not_eligible";

  return { eligibilityScore: score, eligibilityStatus } as const;
}