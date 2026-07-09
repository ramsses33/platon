export default function WalletOverview() {
  return (
    <div className="rounded-[32px] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-transparent to-emerald-500/10 p-8 backdrop-blur-2xl">
      <p className="text-sm uppercase tracking-[4px] text-yellow-400">
        Total Portfolio
      </p>

      <h1 className="mt-4 text-6xl font-black">
        128,450 π
      </h1>

      <p className="mt-3 text-3xl text-emerald-400">
        ≈ $13,287.15
      </p>

      <div className="mt-8 flex gap-4">
        <div className="rounded-2xl bg-emerald-500/15 px-5 py-3">
          <p className="text-sm text-gray-400">Today&apos;s Profit</p>
          <p className="text-xl font-bold text-emerald-400">
            +$284
          </p>
        </div>

        <div className="rounded-2xl bg-cyan-500/15 px-5 py-3">
          <p className="text-sm text-gray-400">Monthly</p>
          <p className="text-xl font-bold text-cyan-400">
            +$2,841
          </p>
        </div>
      </div>
    </div>
  );
}