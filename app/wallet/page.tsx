import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import WalletActions from "@/components/wallet/WalletActions";
import PortfolioChart from "@/components/wallet/PortfolioChart";
import AssetsCard from "@/components/wallet/AssetsCard";
import ReceiveCard from "@/components/wallet/ReceiveCard";
import WalletData from "@/components/wallet/WalletData";
import SendPlatonForm from "@/components/wallet/SendPlatonForm";
import TransactionsList from "@/components/wallet/TransactionsList";
import ProtectedPage from "@/components/auth/ProtectedPage";

export default function WalletPage() {
  return (
    <ProtectedPage>
      <main className="min-h-screen bg-[#05070A] text-white">
        <Navbar />

        <section className="px-8 pt-32 pb-24">
          <div className="mx-auto max-w-7xl">
            <PageHeader
              badge="PLATON Wallet"
              title="Your π Command Center"
              description="Store, send, receive and stake PLATON through the official wallet."
            />

            <WalletData />

            <div className="mt-10">
              <WalletActions />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <SendPlatonForm />
              <ReceiveCard />
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <PortfolioChart />
              <AssetsCard />
            </div>

            <div className="mt-8">
              <TransactionsList />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedPage>
  );
}