import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import LiveChart from "@/components/market/LiveChart";
import BuySellPanel from "@/components/market/BuySellPanel";
import OrderBook from "@/components/market/OrderBook";
import RecentTrades from "@/components/market/RecentTrades";
import MarketStats from "@/components/market/MarketStats";
import SearchBar from "@/components/market/SearchBar";

export default function MarketPage() {
  return (
    <main className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="px-8 pt-32 pb-24">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            badge="Official PLATON Market"
            title="Buy & Sell π"
            description="PLATON is traded only through its official market. The network price updates every 13 minutes."
          />

          <MarketStats />
          <SearchBar />

          <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <LiveChart />

            <div className="space-y-8">
              <BuySellPanel />
              <OrderBook />
              <RecentTrades />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}