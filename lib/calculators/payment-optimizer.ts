/**
 * @file This module contains the core business logic for calculating
 * multi-scenario payment optimizations and savings projections.
 */

// --- Data Structures (Interfaces) ---

export interface PaymentOptimizerInput {
  balance: number;
  apr: number;
  statementDate: Date;
  dueDate: Date;
  minimumPayment: number;
  extraPayment: number;
}

export interface SavingsProjection {
  months: 1 | 3 | 6 | 12;
  projectedSavings: number;
}

// Step 1.1: Restructure Data Models. Projections now live inside each scenario.
export interface PaymentScenario {
  scenarioName: 'Pay on Statement Date' | 'Pay Halfway' | 'Pay on Due Date';
  paymentDate: string;
  interestPaid: number;
  savingsComparedToBaseline: number;
  extraPaymentSavings: number;
  // Each scenario now has its own projection data
  projectionsWithExtra: SavingsProjection[];
  projectionsMinOnly: SavingsProjection[];
}

// The main result object is now simpler.
export interface PaymentOptimizerResult {
  scenarios: PaymentScenario[];
  bestScenario: PaymentScenario;
}

// --- Financial Calculation Helpers ---

function daysBetween(start: Date, end: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  const days = Math.floor((utc2 - utc1) / MS_PER_DAY);
  return days > 0 ? days : 0;
}

function calculateInterestForScenario(
    balance: number,
    dailyApr: number,
    totalPayment: number,
    daysUntilPayment: number,
    cycleLengthDays: number
): number {
    if (balance <= 0 || dailyApr <= 0) return 0;
    const remainingBalance = balance - totalPayment;
    if (remainingBalance <= 0) return 0;
    const interestBeforePayment = balance * dailyApr * daysUntilPayment;
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
  const totalPaymentWithExtra = (minimumPayment || 0) + (extraPayment || 0);
  const totalPaymentWithoutExtra = minimumPayment || 0;

  const cycleLengthDays = daysBetween(statementDate, dueDate);
  if (cycleLengthDays <= 0) {
      throw new Error("Due date must be after statement date.");
  }

  // --- Step 1.2: Upgrade the Core Logic ---
  
  const scenarios: PaymentScenario[] = [];
  const scenarioDefs = [
      { name: 'Pay on Due Date' as const, paymentDate: dueDate },
      { name: 'Pay Halfway' as const, paymentDate: new Date(statementDate.getTime() + (dueDate.getTime() - statementDate.getTime()) / 2)},
      { name: 'Pay on Statement Date' as const, paymentDate: statementDate },
  ];
  
  // First, calculate the absolute baseline: interest paid when paying the minimum on the due date.
  const absoluteBaselineInterest = calculateInterestForScenario(balance, dailyApr, totalPaymentWithoutExtra, cycleLengthDays, cycleLengthDays);

  for (const def of scenarioDefs) {
      const daysUntilPayment = daysBetween(statementDate, def.paymentDate);
      
      // Calculate interest for this scenario WITH the extra payment
      const interestWithExtra = calculateInterestForScenario(balance, dailyApr, totalPaymentWithExtra, daysUntilPayment, cycleLengthDays);
      
      // Calculate interest for this scenario WITHOUT the extra payment
      const interestWithoutExtra = calculateInterestForScenario(balance, dailyApr, totalPaymentWithoutExtra, daysUntilPayment, cycleLengthDays);
      
      // Monthly savings for this specific scenario
      const monthlySavingsWithExtra = absoluteBaselineInterest - interestWithExtra;
      const monthlySavingsMinOnly = absoluteBaselineInterest - interestWithoutExtra;

      scenarios.push({
          scenarioName: def.name,
          paymentDate: def.paymentDate.toISOString(),
          interestPaid: interestWithExtra,
          savingsComparedToBaseline: monthlySavingsWithExtra,
          extraPaymentSavings: interestWithoutExtra - interestWithExtra,
          projectionsWithExtra: [
              { months: 1, projectedSavings: monthlySavingsWithExtra * 1 },
              { months: 3, projectedSavings: monthlySavingsWithExtra * 3 },
              { months: 6, projectedSavings: monthlySavingsWithExtra * 6 },
              { months: 12, projectedSavings: monthlySavingsWithExtra * 12 },
          ],
          projectionsMinOnly: [
              { months: 1, projectedSavings: monthlySavingsMinOnly * 1 },
              { months: 3, projectedSavings: monthlySavingsMinOnly * 3 },
              { months: 6, projectedSavings: monthlySavingsMinOnly * 6 },
              { months: 12, projectedSavings: monthlySavingsMinOnly * 12 },
          ],
      });
  }

  const finalScenarios = scenarios.sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());

  const bestScenario = finalScenarios.reduce((best, current) => {
    return current.interestPaid < best.interestPaid ? current : best;
  });

  return {
    scenarios: finalScenarios,
    bestScenario,
  };
}
