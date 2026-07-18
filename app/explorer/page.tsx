import {
  Activity,
  Blocks,
  CircleCheck,
  Database,
  Network,
  ShieldCheck,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";

import ExplorerSearch from "@/components/explorer/ExplorerSearch";
import NetworkStats from "@/components/explorer/NetworkStats";
import LatestBlocks from "@/components/explorer/LatestBlocks";
import LatestTransactions from "@/components/explorer/LatestTransactions";

const explorerFeatures = [
  {
    title: "Live Network",
    description: "Real-time PLATON activity",
    icon: Activity,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  },
  {
    title: "Verified Data",
    description: "Official network records",
    icon: ShieldCheck,
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  },
  {
    title: "Blockchain History",
    description: "Blocks and transactions",
    icon: Database,
    iconStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
  },
];

export default function ExplorerPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[190px]" />

          <div className="absolute -left-52 top-[700px] h-[520px] w-[520px] rounded-full bg-violet-500/[0.05] blur-[170px]" />

          <div className="absolute -right-52 top-[1150px] h-[520px] w-[520px] rounded-full bg-yellow-500/[0.04] blur-[170px]" />
        </div>

        <div className="relative mx-auto w-full max-w-[1500px]">
          <PageHeader
            badge="PLATON Explorer"
            title="Network Activity"
            description="Track blocks, transactions, wallets and network activity across the official PLATON Network."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {explorerFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.065]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${feature.iconStyle}`}
                    >
                      <Icon
                        size={21}
                        strokeWidth={2.2}
                      />
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>

                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-400">
                        Live
                      </span>
                    </div>
                  </div>

                  <h2 className="mt-6 text-xl font-black text-white">
                    {feature.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/35">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                  <Network
                    size={22}
                    strokeWidth={2.2}
                  />
                </div>

                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400">
                    Network Search
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                    Explore PLATON
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                    Search by wallet address, transaction,
                    block or network identifier.
                  </p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2">
                <CircleCheck
                  size={15}
                  className="text-emerald-400"
                />

                <span className="text-xs font-bold text-white/45">
                  Official Explorer
                </span>
              </div>
            </div>

            <div className="mt-8">
              <ExplorerSearch />
            </div>
          </div>

          <div className="mt-8">
            <NetworkStats />
          </div>

          <div className="mt-8 grid items-start gap-8 xl:grid-cols-2">
            <div className="min-w-0">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
                  <Blocks size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-400">
                    Blockchain
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    Latest Blocks
                  </h2>
                </div>
              </div>

              <LatestBlocks />
            </div>

            <div className="min-w-0">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                  <Activity size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                    Network Flow
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    Latest Transactions
                  </h2>
                </div>
              </div>

              <LatestTransactions />
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/[0.07] bg-white/[0.025] px-6 py-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>

                  <span className="text-sm text-white/40">
                    Explorer synchronized
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />

                  <span className="text-sm text-white/40">
                    Network data active
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-white/25">
                Official PLATON Explorer
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}