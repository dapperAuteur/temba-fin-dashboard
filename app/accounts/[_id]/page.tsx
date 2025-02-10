'use client'

import { useEffect, useState } from 'react'
import { IAccount } from '@/types/accounts'
import { LoadingState } from '@/types/common'
import { apiClient } from '@/lib/api'

export default function AccountPage({ params }: { params: { _id: string } }) {
  const [loadingState, setLoadingState] = useState<LoadingState<IAccount>>({
    isLoading: true,
    error: null,
    data: null
  });

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const result = await apiClient.fetch<IAccount>(`/api/accounts/${params._id}`);
        setLoadingState({
          isLoading: false,
          error: null,
          data: result.data
        });
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error: error as Error,
          data: null
        });
      }
    };

    fetchAccount()
  }, [params._id])

  if (loadingState.isLoading) {
    return <div>Loading account details...</div>;
  }
  
  if (loadingState.error) {
    return <div>Error: {loadingState.error.message}</div>;
  }

  const account = loadingState.data as IAccount;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{account.name}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Account Type</span>
          <span className="account-type">{account.type}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Balance</span>
          <span className={`balance-amount ${account.balance >= 0 ? 'balance-positive' : 'balance-negative'}`}>
            ${account.balance.toLocaleString()}
          </span>
        </div>

        {account.tags && account.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {account.tags.map(tag => (
              <span key={tag.toString()} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {tag.toString()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
