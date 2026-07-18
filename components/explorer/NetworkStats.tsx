import {
  Gauge,
  ShieldCheck,
  Timer,
  UsersRound,
} from "lucide-react";

const stats = [
  {
    title: "Network TPS",
    value: "2,184",
    description: "Transactions per second",
    badge: "High performance",
    icon: Gauge,
    iconStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
    valueStyle: "text-cyan-400",
    badgeStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
    glow: "bg-cyan-400/10",
  },
  {
    title: "Validators",
    value: "128",
    description: "Active network validators",
    badge: "Secured",
    icon: UsersRound,
    iconStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
    valueStyle: "text-violet-400",
    badgeStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
    glow: "bg-violet-400/10",
  },
  {
    title: "Block Time",
    value: "2 sec",
    description: "Average confirmation time",
    badge: "Fast",
    icon: Timer,
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    valueStyle: "text-yellow-300",
    badgeStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    glow: "bg-yellow-400/10",
  },
  {
    title: "Network Status",
    value: "Online",
    description: "All systems operational",
    badge: "Live",
    icon: ShieldCheck,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    valueStyle: "text-emerald-400",
    badgeStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    glow: "bg-emerald-400/10",
  },
];

export default function NetworkStats() {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400">
            Network Metrics
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
            PLATON Network Status
          </h2>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>

          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
            Network Live
          </span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.065]"
            >
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-[70px] transition duration-300 group-hover:scale-125 ${stat.glow}`}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.iconStyle}`}
                  >
                    <Icon
                      size={21}
                      strokeWidth={2.2}
                    />
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${stat.badgeStyle}`}
                  >
                    {stat.badge}
                  </span>
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.17em] text-white/30">
                  {stat.title}
                </p>

                <h3
                  className={`mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl ${stat.valueStyle}`}
                >
                  {stat.value}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/35">
                  {stat.description}
                </p>

                <div className="mt-6 h-px bg-gradient-to-r from-white/10 via-white/[0.05] to-transparent" />

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-white/25">
                    PLATON Network
                  </span>

                  <span
                    className={`h-2 w-2 rounded-full ${
                      stat.title === "Network Status"
                        ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]"
                        : "bg-white/25"
                    }`}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}