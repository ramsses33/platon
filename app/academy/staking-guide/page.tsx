import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpFromLine,
  Calculator,
  CalendarDays,
  CheckCircle2,
  Coins,
  Gift,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/layout/PageHeader";

const stakingSteps = [
  {
    number: "01",
    title: "Open PLATON Staking",
    description:
      "Sign in to your PLATON account and open the Staking page from the main navigation.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Review Your Balances",
    description:
      "Check Available, Staked and Rewards before starting. Available shows the π that can currently be staked.",
    icon: WalletCards,
  },
  {
    number: "03",
    title: "Select Stake",
    description:
      "Choose the Stake tab when you want to move available PLATON from your wallet into staking.",
    icon: ArrowDownToLine,
  },
  {
    number: "04",
    title: "Enter the Amount",
    description:
      "Enter the amount of π you want to stake. You can press Max to use the maximum available wallet balance.",
    icon: Coins,
  },
  {
    number: "05",
    title: "Confirm Stake π",
    description:
      "Review the amount and press Stake π. After the operation succeeds, your Available and Staked balances update automatically.",
    icon: CheckCircle2,
  },
  {
    number: "06",
    title: "Track Your Rewards",
    description:
      "Staking rewards accumulate automatically over time according to the current PLATON staking APR.",
    icon: Gift,
  },
];

const stakingFields = [
  {
    title: "Available",
    description:
      "The amount of PLATON currently available in your wallet for staking.",
    icon: WalletCards,
    iconStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
  },
  {
    title: "Staked",
    description:
      "The amount of PLATON currently placed in staking.",
    icon: Coins,
    iconStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
  },
  {
    title: "Rewards",
    description:
      "The staking rewards accumulated by your active staked balance.",
    icon: Gift,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  },
  {
    title: "Current APR",
    description:
      "The current annual percentage rate used to calculate estimated staking rewards.",
    icon: TrendingUp,
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  },
];

const unstakingSteps = [
  {
    title: "Select Unstake",
    description:
      "Switch from Stake to Unstake inside the staking panel.",
    icon: ArrowUpFromLine,
  },
  {
    title: "Enter the Amount",
    description:
      "Enter how much of your staked PLATON you want to return to your wallet.",
    icon: Coins,
  },
  {
    title: "Use Max When Needed",
    description:
      "Press Max when you want to unstake your full current staked balance.",
    icon: WalletCards,
  },
  {
    title: "Confirm Unstake π",
    description:
      "Press Unstake π. The selected amount and accumulated reward are processed by the staking system.",
    icon: CheckCircle2,
  },
];

const calculatorDetails = [
  {
    title: "Monthly Reward",
    description:
      "A 30-day estimate calculated from the amount entered and the current APR.",
    icon: CalendarDays,
  },
  {
    title: "Yearly Reward",
    description:
      "A 365-day estimate of the potential reward at the current APR.",
    icon: TrendingUp,
  },
  {
    title: "Estimated Balance",
    description:
      "The original staking amount plus the estimated reward after one year.",
    icon: Calculator,
  },
];

const importantRules = [
  "You must be signed in before using PLATON staking.",
  "The staking amount must be greater than zero.",
  "You cannot stake more than your available wallet balance.",
  "You cannot unstake more than your current staked balance.",
  "The displayed APR may change in the future.",
  "Calculator results are estimates and not guaranteed future returns.",
];

export default function StakingGuideLessonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-violet-500/[0.07] blur-[190px]" />

          <div className="absolute -left-40 top-[750px] h-[500px] w-[500px] rounded-full bg-yellow-500/[0.05] blur-[170px]" />

          <div className="absolute -right-40 top-[1400px] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.05] blur-[170px]" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          <Link
            href="/academy"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/40 transition hover:text-white"
          >
            <ArrowLeft size={17} />

            Back to Academy
          </Link>

          <PageHeader
            badge="Lesson 4 · Intermediate"
            title="PLATON Staking Guide"
            description="Learn how to stake π, earn network rewards, estimate potential earnings and return staked PLATON to your wallet."
          />

          <div className="mt-10 rounded-[32px] border border-violet-400/15 bg-violet-400/[0.055] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
                <Sparkles
                  size={25}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-400">
                  Lesson objective
                </p>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
                  By the end of this lesson, you will understand the
                  complete PLATON staking process, the meaning of each
                  balance and how to estimate rewards using the official
                  staking calculator.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                Step-by-step guide
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                How to Stake π
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              {stakingSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="group rounded-[30px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl transition duration-300 hover:border-white/15 hover:bg-white/[0.06] sm:p-8"
                  >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-4 sm:w-52 sm:shrink-0">
                        <span className="text-sm font-black tracking-[0.18em] text-white/20">
                          {step.number}
                        </span>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.08] text-violet-400">
                          <Icon
                            size={21}
                            strokeWidth={2.2}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                          {step.title}
                        </h3>

                        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40 sm:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-white/[0.08] bg-white/[0.035] p-6 backdrop-blur-2xl sm:p-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                Staking panel
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                Understanding Your Balances
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40">
                Review these values before confirming any staking or
                unstaking operation.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {stakingFields.map((field) => {
                const Icon = field.icon;

                return (
                  <div
                    key={field.title}
                    className="rounded-[24px] border border-white/[0.07] bg-black/20 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${field.iconStyle}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div>
                        <h3 className="text-base font-black text-white">
                          {field.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-white/40">
                          {field.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-emerald-400/15 bg-emerald-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                <ArrowUpFromLine
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  How to Unstake π
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Unstaking returns the selected amount from your
                  staked balance to your available PLATON wallet
                  balance.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {unstakingSteps.map((step) => {
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.title}
                        className="rounded-2xl border border-white/[0.07] bg-black/20 p-5"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className="shrink-0 text-emerald-400"
                          />

                          <h3 className="text-sm font-black text-white">
                            {step.title}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-white/40">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-yellow-400/15 bg-yellow-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                <Calculator
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Staking Calculator
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Enter a PLATON amount and press Estimate Earnings to
                  calculate potential rewards using the current 8.4%
                  APR.
                </p>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {calculatorDetails.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/[0.07] bg-black/20 p-5"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className="shrink-0 text-yellow-300"
                          />

                          <h3 className="text-sm font-black text-white">
                            {item.title}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-white/40">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-violet-400/15 bg-violet-400/[0.06] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-400">
                        Current calculation
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/40">
                        Monthly estimates use 30 days. Yearly estimates
                        use 365 days.
                      </p>
                    </div>

                    <p className="text-2xl font-black text-emerald-400">
                      8.4% APR
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-cyan-400/15 bg-cyan-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <RefreshCw
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Refreshing Staking Information
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  The staking panel updates after successful operations.
                  You can also press the refresh button to reload your
                  Available, Staked and Rewards balances.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-red-400/15 bg-red-400/[0.04] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
                <ShieldCheck
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Important Staking Rules
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Review these rules before confirming an operation.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {importantRules.map((rule) => (
                    <div
                      key={rule}
                      className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />

                      <p className="text-sm leading-6 text-white/50">
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-400">
                Ready to stake π
              </p>

              <p className="mt-2 text-sm text-white/40">
                Open PLATON Staking and review your available wallet
                balance.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/academy"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm font-black text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Return to Academy
              </Link>

              <Link
                href="/staking"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-6 py-4 text-sm font-black text-white transition hover:bg-violet-400"
              >
                Open PLATON Staking

                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}