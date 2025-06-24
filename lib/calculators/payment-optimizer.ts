/**
 * @file This module contains the core business logic for calculating
 * multi-scenario payment optimizations and savings projections.
 */

import { format } from 'date-fns';

// --- Data Structures (Interfaces) ---

export interface PaymentOptimizerInput {
  balance: number;
  apr: number;
  statementDate: Date;
  dueDate: Date;
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

/**
 * Calculates the number of full days between two dates.
 * @param start - The start date.
 * @param end - The end date.
 * @returns The number of days.
 */
function daysBetween(start: Date, end: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  const days = Math.floor((utc2 - utc1) / MS_PER_DAY);
  return days > 0 ? days : 0; // Ensure we don't return negative days
}

/**
 * Calculates the simple interest accrued on a balance over a period.
 * This is a standard model for demonstrating interest savings.
 * @param balance The principal amount.
 * @param dailyApr The daily interest rate (APR / 100 / 365).
 * @param days The number of days the balance is carried.
 * @returns The calculated interest amount.
 */
function calculateInterestForPeriod(balance: number, dailyApr: number, days: number): number {
  if (balance <= 0 || dailyApr <= 0 || days <= 0) {
    return 0;
  }
  return balance * dailyApr * days;
}


// --- Main Calculation Engine ---

/**
 * The main function for the payment optimization calculation.
 * It takes financial details and returns a comprehensive analysis
 * of payment scenarios and long-term savings projections.
 *
 * @param {PaymentOptimizerInput} input - The financial details for the calculation.
 * @returns {PaymentOptimizerResult} - The full analysis of payment options.
 */
export function calculatePaymentScenarios(
  input: PaymentOptimizerInput
): PaymentOptimizerResult {
  const { balance, apr, statementDate, dueDate } = input;
  const dailyApr = apr / 100 / 365;

  // --- 1. Calculate Interest for Each Scenario ---

  // Baseline Scenario: Paying on the Due Date
  const daysForBaseline = daysBetween(statementDate, dueDate);
  const baselineInterest = calculateInterestForPeriod(balance, dailyApr, daysForBaseline);

  const baselineScenario: PaymentScenario = {
    scenarioName: 'Pay on Due Date',
    paymentDate: dueDate.toISOString(),
    interestPaid: baselineInterest,
    savingsComparedToBaseline: 0,
  };

  // Scenario: Paying on the Statement Date
  const daysForStatementPay = 0; // No time passes
  const interestForStatementPay = calculateInterestForPeriod(balance, dailyApr, daysForStatementPay);
  const statementDateScenario: PaymentScenario = {
    scenarioName: 'Pay on Statement Date',
    paymentDate: statementDate.toISOString(),
    interestPaid: interestForStatementPay,
    savingsComparedToBaseline: baselineInterest - interestForStatementPay,
  };

  // Scenario: Paying Halfway
  const halfwayDate = new Date(
    statementDate.getTime() +
      (dueDate.getTime() - statementDate.getTime()) / 2
  );
  const daysForHalfwayPay = daysBetween(statementDate, halfwayDate);
  const interestForHalfwayPay = calculateInterestForPeriod(balance, dailyApr, daysForHalfwayPay);
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

  // --- 2. Determine the Best Scenario ---
  // The best scenario is the one with the lowest interest paid.
  const bestScenario = scenarios.reduce((best, current) => {
    return current.interestPaid < best.interestPaid ? current : best;
  });

  // --- 3. Calculate Long-Term Projections ---
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
