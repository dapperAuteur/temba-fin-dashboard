import { IAccount } from './../../(models)/Account';
import { AccountCard } from './AccountCard';

interface AccountsListProps {
  accounts: IAccount[]
}

export const AccountsList = ({ accounts = [] }: AccountsListProps) => {
  if (!accounts.length) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-geist-sans mb-4">Your Accounts</h2>
        <div className="bg-background p-8 rounded-lg shadow-default border border-default">
          <p className="text-lg mb-4">No accounts found</p>
          <a href="/accounts/create-new-account" className="button-primary">
            Create Your First Account
          </a>
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
