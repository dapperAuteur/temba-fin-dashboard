interface AccountTypeStats {
  type: string;
  totalBalance: number;
  accountCount: number;
  averageBalance: number;
}

interface AccountTypeCardProps {
  stats: AccountTypeStats;
  onClick: () => void;
}

export const AccountTypeCard = ({ stats, onClick }: AccountTypeCardProps) => {
  return (
    <div className="card-3d cursor-pointer" onClick={onClick}>
      <h3 className="text-xl font-geist-sans mb-2">{stats.type}</h3>
      <div className="space-y-2">
        <p className="font-geist-mono text-lg">
          Total: ${stats.totalBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
        <p className="text-foreground">
          Accounts: {stats.accountCount}
        </p>
        <p className="text-foreground">
          Average: ${stats.averageBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>
    </div>
  );
};
