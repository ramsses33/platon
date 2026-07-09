const activity = [
  ["BUY", "+2,500 π", "2 min ago"],
  ["STAKE", "10,000 π", "15 min ago"],
  ["REWARD", "+84 π", "1 hour ago"],
  ["SELL", "-1,250 π", "Yesterday"],
];

export default function ActivityTable() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <h2 className="mb-6 text-2xl font-black">
        Recent Activity
      </h2>

      <div className="space-y-3">
        {activity.map(([type, amount, time]) => (
          <div
            key={`${type}-${time}`}
            className="flex items-center justify-between rounded-2xl bg-black/30 p-4"
          >
            <div>
              <p className="font-bold">{type}</p>
              <p className="text-sm text-gray-500">{time}</p>
            </div>

            <span className="font-bold text-emerald-400">
              {amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}