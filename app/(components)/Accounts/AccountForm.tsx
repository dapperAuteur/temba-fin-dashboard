"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IAccount, AccountType } from '@/types/accounts';
import { LoadingState } from '@/types/common';
import { Types } from 'mongoose';
import { apiClient } from '@/lib/api';

interface AccountFormProps {
  account?: Partial<IAccount>;
  onComplete?: (account: IAccount) => void;
}

interface AccountFormData {
  name: string;
  type: AccountType;
  balance: number;
  tags?: Types.ObjectId[];
}

export default function AccountForm({account, onComplete}: AccountFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AccountFormData>({
    name: account?.name || 'Provide Account Name',
    type: account?.type || AccountType.Checking,
    balance: account?.balance || 0,
    tags: account?.tags || [],
  });
  const [submitState, setSubmitState] = useState<LoadingState<IAccount>>({
    isLoading: false,
    error: null,
    data: null
  });
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitState({ isLoading: true, error: null, data: null });
    
    try {
      const url = account?._id ? `/api/accounts/${account._id}` : '/api/accounts';
      const method = account?._id ? 'PATCH' : 'POST';
      
      const result = await apiClient.fetch<IAccount>(url, {
        method: method,
        body: JSON.stringify({ formData }),
      });

      // const result: ApiResponse<IAccount> = await response.json();

      if (!result.success) {
        setSubmitState({ 
          isLoading: false, 
          error: new Error(result.error || 'Failed to create account'), 
          data: null 
        });
        throw new Error(result.error || 'Failed to create account 0');
      }

      if (result.success && result.data) {
        setMessage({text: 'Account created successfully!', type: 'success'});
        setSubmitState({ 
          isLoading: false, 
          error: null, 
          data: result.data 
        });
        if (onComplete) {
          onComplete?.(result.data);
        } else {
          setMessage({text: result.error || 'Failed to create account 1', type: 'error'});
          setFormData({ name: 'Provide Account Name', type: AccountType.Checking, balance: 0, tags: [] });
          router.refresh();
        }
      }
      
    } catch (error) {
      console.error('Error creating account:', error);
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
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-geist-sans mb-6">Create New Account</h2>
        
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="name"
              className="block text-foreground mb-2"
            >
              Account Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-default rounded-md focus:border-focus"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="type"
              className="block text-foreground mb-2"
            >
              Account Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
              className="w-full p-2 border border-default rounded-md focus:border-focus"
              required
            >
              <option value="">Select Type</option>
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
              <option value="Credit">Credit</option>
              <option value="Investment">Investment</option>
            </select>
          </div>

          <div>
            <label 
              htmlFor="balance"
              className="block text-foreground mb-2"
            >
              Initial Balance
            </label>
            <input
              type="number"
              id="balance"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
              className="w-full p-2 border border-default rounded-md focus:border-focus font-geist-mono"
              required
              step="0.01"
            />
          </div>

          <button
            type="submit"
            disabled={submitState.isLoading}
            className="button-primary w-full mt-6"
          >
            {submitState.isLoading ? 'Creating...' : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
}
