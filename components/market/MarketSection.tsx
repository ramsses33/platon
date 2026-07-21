import Link from "next/link";

import BuySellPanel from "@/components/market/BuySellPanel";
import LiveChart from "@/components/market/LiveChart";
import MarketStats from "@/components/market/MarketStats";

export default function MarketSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#05070A] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex min-w-0 flex-col gap-6 sm:mb-10 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase leading-5 tracking-[3px] text-emerald-400 sm:text-sm sm:tracking-[5px]">
              Official PLATON Market
            </p>

            <h2 className="mt-4 max-w-4xl break-words text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Buy and Sell π Only Here
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">
              PLATON is not listed on external exchanges.
              The official network price updates every 13
              minutes.
            </p>
          </div>

          <Link
            href="/market"
            className="inline-flex w-full shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 px-6 py-4 text-center font-bold text-black sm:w-auto"
          >
            Open Market
          </Link>
        </div>

        <div className="min-w-0">
          <MarketStats />
        </div>

        <div className="mt-8 grid w-full min-w-0 grid-cols-1 gap-6 sm:mt-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
          <div className="w-full min-w-0">
            <LiveChart />
          </div>

          <div className="w-full min-w-0">
            <BuySellPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
