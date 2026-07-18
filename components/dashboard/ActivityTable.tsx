import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Gift,
} from "lucide-react";

const activity = [
  {
    type: "BUY",
    amount: "+2,500 π",
    time: "2 min ago",
    description: "PLATON purchased",
    icon: ArrowDownLeft,
    accent: "text-emerald-400",
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    badgeStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  },
  {
    type: "STAKE",
    amount: "10,000 π",
    time: "15 min ago",
    description: "Added to staking",
    icon: Coins,
    accent: "text-violet-400",
    iconStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
    badgeStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
  },
  {
    type: "REWARD",
    amount: "+84 π",
    time: "1 hour ago",
    description: "Staking reward received",
    icon: Gift,
    accent: "text-yellow-300",
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    badgeStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  },
  {
    type: "SELL",
    amount: "-1,250 π",
    time: "Yesterday",
    description: "PLATON sold",
    icon: ArrowUpRight,
    accent: "text-rose-400",
    iconStyle:
      "border-rose-400/20 bg-rose-400/10 text-rose-400",
    badgeStyle:
      "border-rose-400/20 bg-rose-400/10 text-rose-400",
  },
];

export default function ActivityTable() {
  return (
    <section className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl">
      <div className="flex flex-col gap-4 border-b border-white/[0.07] px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
            Transaction History
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
            Recent Activity
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Your latest PLATON wallet and network transactions.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>

          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
            Live
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="hidden grid-cols-[minmax(0,1fr)_170px_130px] gap-4 border-b border-white/[0.07] px-4 pb-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/25 md:grid">
          <span>Activity</span>

          <span className="text-right">
            Amount
          </span>

          <span className="text-right">
            Time
          </span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {activity.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={`${item.type}-${item.time}`}
                className="group flex flex-col gap-5 rounded-2xl px-4 py-5 transition duration-300 hover:bg-white/[0.035] md:grid md:grid-cols-[minmax(0,1fr)_170px_130px] md:items-center md:gap-4"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${item.iconStyle}`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={2.2}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-lg border px-2.5 py-1 text-[10px] font-black tracking-[0.12em] ${item.badgeStyle}`}
                      >
                        {item.type}
                      </span>

                      <span className="text-xs font-medium text-white/25 md:hidden">
                        {item.time}
                      </span>
                    </div>

                    <p className="mt-2 truncate text-sm font-semibold text-white/60">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:block md:text-right">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/25 md:hidden">
                    Amount
                  </span>

                  <p
                    className={`text-lg font-black tabular-nums ${item.accent}`}
                  >
                    {item.amount}
                  </p>
                </div>

                <p className="hidden text-right text-sm font-semibold text-white/35 md:block">
                  {item.time}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}