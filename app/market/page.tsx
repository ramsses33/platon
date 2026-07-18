import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import MarketHeaderStats from "@/components/market/MarketHeaderStats";
import LiveChart from "@/components/market/LiveChart";
import BuySellPanel from "@/components/market/BuySellPanel";
import OrderBook from "@/components/market/OrderBook";
import RecentTrades from "@/components/market/RecentTrades";

export default function MarketPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070a] text-white">
      <Navbar />

      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-yellow-500/[0.07] blur-[180px]" />

          <div className="absolute -left-48 top-[500px] h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[160px]" />

          <div className="absolute -right-48 top-[900px] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.04] blur-[160px]" />
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/[0.08] px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-70" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
                </span>

                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
                  Official PLATON Market
                </span>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                Exclusive Network Market
              </div>
            </div>

            <div className="mt-6 max-w-4xl">
              <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Buy & Sell{" "}
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  π
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/45 sm:text-lg">
                PLATON is traded exclusively through its official market.
                The network price updates every 13 minutes.
              </p>
            </div>
          </div>

          <MarketHeaderStats />

          <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="min-w-0 space-y-8">
              <LiveChart />

              <BuySellPanel />
            </div>

            <div className="min-w-0 space-y-8">
              <OrderBook />

              <RecentTrades />
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/[0.07] bg-white/[0.025] px-6 py-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span>Market operational</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />

                  <span>13-minute price cycle</span>
                </div>
              </div>

              <p className="font-semibold text-white/25">
                PLATON is not listed on external exchanges
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}