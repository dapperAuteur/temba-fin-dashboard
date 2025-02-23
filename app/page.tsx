import React from "react";
import AboutTool from "./(components)/About";
// import { useAccounts } from "./hooks/useAccounts";

const Home: React.FC = () => {
  // const { accounts, isLoading, error } = useAccounts()
  // Fake data for accountsFake
  const accountsFake = [
    {
      _id: 1,
      name: "Checking Account",
      balance: 2345.67,
      accountNumber: "****1234",
    },
    {
      _id: 2,
      name: "Savings Account",
      balance: 10345.89,
      accountNumber: "****5678",
    },
    {
      _id: 3,
      name: "Credit Card",
      balance: -567.89,
      accountNumber: "****9876",
    },
    {
      _id: 4,
      name: "401(k)",
      balance: 45000.00,
      accountNumber: "****4321",
    },
  ];

  // if (isLoading) {
  //   return <div className="max-w-7xl mx-auto py-10 px-4">Loading...</div>
  // }

  // if (error) {
  //   return <div className="max-w-7xl mx-auto py-10 px-4">Failed to load accounts</div>
  // }

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard
        </h1>

        {/* Accounts Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {accountsFake.map((account) => (
            <div
              key={account._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {account.name}
              </h2>
              <p className="text-gray-600 mt-1">
                Account Number: {account.accountNumber}
              </p>
              <p
                className={`text-xl mt-2 font-bold ${
                  account.balance >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ${account.balance.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <AboutTool/>
      </div>
    </main>
  );
};

export default Home;
