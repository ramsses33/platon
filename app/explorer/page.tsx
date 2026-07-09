import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ExplorerSearch from "@/components/explorer/ExplorerSearch";
import NetworkStats from "@/components/explorer/NetworkStats";
import LatestBlocks from "@/components/explorer/LatestBlocks";
import LatestTransactions from "@/components/explorer/LatestTransactions";

export default function ExplorerPage() {
  return (
    <main className="min-h-screen bg-[#05070A] text-white">
      <Navbar />

      <section className="px-8 pt-32 pb-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[5px] text-emerald-400">
            PLATON Explorer
          </p>

          <h1 className="mt-4 text-6xl font-black">Network Activity</h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Track blocks, transactions, wallets and validators across the official
            PLATON Network.
          </p>

          <ExplorerSearch />

          <NetworkStats />

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <LatestBlocks />
            <LatestTransactions />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}