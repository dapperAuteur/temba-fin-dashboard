import { NextResponse } from 'next/server';
import { z } from 'zod';
// Step 2.1: Import our new calculation engine
import { calculatePaymentScenarios } from './../../../lib/calculators/payment-optimizer'

// The input validation schema remains the same
const calculatorSchema = z.object({
  balance: z.number().positive(),
  apr: z.number().min(0),
  statementDate: z.string().datetime(),
  dueDate: z.string().datetime(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate the incoming data
    const validation = calculatorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input.', details: validation.error.flatten() }, { status: 400 });
    }

    // The core calculation logic is now gone from this file.
    // Instead, we call our dedicated, testable module.
    const result = calculatePaymentScenarios({
      balance: validation.data.balance,
      apr: validation.data.apr,
      // Convert date strings from the request into Date objects for the calculator
      statementDate: new Date(validation.data.statementDate),
      dueDate: new Date(validation.data.dueDate),
    });

    // 2. Return the entire, richer data structure from the calculator
    return NextResponse.json(result);

  } catch (error) {
    // It's good practice to log the actual error on the server for debugging
    console.error('[API CALCULATION ERROR]:', error);
    
    // You could also use your Prisma logger here for production-grade logging
    // await Logger.log({ context: LogContext.SYSTEM, level: LogLevel.ERROR, ... });

    return NextResponse.json({ error: 'An internal error occurred during calculation.' }, { status: 500 });
  }
}
