const tx = [
  ["0x9af2...82d1", "12,450 π"],
  ["0x4bc1...7da4", "4,180 π"],
  ["0x91ae...11f2", "18,250 π"],
  ["0xfaa2...82aa", "2,800 π"],
  ["0x1bd4...9ce1", "32,140 π"],
];

export default function LatestTransactions() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <h2 className="mb-6 text-2xl font-black">
        Latest Transactions
      </h2>

      <div className="space-y-4">
        {tx.map(([hash, amount]) => (
          <div
            key={hash}
            className="flex items-center justify-between rounded-2xl bg-black/30 p-4"
          >
            <p className="font-mono text-sm text-cyan-400">
              {hash}
            </p>

            <span className="font-bold">
              {amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}