"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IAccount } from '@/app/(models)/Account';
import { ObjectId } from 'mongodb';

interface AccountFormProps {
  account?: Partial<IAccount>;
  onComplete?: () => void;
}

interface AccountFormData {
  name: string;
  type: string;
  balance: number;
  tags?: ObjectId[];
}

export default function AccountForm({account, onComplete}: AccountFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AccountFormData>({
    name: account?.name || 'Provide Account Name',
    type: account?.type || 'Checking',
    balance: account?.balance || 0,
    tags: account?.tags || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('formData :>> ', formData);
    
    try {
      const url = account?._id ? `/api/accounts/${account._id}` : '/api/accounts';
      const method = account?._id ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      if (response.ok) {
        if (onComplete) {
          onComplete();
        } else {
          setFormData({ name: 'Provide Account Name', type: 'Checking', balance: 0, tags: [] });
          router.refresh();
        }
      }
      
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
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
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
          className="button-primary w-full mt-6"
        >
          Submit Form
        </button>
      </div>
    </form>
  );
}
