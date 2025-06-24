'use client';

import * as React from 'react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the schema for our form validation using Zod
const formSchema = z.object({
  balance: z.coerce.number().positive({ message: 'Balance must be positive.' }),
  apr: z.coerce.number().min(0, { message: 'APR cannot be negative.' }).max(100, { message: 'APR seems too high.' }),
  statementDate: z.date({
    required_error: 'A statement date is required.',
  }),
  dueDate: z.date({
    required_error: 'A due date is required.',
  }),
});

// Define the structure of the data we expect from the API
interface CalculationResult {
  optimalPaymentDate: string;
  interestSaved: number;
  explanation: string;
  originalInterest: number;
  optimizedInterest: number;
}

export default function OptimalPaymentCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize our form with react-hook-form and Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balance: 1000,
      apr: 22.5,
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/calculate-payment-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  // Chart configuration
  const chartData = {
    labels: ['Pay on Due Date', 'Pay on Optimal Date'],
    datasets: [
      {
        label: 'Interest Paid ($)',
        data: result ? [result.originalInterest, result.optimizedInterest] : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Interest Payment Comparison',
      },
    },
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Optimal Payment Calculator</CardTitle>
        <CardDescription>
          Find the best day to pay your credit card bill to minimize interest charges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Balance Input */}
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statement Balance ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* APR Input */}
              <FormField
                control={form.control}
                name="apr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase APR (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g., 22.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Statement Date Picker */}
              <FormField
                control={form.control}
                name="statementDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Statement Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Due Date Picker */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Calculate Savings
            </Button>
          </form>
        </Form>
      </CardContent>

      {/* --- Results Section --- */}
      {result && !isLoading && (
        <CardFooter className="flex-col items-start gap-4 mt-6 border-t pt-6">
          <h3 className="text-xl font-bold">Calculation Result</h3>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-lg">
                Optimal Payment Date:{' '}
                <strong className="text-primary">{format(new Date(result.optimalPaymentDate), 'PPP')}</strong>
              </p>
              <p className="text-lg">
                Estimated Interest Saved:{' '}
                <strong className="text-green-600">${result.interestSaved.toFixed(2)}</strong>
              </p>
              <p className="text-muted-foreground">{result.explanation}</p>
            </div>
            <div className="w-full">
                <Bar options={chartOptions} data={chartData} />
            </div>
          </div>
        </CardFooter>
      )}

      {/* --- Error Display --- */}
      {error && !isLoading && (
        <CardFooter>
            <p className="text-red-500">{error}</p>
        </CardFooter>
      )}
    </Card>
  );
}
