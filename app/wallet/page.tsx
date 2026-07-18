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
import UsdtDepositCard from "@/components/wallet/UsdtDepositCard";
import UsdtDepositHistory from "@/components/wallet/UsdtDepositHistory";
import UsdtWithdrawalForm from "@/components/wallet/UsdtWithdrawalForm";
import UsdtWithdrawalHistory from "@/components/wallet/UsdtWithdrawalHistory";

import ProtectedPage from "@/components/auth/ProtectedPage";

export default function WalletPage() {
  return (
    <ProtectedPage>
      <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
        <Navbar />

        <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-yellow-500/[0.07] blur-[190px]" />

            <div className="absolute -left-52 top-[650px] h-[520px] w-[520px] rounded-full bg-violet-500/[0.05] blur-[170px]" />

            <div className="absolute -right-52 top-[1150px] h-[520px] w-[520px] rounded-full bg-emerald-500/[0.04] blur-[170px]" />
          </div>

          <div className="relative mx-auto w-full max-w-[1500px]">
            <PageHeader
              badge="PLATON Wallet"
              title="Your π Command Center"
              description="Store, send and receive PLATON securely through the official network wallet."
            />

            <div className="mt-10">
              <WalletData />
            </div>

            <div className="mt-8">
              <WalletActions />
            </div>

            <div className="mt-8">
              <UsdtDepositCard />
            </div>

            <div className="mt-8">
              <UsdtDepositHistory />
            </div>

            <div className="mt-8">
              <UsdtWithdrawalForm />
            </div>

            <div className="mt-8">
              <UsdtWithdrawalHistory />
            </div>

            <div className="mt-8 grid items-stretch gap-8 xl:grid-cols-2">
              <SendPlatonForm />

              <ReceiveCard />
            </div>

            <div className="mt-8 grid items-stretch gap-8 xl:grid-cols-[minmax(0,1.65fr)_420px]">
              <PortfolioChart />

              <AssetsCard />
            </div>

            <div className="mt-8">
              <TransactionsList />
            </div>

            <div className="mt-10 rounded-[28px] border border-white/[0.07] bg-white/[0.025] px-6 py-5 backdrop-blur-xl">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>

                    <span className="text-sm font-semibold text-white/45">
                      Wallet synchronized
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />

                    <span className="text-sm font-semibold text-white/45">
                      PLATON Network active
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-white/25">
                  Official PLATON Wallet
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedPage>
  );
}