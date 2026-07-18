const stats = [
  {
    title: "Portfolio",
    value: "$148,250",
    change: "+8.24%",
    label: "Total portfolio value",
    accent: "text-yellow-300",
    badge:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    glow: "bg-yellow-400/10",
  },
  {
    title: "24H Profit",
    value: "+$2,845",
    change: "+1.96%",
    label: "Performance today",
    accent: "text-emerald-400",
    badge:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    glow: "bg-emerald-400/10",
  },
  {
    title: "Staking",
    value: "18,400 π",
    change: "12.4% APY",
    label: "Currently staked",
    accent: "text-violet-400",
    badge:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
    glow: "bg-violet-400/10",
  },
  {
    title: "Rewards",
    value: "+245 π",
    change: "This month",
    label: "Total rewards earned",
    accent: "text-cyan-400",
    badge:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
    glow: "bg-cyan-400/10",
  },
];

export default function StatsCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.065]"
        >
          <div
            className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-[70px] transition duration-300 group-hover:scale-125 ${stat.glow}`}
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/30">
                  {stat.title}
                </p>

                <p className="mt-2 text-sm text-white/40">
                  {stat.label}
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1.5 text-[10px] font-black tracking-[0.1em] ${stat.badge}`}
              >
                {stat.change}
              </span>
            </div>

            <h2
              className={`mt-8 text-3xl font-black tracking-[-0.04em] sm:text-4xl ${stat.accent}`}
            >
              {stat.value}
            </h2>

            <div className="mt-6 h-px bg-gradient-to-r from-white/10 via-white/[0.05] to-transparent" />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-white/25">
                PLATON Network
              </span>

              <span className={`h-2 w-2 rounded-full ${stat.glow}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}