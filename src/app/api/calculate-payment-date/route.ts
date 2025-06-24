import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculatePaymentScenarios } from "./../../../../lib/calculators/payment-optimizer";

// Step 3.1: Update the Zod schema to include the new fields
const calculatorSchema = z.object({
  balance: z.number().positive(),
  apr: z.number().min(0),
  statementDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  minimumPayment: z.number().min(0).optional().default(0),
  extraPayment: z.number().min(0).optional().default(0),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = calculatorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input.', details: validation.error.flatten() }, { status: 400 });
    }

    // Pass the validated data, including the new fields, to the calculation engine
    const result = calculatePaymentScenarios({
      balance: validation.data.balance,
      apr: validation.data.apr,
      statementDate: new Date(validation.data.statementDate),
      dueDate: new Date(validation.data.dueDate),
      minimumPayment: validation.data.minimumPayment,
      extraPayment: validation.data.extraPayment,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('[API CALCULATION ERROR]:', error);
    return NextResponse.json({ error: 'An internal error occurred during calculation.' }, { status: 500 });
  }
}
