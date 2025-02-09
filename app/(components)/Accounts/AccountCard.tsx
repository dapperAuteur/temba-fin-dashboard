"use client";

import { IAccount } from './../../(models)/Account';
import { useState } from 'react';
import AccountForm from './AccountForm';

interface AccountCardProps {
  account: Partial<IAccount>
}

export const AccountCard = ({ account }: AccountCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    console.log('account :>> ', account);
    try {
      const response = await fetch(`/api/accounts/${account._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Trigger refresh of accounts list
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (isEditing) {
    return <AccountForm account={account} onComplete={() => setIsEditing(false)} />;
  }

  if (!account || !account.name) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-default border border-default text-center">
        <p className="text-foreground">Account information unavailable</p>
      </div>
    )
  }
  return (
    <div className="card-3d">
      <h3 className="text-xl font-geist-sans mb-2">{account.name}</h3>
      <p className="text-foreground mb-2">Type: {account.type || 'Not specified'}</p>
      <p className="font-geist-mono text-lg">
        Balance: ${(account.balance || 0).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </p>
      <div className="flex gap-4 mt-4">
        <button 
          onClick={() => setIsEditing(true)}
          className="button-edit"
        >
          Edit
        </button>
        <button 
          onClick={handleDelete}
          className="button-delete"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
