const trades = [
  ["BUY", "0.1210", "5,240 π", "12:01:03"],
  ["SELL", "0.1209", "2,180 π", "12:00:41"],
  ["BUY", "0.1208", "9,550 π", "11:59:57"],
  ["BUY", "0.1207", "1,430 π", "11:59:10"],
  ["SELL", "0.1205", "7,880 π", "11:58:46"],
  ["BUY", "0.1204", "3,620 π", "11:58:12"],
];

function RecentTrades() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-black">Recent Trades</h2>
        <span className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300">
          LIVE
        </span>
      </div>

      <div className="space-y-3">
        {trades.map(([type, price, amount, time]) => (
          <div key={time} className="grid grid-cols-4 rounded-xl bg-black/30 px-4 py-3">
            <span className={type === "BUY" ? "font-bold text-emerald-400" : "font-bold text-red-400"}>
              {type}
            </span>
            <span>${price}</span>
            <span>{amount}</span>
            <span className="text-right text-gray-500">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentTrades;