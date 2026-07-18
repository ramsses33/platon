import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PortfolioChart from "@/components/wallet/PortfolioChart";
import StatsCards from "@/components/dashboard/StatsCards";
import ActivityTable from "@/components/dashboard/ActivityTable";
import ProtectedPage from "@/components/auth/ProtectedPage";

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
        <Navbar />

        <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-yellow-500/[0.07] blur-[180px]" />

            <div className="absolute -left-48 top-[520px] h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[160px]" />

            <div className="absolute -right-48 top-[900px] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.04] blur-[160px]" />
          </div>

          <div className="relative mx-auto max-w-[1500px]">
            <PageHeader
              badge="PLATON Dashboard"
              title="Your Network Overview"
              description="Monitor your portfolio, wallet activity and PLATON network performance in real time."
            />

            <div className="mt-10">
              <StatsCards />
            </div>

            <div className="mt-8 grid items-stretch gap-8 xl:grid-cols-[minmax(0,1.65fr)_420px]">
              <Card>
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
                      Portfolio Analytics
                    </p>

                    <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                      Portfolio Growth
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                      Track the historical performance and total value of your
                      PLATON portfolio.
                    </p>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>

                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                      Live
                    </span>
                  </div>
                </div>

                <div className="min-h-[360px]">
                  <PortfolioChart />
                </div>
              </Card>

              <Card>
                <div className="mb-8">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
                    Wallet Controls
                  </p>

                  <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                    Quick Actions
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Access the main PLATON network functions.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button>Buy π</Button>

                  <Button variant="secondary">
                    Send π
                  </Button>

                  <Button variant="secondary">
                    Stake π
                  </Button>

                  <Button variant="gold">
                    Explorer
                  </Button>
                </div>

                <div className="mt-8 rounded-[24px] border border-white/[0.07] bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                        Network Status
                      </p>

                      <p className="mt-2 text-sm font-bold text-white">
                        All systems operational
                      </p>
                    </div>

                    <span className="h-3 w-3 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
                  </div>

                  <div className="mt-5 border-t border-white/[0.07] pt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/35">
                        Official market
                      </span>

                      <span className="font-bold text-yellow-300">
                        Active
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-white/35">
                        Price cycle
                      </span>

                      <span className="font-bold text-white">
                        13 minutes
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-8">
              <ActivityTable />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedPage>
  );
}