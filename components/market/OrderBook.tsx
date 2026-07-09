const buyOrders = [
  ["0.1208", "12,540 π"],
  ["0.1207", "8,210 π"],
  ["0.1205", "21,300 π"],
  ["0.1202", "5,940 π"],
  ["0.1200", "31,600 π"],
];

const sellOrders = [
  ["0.1212", "4,820 π"],
  ["0.1214", "7,140 π"],
  ["0.1218", "10,250 π"],
  ["0.1220", "15,880 π"],
  ["0.1225", "28,400 π"],
];

export default function OrderBook() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-2xl">
      <h2 className="mb-8 text-3xl font-black">
        Order Book
      </h2>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-4 font-bold text-emerald-400">
            BUY
          </h3>

          <div className="space-y-3">
            {buyOrders.map(([price, amount]) => (
              <div
                key={price}
                className="flex justify-between rounded-xl bg-emerald-400/10 px-4 py-3"
              >
                <span className="text-emerald-400">${price}</span>
                <span>{amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-red-400">
            SELL
          </h3>

          <div className="space-y-3">
            {sellOrders.map(([price, amount]) => (
              <div
                key={price}
                className="flex justify-between rounded-xl bg-red-400/10 px-4 py-3"
              >
                <span className="text-red-400">${price}</span>
                <span>{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}