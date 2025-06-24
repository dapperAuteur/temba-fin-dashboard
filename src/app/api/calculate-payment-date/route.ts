import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define the schema for the incoming request body for validation
const calculatorSchema = z.object({
  balance: z.number().positive(),
  apr: z.number().min(0),
  statementDate: z.string().datetime(),
  dueDate: z.string().datetime(),
});

/**
 * Calculates the interest accrued over a certain number of days.
 * This is a simplified model. Real-world calculations can be more complex.
 * @param balance The principal balance.
 * @param dailyApr The daily annual percentage rate.
 * @param days The number of days to calculate interest for.
 * @returns The calculated interest.
 */
function calculateInterest(balance: number, dailyApr: number, days: number): number {
    if (days <= 0) return 0;
    // Simple interest calculation: Balance * Daily APR * Days
    return balance * dailyApr * days;
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate the incoming data
    const validation = calculatorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input.', details: validation.error.flatten() }, { status: 400 });
    }

    const { balance, apr, statementDate, dueDate } = validation.data;
    
    // 2. *** CORE CALCULATION LOGIC ***
    // This is where your complex financial algorithm will go.
    // For now, we are using a simplified placeholder logic.
    const dailyApr = apr / 100 / 365;
    const gracePeriodDays = Math.round((new Date(dueDate).getTime() - new Date(statementDate).getTime()) / (1000 * 3600 * 24));

    // Scenario 1: Interest if paid on the due date
    // Assumes interest accrues from the statement date through the due date.
    const originalInterest = calculateInterest(balance, dailyApr, gracePeriodDays);
    
    // Scenario 2: Optimized interest (Placeholder Logic)
    // Let's assume the optimal date is 3 days before the due date.
    const optimalPaymentDate = new Date(dueDate);
    optimalPaymentDate.setDate(optimalPaymentDate.getDate() - 3);

    const optimizedGracePeriodDays = Math.round((optimalPaymentDate.getTime() - new Date(statementDate).getTime()) / (1000 * 3600 * 24));
    const optimizedInterest = calculateInterest(balance, dailyApr, optimizedGracePeriodDays);

    const interestSaved = originalInterest - optimizedInterest;

    const explanation = `By paying on ${format(optimalPaymentDate, 'MMM do')} instead of the due date, you avoid interest charges for the last 3 days of your billing cycle.`;

    // 3. Return the successful response
    return NextResponse.json({
      optimalPaymentDate: optimalPaymentDate.toISOString(),
      interestSaved,
      explanation,
      originalInterest,
      optimizedInterest,
    });

  } catch (error) {
    console.error('Calculation Error:', error);
    // You could use your Prisma logger here in a real scenario
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
