"use client"

import { useEffect, useState } from 'react';
import { AccountsList } from '@/app/(components)/Accounts/AccountList'

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([])
  
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/accounts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAccounts(data.accounts);
        console.log('25 list accounts :>> ', accounts);

      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
  
    fetchAccounts();
  }, []);

  return <AccountsList accounts={accounts} />
}

export default AccountsPage;