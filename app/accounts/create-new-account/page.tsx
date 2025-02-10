'use client'

import AccountForm from '@/app/(components)/Accounts/AccountForm'
import { useRouter } from 'next/navigation';

export default function CreateAccountPage() {
  const router = useRouter();

  const handleAccountCreated = () => {
    router.push('/accounts');
    router.refresh();
  }

  return (
    <AccountForm onComplete={handleAccountCreated}/>
  )
}