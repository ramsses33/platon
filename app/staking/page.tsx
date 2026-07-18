import {
  CalendarDays,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";

import StakingActions from "@/components/staking/StakingActions";
import StakingCalculator from "@/components/staking/StakingCalculator";

const stakingFeatures = [
  {
    title: "8.4% APR",
    description:
      "Rewards are calculated according to the current PLATON staking rate.",
    icon: Sparkles,
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  },
  {
    title: "Daily Calculation",
    description:
      "Your staking rewards accumulate automatically over time.",
    icon: CalendarDays,
    iconStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
  },
  {
    title: "Secure Staking",
    description:
      "Stake and unstake operations are executed through protected database functions.",
    icon: ShieldCheck,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
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
            {stakingFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.065]"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${feature.iconStyle}`}
                  >
                    <Icon
                      size={21}
                      strokeWidth={2.2}
                    />
                  </div>

                  <h2 className="mt-6 text-xl font-black tracking-[-0.03em] text-white">
                    {feature.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/40">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
            <StakingActions />

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
                    Daily reward calculation
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