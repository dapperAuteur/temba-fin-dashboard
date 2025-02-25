"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ITransaction, TransactionType } from '@/types/transactions';
import { LoadingState } from '@/types/common';
import { apiClient } from '@/lib/api';

interface TransactionFormProps {
  transaction?: Partial<ITransaction>;
  onComplete?: (transaction: ITransaction) => void;
  mode: 'create' | 'edit';
}

interface TransactionFormData {
  accountId: string;
  value: number;
  type: TransactionType;
  date: string;
  vendor?: string;
  tags?: string[];
}

export default function TransactionForm({ transaction, onComplete, mode = 'create' }: TransactionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<TransactionFormData>({
    accountId: transaction?.accountId?.toString() || '',
    value: transaction?.value || 0,
    type: transaction?.type || TransactionType.Deposit,
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    vendor: transaction?.vendor || '',
    tags: transaction?.tags || []
  });

  const [submitState, setSubmitState] = useState<LoadingState<ITransaction>>({
    isLoading: false,
    error: null,
    data: null
  });
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState({ isLoading: true, error: null, data: null });

    try {
      const endpoint = transaction?._id ? `/api/transactions/${transaction._id}` : '/api/transactions';
      const method = transaction?._id ? 'PATCH' : 'POST';
      
      const result = await apiClient.fetch<ITransaction>(endpoint, {
        method: method,
        body: JSON.stringify({ formData }),
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create transaction');
      }

      if (result.success && result.data) {
        setMessage({text: mode === 'create' ? 'Transaction created successfully!' : 'Transaction updated successfully!', type: 'success'});
        setSubmitState({ isLoading: false, error: null, data: result.data });
        onComplete?.(result.data);
        router.refresh();
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      setSubmitState({ 
        isLoading: false, 
        error: new Error('An unexpected error occurred'), 
        data: null 
      });
    }
  };

  return (
    <div>
      {message && (
        <div className={`p-4 rounded-md mb-4 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto mt-8">
        <div>
          <label htmlFor="value" className="block account-type">Amount</label>
          <input
            type="number"
            id="value"
            required
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="type" className="block account-type">Type</label>
          <select
            id="type"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            {Object.values(TransactionType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block account-type">Date</label>
          <input
            type="date"
            id="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="vendor" className="block account-type">Vendor</label>
          <input
            type="text"
            id="vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="button-secondary px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitState.isLoading}
            className="button-primary px-4 py-2 rounded"
          >
            {submitState.isLoading ? 'Saving...' : mode === 'create' ? 'Create Transaction' : 'Update Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
