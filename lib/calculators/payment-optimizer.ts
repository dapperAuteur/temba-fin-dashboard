/**
 * @file This module contains the core business logic for calculating
 * multi-scenario payment optimizations and savings projections.
 */

// --- Data Structures (Interfaces) ---

// Step 2.1: Update the input interface
export interface PaymentOptimizerInput {
  balance: number;
  apr: number;
  statementDate: Date;
  dueDate: Date;
  minimumPayment: number;
  extraPayment: number;
}

export interface PaymentScenario {
  scenarioName: 'Pay on Statement Date' | 'Pay Halfway' | 'Pay on Due Date';
  paymentDate: string;
  interestPaid: number;
  savingsComparedToBaseline: number;
}

export interface SavingsProjection {
  months: 1 | 3 | 6 | 12;
  projectedSavings: number;
}

export interface PaymentOptimizerResult {
  scenarios: PaymentScenario[];
  projections: SavingsProjection[];
  bestScenario: PaymentScenario;
  baselineInterest: number;
}

// --- Financial Calculation Helpers ---

function daysBetween(start: Date, end: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  const days = Math.floor((utc2 - utc1) / MS_PER_DAY);
  return days > 0 ? days : 0;
}

// --- Step 2.2: Implement the New Core Logic ---
/**
 * Calculates the interest accrued for a single payment scenario based on
 * when a payment is made during the billing cycle.
 *
 * @param balance The starting statement balance.
 * @param dailyApr The daily interest rate.
 * @param totalPayment The total amount being paid (minimum + extra).
 * @param daysUntilPayment The number of days from statement date until the payment is made.
 * @param cycleLengthDays The total number of days in the billing cycle.
 * @returns The total interest accrued for the cycle in this scenario.
 */
function calculateInterestForScenario(
    balance: number,
    dailyApr: number,
    totalPayment: number,
    daysUntilPayment: number,
    cycleLengthDays: number
): number {
    if (balance <= 0 || dailyApr <= 0) return 0;

    // The balance after the payment is made.
    const remainingBalance = balance - totalPayment;
    
    // If the remaining balance is paid off, no interest accrues.
    if (remainingBalance <= 0) return 0;

    // Interest accrues on the *full balance* up until the day of payment.
    const interestBeforePayment = balance * dailyApr * daysUntilPayment;
    
    // Interest accrues on the *remaining balance* for the rest of the cycle.
    const daysAfterPayment = cycleLengthDays - daysUntilPayment;
    const interestAfterPayment = remainingBalance * dailyApr * daysAfterPayment;

    return interestBeforePayment + interestAfterPayment;
}


// --- Main Calculation Engine ---

export function calculatePaymentScenarios(
  input: PaymentOptimizerInput
): PaymentOptimizerResult {
  const { balance, apr, statementDate, dueDate, minimumPayment, extraPayment } = input;
  const dailyApr = apr / 100 / 365;
  const totalPayment = (minimumPayment || 0) + (extraPayment || 0);

  const cycleLengthDays = daysBetween(statementDate, dueDate);
  if (cycleLengthDays <= 0) {
      // Handle invalid date range gracefully
      throw new Error("Due date must be after statement date.");
  }

  // --- Calculate Interest for Each Scenario using the new logic ---

  // Baseline Scenario: Paying on the Due Date
  const baselineInterest = calculateInterestForScenario(balance, dailyApr, totalPayment, cycleLengthDays, cycleLengthDays);
  const baselineScenario: PaymentScenario = {
    scenarioName: 'Pay on Due Date',
    paymentDate: dueDate.toISOString(),
    interestPaid: baselineInterest,
    savingsComparedToBaseline: 0,
  };

  // Scenario: Paying on the Statement Date
  const daysForStatementPay = 0;
  const interestForStatementPay = calculateInterestForScenario(balance, dailyApr, totalPayment, daysForStatementPay, cycleLengthDays);
  const statementDateScenario: PaymentScenario = {
    scenarioName: 'Pay on Statement Date',
    paymentDate: statementDate.toISOString(),
    interestPaid: interestForStatementPay,
    savingsComparedToBaseline: baselineInterest - interestForStatementPay,
  };

  // Scenario: Paying Halfway
  const halfwayDate = new Date(statementDate.getTime() + (dueDate.getTime() - statementDate.getTime()) / 2);
  const daysForHalfwayPay = daysBetween(statementDate, halfwayDate);
  const interestForHalfwayPay = calculateInterestForScenario(balance, dailyApr, totalPayment, daysForHalfwayPay, cycleLengthDays);
  const halfwayScenario: PaymentScenario = {
    scenarioName: 'Pay Halfway',
    paymentDate: halfwayDate.toISOString(),
    interestPaid: interestForHalfwayPay,
    savingsComparedToBaseline: baselineInterest - interestForHalfwayPay,
  };

  const scenarios: PaymentScenario[] = [
    statementDateScenario,
    halfwayScenario,
    baselineScenario,
  ];

  const bestScenario = scenarios.reduce((best, current) => {
    return current.interestPaid < best.interestPaid ? current : best;
  });

  const monthlySavings = bestScenario.savingsComparedToBaseline;
  const projections: SavingsProjection[] = [
    { months: 1, projectedSavings: monthlySavings * 1 },
    { months: 3, projectedSavings: monthlySavings * 3 },
    { months: 6, projectedSavings: monthlySavings * 6 },
    { months: 12, projectedSavings: monthlySavings * 12 },
  ];

  return {
    scenarios,
    projections,
    bestScenario,
    baselineInterest,
  };
}
