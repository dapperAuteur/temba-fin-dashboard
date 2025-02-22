"use client";
import React, { useState } from "react";
import AboutTool from "./../(components)/About";
import { useAccounts } from "./../hooks/modelHooks";
import { AccountCard } from "../(components)/Accounts/AccountCard";
import { AccountTypeCard } from "../(components)/Accounts/AccountTypeCard";

const Dashboard: React.FC = () => {
  const { data: accounts, isLoading, error } = useAccounts();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto py-10 px-4">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-7xl mx-auto py-10 px-4">Failed to load accounts</div>;
  }

  const accountsByType = accounts.reduce((acc, account) => {
    const type = account.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(account);
    return acc;
  }, {} as Record<string, typeof accounts>);

  const typeStats = Object.entries(accountsByType).map(([type, accounts]) => {
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    return {
      type,
      totalBalance,
      accountCount: accounts.length,
      averageBalance: totalBalance / accounts.length
    };
  });

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard
        </h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {typeStats.map((stats) => (
            <AccountTypeCard
              key={stats.type}
              stats={stats}
              onClick={() => setSelectedType(stats.type)}
            />
          ))}
        </div>

        {selectedType && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedType} Accounts
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {accountsByType[selectedType].map((account) => (
                <AccountCard key={account._id} account={account} />
              ))}
            </div>
          </>
        )}
        
        <AboutTool/>
      </div>
    </main>
  );
};

export default Dashboard;
