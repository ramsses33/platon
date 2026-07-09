const stats = [
  ["Portfolio", "$148,250"],
  ["24H Profit", "+$2,845"],
  ["Staking", "18,400 π"],
  ["Rewards", "+245 π"],
];

export default function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      {stats.map(([title, value]) => (
        <div
          key={title}
          className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
        >
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-black text-emerald-400">
            {value}
          </h2>
        </div>
      ))}
    </div>
  );
}