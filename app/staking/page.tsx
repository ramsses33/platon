import {
  ArrowUpRight,
  CalendarDays,
  Coins,
  Gift,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import StakingCalculator from "@/components/staking/StakingCalculator";

const stakingStats = [
  {
    title: "Total Staked",
    value: "84,200 π",
    description: "Currently securing the network",
    icon: LockKeyhole,
    iconStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
  },
  {
    title: "Total Rewards",
    value: "+2,481 π",
    description: "Rewards earned to date",
    icon: Gift,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  },
  {
    title: "Reward Cycle",
    value: "Daily",
    description: "Automatic reward calculation",
    icon: CalendarDays,
    iconStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
  },
];

export default function StakingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-violet-500/[0.07] blur-[190px]" />

          <div className="absolute -left-52 top-[650px] h-[520px] w-[520px] rounded-full bg-yellow-500/[0.05] blur-[170px]" />

          <div className="absolute -right-52 top-[900px] h-[520px] w-[520px] rounded-full bg-emerald-500/[0.05] blur-[170px]" />
        </div>

        <div className="relative mx-auto w-full max-w-[1500px]">
          <PageHeader
            badge="PLATON Staking"
            title="Earn Rewards with π"
            description="Stake your PLATON and earn passive rewards while supporting the official network."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {stakingStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="group rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.065]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.iconStyle}`}
                    >
                      <Icon size={21} strokeWidth={2.2} />
                    </div>

                    <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                      Active
                    </span>
                  </div>

                  <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-white/30">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                    {stat.value}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/35">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid items-stretch gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(420px,0.8fr)]">
            <Card>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-400">
                    Network Rewards
                  </p>

                  <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                    Staking Overview
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                    Lock your PLATON in the official network and
                    receive automatic rewards every day.
                  </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
                  <ShieldCheck
                    size={14}
                    className="text-emerald-400"
                  />

                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
                    Network Secured
                  </span>
                </div>
              </div>

              <div className="mt-10 rounded-[30px] border border-emerald-400/15 bg-gradient-to-br from-emerald-400/[0.1] via-black/20 to-violet-400/[0.08] p-6 sm:p-8">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/30">
                      Estimated APR
                    </p>

                    <div className="mt-4 flex items-end gap-3">
                      <h3 className="text-6xl font-black tracking-[-0.07em] text-emerald-400 sm:text-7xl">
                        8.4
                      </h3>

                      <span className="pb-2 text-3xl font-black text-emerald-400">
                        %
                      </span>
                    </div>

                    <p className="mt-4 max-w-md text-sm leading-6 text-white/40">
                      Rewards are calculated daily and distributed
                      automatically to your staking balance.
                    </p>
                  </div>

                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                    <TrendingUp
                      size={34}
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/[0.07] bg-black/20 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
                      <Coins size={18} />
                    </div>

                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/30">
                      Staked Balance
                    </p>
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-white">
                    84,200 π
                  </h3>

                  <p className="mt-2 text-xs text-white/25">
                    Actively generating rewards
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/[0.07] bg-black/20 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                      <Gift size={18} />
                    </div>

                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/30">
                      Earned Rewards
                    </p>
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-emerald-400">
                    +2,481 π
                  </h3>

                  <p className="mt-2 text-xs text-white/25">
                    Total staking earnings
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-white/[0.07] bg-black/20 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                      <Sparkles size={20} />
                    </div>

                    <div>
                      <p className="font-black text-white">
                        Ready to earn more?
                      </p>

                      <p className="mt-1 text-sm text-white/35">
                        Increase your staking position.
                      </p>
                    </div>
                  </div>

                  <div className="sm:min-w-[190px]">
                    <Button>
                      <span>Stake π Now</span>

                      <ArrowUpRight
                        size={17}
                        className="ml-2"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <StakingCalculator />
          </div>

          <div className="mt-8 rounded-[28px] border border-white/[0.07] bg-white/[0.025] px-6 py-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-sm text-white/40">
                    Staking operational
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />

                  <span className="text-sm text-white/40">
                    Daily reward cycle
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-white/25">
                Official PLATON Staking
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}