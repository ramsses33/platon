import Link from "next/link";
import {
  ArrowRight,
  LockKeyhole,
  RefreshCw,
} from "lucide-react";

import MarketMiniChart from "@/components/market/MarketMiniChart";
import MarketQuickTrade from "@/components/market/MarketQuickTrade";

export default function MarketSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#05070A] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute left-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/[0.04] blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-400/[0.04] blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-8 flex min-w-0 flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-400">
              Official PLATON Market
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Buy and Sell π Only Here
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40 sm:text-base sm:leading-7">
              PLATON is available only through
              its official ecosystem. Follow the
              live network price and open the full
              market when you are ready to trade.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                <LockKeyhole
                  size={14}
                  className="text-yellow-300"
                />

                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/45">
                  Official ecosystem only
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                <RefreshCw
                  size={14}
                  className="text-cyan-400"
                />

                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/45">
                  Updates every 13 minutes
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/market"
            className="group inline-flex min-h-14 w-full shrink-0 items-center justify-center gap-2 rounded-2xl border border-yellow-400/25 bg-yellow-400/10 px-6 text-sm font-black text-yellow-300 transition duration-300 hover:-translate-y-0.5 hover:border-yellow-400/40 hover:bg-yellow-400/15 sm:w-fit"
          >
            Open Full Market

            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)] lg:items-stretch">
          <div className="min-w-0">
            <MarketMiniChart />
          </div>

          <div className="min-w-0">
            <MarketQuickTrade />
          </div>
        </div>
      </div>
    </section>
  );
}