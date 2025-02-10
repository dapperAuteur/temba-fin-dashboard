'use client'

import AccountForm from '@/app/(components)/Accounts/AccountForm'
import { useRouter } from 'next/navigation';
import { IAccount } from '@/types/accounts';

export default function CreateAccountPage() {
  const router = useRouter();

  const handleAccountCreated = (newAccount: IAccount) => {
    router.push(`/accounts/${newAccount._id}`);
    router.refresh();
  }

  return (
    <AccountForm onComplete={handleAccountCreated}/>
  )
}