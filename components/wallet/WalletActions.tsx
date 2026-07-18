import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  ShoppingCart,
} from "lucide-react";

import Button from "@/components/ui/Button";

const actions = [
  {
    title: "Send π",
    description: "Transfer PLATON securely",
    icon: ArrowUpRight,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    glow: "bg-emerald-400/10",
    variant: "primary" as const,
  },
  {
    title: "Receive",
    description: "Share your wallet address",
    icon: ArrowDownLeft,
    iconStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
    glow: "bg-cyan-400/10",
    variant: "secondary" as const,
  },
  {
    title: "Stake",
    description: "Earn network rewards",
    icon: Coins,
    iconStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
    glow: "bg-violet-400/10",
    variant: "secondary" as const,
  },
  {
    title: "Buy π",
    description: "Open the official market",
    icon: ShoppingCart,
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    glow: "bg-yellow-400/10",
    variant: "gold" as const,
  },
];

export default function WalletActions() {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
            Wallet Controls
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
            Quick Actions
          </h2>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
            Wallet Ready
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <div
              key={action.title}
              className="group relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.06]"
            >
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full blur-[65px] transition duration-300 group-hover:scale-125 ${action.glow}`}
              />

              <div className="relative">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${action.iconStyle}`}
                >
                  <Icon
                    size={21}
                    strokeWidth={2.2}
                  />
                </div>

                <h3 className="mt-5 text-lg font-black text-white">
                  {action.title}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-white/35">
                  {action.description}
                </p>

                <div className="mt-5">
                  <Button variant={action.variant}>
                    {action.title}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}