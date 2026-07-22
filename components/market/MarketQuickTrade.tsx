import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  ShieldCheck,
  TimerReset,
} from "lucide-react";

import Countdown from "@/components/market/Countdown";
import PriceTicker from "@/components/market/PriceTicker";

export default function MarketQuickTrade() {
  return (
    <div className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-yellow-400/[0.07] blur-[90px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">
              Official Trading
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
              Buy or Sell π
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
              Access the only official PLATON market.
              PLATON is not listed on external
              exchanges.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
            <BadgeDollarSign
              size={22}
              strokeWidth={2.2}
            />
          </div>
        </div>

        <div className="mt-7 space-y-3">
          <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                  <ShieldCheck
                    size={18}
                    strokeWidth={2.2}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
                    Official Price
                  </p>

                  <div className="mt-1">
                    <PriceTicker />
                  </div>
                </div>
              </div>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-emerald-400">
                Live
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <TimerReset
                  size={18}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
                  Next Price Update
                </p>

                <div className="mt-1">
                  <Countdown />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/market"
            className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 text-sm font-black text-black transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            Buy π

            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/market"
            className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-5 text-sm font-black text-rose-300 transition duration-300 hover:-translate-y-0.5 hover:border-rose-400/40 hover:bg-rose-400/15"
          >
            Sell π

            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-6 border-t border-white/[0.07] pt-5">
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-white/30">
              Market access
            </span>

            <span className="font-black text-white/60">
              Official ecosystem only
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 text-xs">
            <span className="text-white/30">
              Price cycle
            </span>

            <span className="font-black text-white/60">
              Every 13 minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}