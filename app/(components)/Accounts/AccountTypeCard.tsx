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
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer" onClick={onClick}>
      <h3 className="text-lg font-semibold text-gray-800">{stats.type}</h3>
      <div className="space-y-2">
        <p className={`text-xl mt-2 font-bold ${
                stats.totalBalance >= 0 ? "text-green-500" : "text-red-500"
              }`}>
          Total: ${stats.totalBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
        <p className="text-xl font-bold text-gray-800 my-6">
          Accounts: {stats.accountCount}
        </p>
        <p className={`text-base mt-2 font-bold ${
                    stats.averageBalance >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
          Average: ${stats.averageBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>
    </div>
  );
};
