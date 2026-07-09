import Link from "next/link";
import LiveChart from "@/components/market/LiveChart";
import BuySellPanel from "@/components/market/BuySellPanel";
import MarketStats from "@/components/market/MarketStats";

export default function MarketSection() {
  return (
    <section className="relative bg-[#05070A] px-8 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[5px] text-emerald-400">
              Official PLATON Market
            </p>

            <h2 className="mt-4 text-5xl font-black">
              Buy and Sell π Only Here
            </h2>

            <p className="mt-4 max-w-2xl text-gray-400">
              PLATON is not listed on external exchanges. The official network
              price updates every 13 minutes.
            </p>
          </div>

          <Link
            href="/market"
            className="rounded-2xl bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 px-6 py-4 font-bold text-black"
          >
            Open Market
          </Link>
        </div>

        <MarketStats />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <LiveChart />
          <BuySellPanel />
        </div>
      </div>
    </section>
  );
}