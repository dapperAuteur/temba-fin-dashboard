"use client"

import { useAccounts } from '@/app/hooks/modelHooks';
import { AccountCard } from './AccountCard';
import Link from 'next/link';

export const AccountsList = () => {
  const { data: accounts, isLoading, error } = useAccounts();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-geist-sans mb-4">Your Accounts</h2>
        <div className="bg-background p-8 rounded-lg shadow-default border border-default">
          <p className="text-lg mb-4">Loading accounts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-geist-sans mb-4">Your Accounts</h2>
        <div className="bg-background p-8 rounded-lg shadow-default border border-default">
          <p className="text-lg mb-4 text-red-500">Failed to load accounts</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!accounts?.length) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-geist-sans mb-4">Your Accounts</h2>
        <div className="bg-background p-8 rounded-lg shadow-default border border-default">
          <p className="text-lg mb-4">No accounts found</p>
          <Link href="/accounts/create-new-account" className="button-primary">
            Create Your First Account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-geist-sans mb-6">Your Accounts</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account._id?.toString()} account={account} />
        ))}
      </div>
    </div>
  )
}
