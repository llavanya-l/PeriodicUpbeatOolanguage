type FinancialInput = {
  netWorth: number;
  turnover: number;
  netProfit: number;
  profitYear1?: number;
  profitYear2?: number;
  profitYear3?: number;
};

const NET_WORTH_THRESHOLD_CRORE = 500;
const TURNOVER_THRESHOLD_CRORE = 1000;
const NET_PROFIT_THRESHOLD_CRORE = 5;

export function calculateCsrAssessment(input: FinancialInput) {
  const thresholdResults = [
    input.netWorth >= NET_WORTH_THRESHOLD_CRORE,
    input.turnover >= TURNOVER_THRESHOLD_CRORE,
    input.netProfit >= NET_PROFIT_THRESHOLD_CRORE,
  ];
  const csrApplicable = thresholdResults.some(Boolean);
  const metThresholds = [
    thresholdResults[0] && "net worth",
    thresholdResults[1] && "turnover",
    thresholdResults[2] && "net profit",
  ].filter(Boolean);

  const applicabilityReason = csrApplicable
    ? `The entered figures meet at least one configured CSR threshold: ${metThresholds.join(", ")}.`
    : "The entered figures do not meet the configured CSR thresholds.";

  const profits = [input.profitYear1, input.profitYear2, input.profitYear3];
  const hasAllProfits = profits.every(
    (profit): profit is number => typeof profit === "number" && Number.isFinite(profit),
  );
  const averageProfit = hasAllProfits
    ? profits.reduce((total, profit) => total + profit, 0) / 3
    : null;
  const indicativeCsrObligation =
    averageProfit === null ? null : averageProfit * 0.02;

  return {
    csrApplicable,
    applicabilityReason,
    averageProfit,
    indicativeCsrObligation,
  } as const;
}

export const csrThresholds = {
  netWorth: NET_WORTH_THRESHOLD_CRORE,
  turnover: TURNOVER_THRESHOLD_CRORE,
  netProfit: NET_PROFIT_THRESHOLD_CRORE,
} as const;