/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

// Import all necessary UI components
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Import Chart.js and react-chartjs-2 components
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from 'chart.js';

// Import the data structures from our optimizer module
import { PaymentOptimizerResult, PaymentScenario } from "../../lib/calculators/payment-optimizer";

// Register Chart.js components needed for a Line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Zod Schema
const formSchema = z.object({
  balance: z.coerce.number().positive({ message: 'Balance must be positive.' }),
  apr: z.coerce.number().min(0, { message: 'APR cannot be negative.' }).max(100, { message: 'APR seems too high.' }),
  statementDate: z.date({ required_error: 'A statement date is required.' }),
  dueDate: z.date({ required_error: 'A due date is required.' }),
  minimumPayment: z.coerce.number().min(0, { message: 'Minimum payment cannot be negative.'}).optional(),
  extraPayment: z.number().min(0).default(0),
}).refine((data) => {
    if (data.statementDate && data.dueDate) return data.dueDate > data.statementDate;
    return true;
}, { message: "Due date must be after the statement date.", path: ["dueDate"] });


/**
 * Generates the data for the Long-Term Savings Projection chart.
 * This chart compares savings over time with and without extra payments.
 * @param result The full result from the calculation engine.
 * @returns Chart.js compatible data object.
 */
const generateProjectionChartData = (result: PaymentOptimizerResult): ChartData<'line'> => {
    const labels = result.projectionsWithExtra.map(p => `${p.months} Month${p.months > 1 ? 's' : ''}`);
    
    return {
        labels,
        datasets: [
            {
                label: 'Savings (With Extra Pmt)',
                data: result.projectionsWithExtra.map(p => p.projectedSavings),
                borderColor: 'rgba(75, 192, 192, 1)', // Green
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true,
            },
            {
                label: 'Savings (Minimum Pmt Only)',
                data: result.projectionsMinOnly.map(p => p.projectedSavings),
                borderColor: 'rgba(255, 159, 64, 1)', // Orange
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                tension: 0.1,
                fill: true,
            }
        ]
    };
}


// SVG Icon Components
const LoaderIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto h-4 w-4 opacity-50"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>);

export default function OptimalPaymentCalculator() {
  const [result, setResult] = useState<PaymentOptimizerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extraPaymentValue, setExtraPaymentValue] = useState([0]);
  const [projectionChartData, setProjectionChartData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { balance: 1000, apr: 22.5, minimumPayment: 25, extraPayment: 0 },
  });
  
  const balance = form.watch('balance'); 
  const minimumPayment = form.watch('minimumPayment') || 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const submissionData = { ...values, extraPayment: extraPaymentValue[0] };

    try {
      const response = await fetch('/api/calculate-payment-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      const data: PaymentOptimizerResult = await response.json();
      if (!response.ok) throw new Error((data as any).error || 'Something went wrong.');
      setResult(data);
      // Generate chart data once we have a result
      setProjectionChartData(generateProjectionChartData(data));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  const projectionChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Long-Term Savings Projection' }, },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Total Savings ($)'} }, x: { title: { display: true, text: 'Timeframe'}}}
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Optimal Payment Calculator</CardTitle>
        <CardDescription>
          Find the best day to pay your bill and see how extra payments impact your savings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField control={form.control} name="balance" render={({ field }) => ( <FormItem><FormLabel>Statement Balance ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="apr" render={({ field }) => ( <FormItem><FormLabel>Purchase APR (%)</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g., 22.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="statementDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Statement Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="dueDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="minimumPayment" render={({ field }) => ( <FormItem><FormLabel>Minimum Payment ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 25" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="extraPayment" render={() => (
                <FormItem>
                    <FormLabel>Extra Payment Amount: <span className="text-primary font-bold">${extraPaymentValue[0].toFixed(2)}</span></FormLabel>
                    <FormControl>
                        <Slider min={0} max={Math.max(0, (balance || 0) - (minimumPayment || 0))} step={10} value={extraPaymentValue} onValueChange={setExtraPaymentValue} className="w-full" />
                    </FormControl>
                </FormItem>
            )}/>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <LoaderIcon /> : 'Calculate Savings'}
            </Button>
          </form>
        </Form>
      </CardContent>

      {result && !isLoading && (
        <CardFooter className="flex-col items-start gap-8 mt-6 border-t pt-6">
          <div className="w-full space-y-4">
              <h3 className="text-xl font-bold">This Month&apos;s Payment Scenarios</h3>
              <Table>
                  <TableHeader><TableRow>
                      <TableHead>Scenario</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead className="text-right">Interest Paid</TableHead>
                      <TableHead className="text-right text-blue-600">Extra Pmt Savings</TableHead>
                      <TableHead className="text-right text-green-600">Total Savings</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                      {result.scenarios.map((scenario: PaymentScenario) => (
                          <TableRow key={scenario.scenarioName} className={scenario.scenarioName === result.bestScenario.scenarioName ? 'bg-primary/10' : ''}>
                              <TableCell className="font-medium">{scenario.scenarioName} {scenario.scenarioName === result.bestScenario.scenarioName ? '(Best)' : ''}</TableCell>
                              <TableCell>{format(new Date(scenario.paymentDate), 'PPP')}</TableCell>
                              <TableCell className="text-right">${scenario.interestPaid.toFixed(2)}</TableCell>
                              <TableCell className="text-right text-blue-600 font-semibold">${scenario.extraPaymentSavings.toFixed(2)}</TableCell>
                              <TableCell className="text-right text-green-600 font-semibold">${scenario.savingsComparedToBaseline.toFixed(2)}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </div>
          
          <div className="w-full space-y-4 pt-6">
              <h3 className="text-xl font-bold">Long-Term Savings Projections</h3>
              <p>This shows the power of your choices over time, assuming a similar balance and payment strategy each month.</p>
              {/* The Line chart now shows long-term projections */}
              <Line options={projectionChartOptions} data={projectionChartData} />
          </div>
        </CardFooter>
      )}

      {error && !isLoading && ( <CardFooter><p className="text-red-500">{error}</p></CardFooter> )}
    </Card>
  );
}
