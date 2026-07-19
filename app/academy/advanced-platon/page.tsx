import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Coins,
  Globe2,
  GraduationCap,
  Landmark,
  Network,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  UsersRound,
  Vote,
  WalletCards,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/layout/PageHeader";

const ecosystemFeatures = [
  {
    title: "Official Market",
    description:
      "PLATON is bought and sold through the official ecosystem rather than external exchanges.",
    icon: BarChart3,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  },
  {
    title: "Internal Wallet",
    description:
      "Each authenticated account includes a PLATON wallet for holding, sending and receiving π.",
    icon: WalletCards,
    iconStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
  },
  {
    title: "Automatic Settlement",
    description:
      "Market orders are processed automatically through user matching and Treasury execution.",
    icon: RefreshCw,
    iconStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
  },
  {
    title: "PLATON Staking",
    description:
      "Users can stake available π, accumulate rewards and return staked assets to their wallet.",
    icon: Sparkles,
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  },
  {
    title: "PLATON Explorer",
    description:
      "The Explorer displays network metrics, blocks, transactions and wallet identifiers.",
    icon: Network,
    iconStyle:
      "border-blue-400/20 bg-blue-400/10 text-blue-400",
  },
  {
    title: "PLATON Academy",
    description:
      "The official Academy explains account security, trading, staking and blockchain activity.",
    icon: GraduationCap,
    iconStyle:
      "border-rose-400/20 bg-rose-400/10 text-rose-400",
  },
];

const tokenomics = [
  {
    percent: "40%",
    title: "Community",
    description:
      "The largest allocation is reserved for community participation and ecosystem growth.",
  },
  {
    percent: "20%",
    title: "Ecosystem",
    description:
      "Supports products, services, partnerships and development across the PLATON ecosystem.",
  },
  {
    percent: "15%",
    title: "Development",
    description:
      "Allocated to the technical development and continued improvement of the network.",
  },
  {
    percent: "10%",
    title: "Treasury",
    description:
      "Supports official market operations, liquidity management and ecosystem stability.",
  },
  {
    percent: "10%",
    title: "Marketing",
    description:
      "Supports brand awareness, education and expansion into new markets.",
  },
  {
    percent: "5%",
    title: "Reserve",
    description:
      "Held as a strategic reserve for future network requirements.",
  },
];

const treasuryRoles = [
  {
    title: "Completes Market Orders",
    description:
      "When user-to-user matching does not fill an order completely, Treasury processes the remaining amount.",
    icon: Landmark,
  },
  {
    title: "Supports Official Liquidity",
    description:
      "Treasury helps maintain continuous access to buying and selling within the official market.",
    icon: Coins,
  },
  {
    title: "Automatic Processing",
    description:
      "Users do not need to search manually for another buyer or seller before an order can complete.",
    icon: RefreshCw,
  },
  {
    title: "Controlled Ecosystem",
    description:
      "Treasury operates as part of the internal PLATON market and its controlled economic structure.",
    icon: ShieldCheck,
  },
];

const priceSystem = [
  {
    number: "01",
    title: "Official Network Price",
    description:
      "The Market displays the official PLATON price used throughout the ecosystem.",
  },
  {
    number: "02",
    title: "13-Minute Update Cycle",
    description:
      "The official network price is scheduled to update every 13 minutes.",
  },
  {
    number: "03",
    title: "Execution Limit",
    description:
      "Each market order displays an execution limit before the user confirms the transaction.",
  },
  {
    number: "04",
    title: "Treasury Spread",
    description:
      "The Trading Panel displays the Treasury spread applied during official market execution.",
  },
];

const roadmap = [
  {
    year: "2026",
    title: "Genesis Launch",
    description:
      "Development of the official website, PLATON wallet and internal market.",
    status: "Current Foundation",
    icon: Coins,
  },
  {
    year: "2027",
    title: "Network Expansion",
    description:
      "Expansion of staking, Explorer services and future governance capabilities.",
    status: "Roadmap",
    icon: Vote,
  },
  {
    year: "2028",
    title: "Global Adoption",
    description:
      "Planned development of AI services, payment tools and merchant integrations.",
    status: "Future Vision",
    icon: Globe2,
  },
];

const futureUtilities = [
  {
    title: "Governance",
    description:
      "Future governance may allow eligible ecosystem participants to take part in selected network decisions.",
    icon: Vote,
  },
  {
    title: "AI Integration",
    description:
      "The roadmap includes future AI-powered tools and intelligent ecosystem services.",
    icon: Bot,
  },
  {
    title: "Merchant Tools",
    description:
      "Future merchant services are intended to expand the use of PLATON for business payments.",
    icon: Store,
  },
  {
    title: "Worldwide Adoption",
    description:
      "The long-term vision includes expanding PLATON access to users, businesses and partners worldwide.",
    icon: Globe2,
  },
];

const advancedRules = [
  "Current website functions must not be confused with future roadmap plans.",
  "Governance and AI integration are planned features and are not active account tools yet.",
  "PLATON is currently bought and sold through the official market.",
  "The Treasury completes the remaining amount when user matching is insufficient.",
  "Tokenomics percentages describe the current published distribution model.",
  "Roadmap dates and future utilities may change as development continues.",
];

export default function AdvancedPlatonLessonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-rose-500/[0.07] blur-[190px]" />

          <div className="absolute -left-40 top-[850px] h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[170px]" />

          <div className="absolute -right-40 top-[1600px] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.05] blur-[170px]" />
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
            badge="Lesson 6 · Advanced"
            title="Advanced PLATON"
            description="Explore the PLATON economy, Treasury system, token distribution, official price model and long-term ecosystem roadmap."
          />

          <div className="mt-10 rounded-[32px] border border-rose-400/15 bg-rose-400/[0.055] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-400">
                <BrainCircuit
                  size={25}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-400">
                  Lesson objective
                </p>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
                  By the end of this lesson, you will understand how the
                  main PLATON services work together, how the Treasury
                  supports the official market and which ecosystem
                  utilities belong to the future roadmap.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-[32px] border border-white/[0.08] bg-white/[0.035] p-6 backdrop-blur-2xl sm:p-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                Current ecosystem
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                PLATON Services Available Today
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40">
                These services form the current operational foundation
                of the official PLATON ecosystem.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {ecosystemFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-[24px] border border-white/[0.07] bg-black/20 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${feature.iconStyle}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div>
                        <h3 className="text-base font-black text-white">
                          {feature.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-white/40">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                Distribution model
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                PLATON Tokenomics
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40">
                The published PLATON distribution model allocates the
                complete token supply across six ecosystem categories.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {tokenomics.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/25">
                        Allocation
                      </p>

                      <h3 className="mt-3 text-xl font-black text-white">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-3xl font-black text-emerald-400">
                      {item.percent}
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-white/40">
                    {item.description}
                  </p>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      style={{ width: item.percent }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-violet-400/15 bg-violet-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
                <Landmark
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  The Role of PLATON Treasury
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Treasury is part of the official market settlement
                  system and supports continuous internal trading.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {treasuryRoles.map((role) => {
                    const Icon = role.icon;

                    return (
                      <div
                        key={role.title}
                        className="rounded-2xl border border-white/[0.07] bg-black/20 p-5"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className="shrink-0 text-violet-400"
                          />

                          <h3 className="text-sm font-black text-white">
                            {role.title}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-white/40">
                          {role.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
                Official pricing
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                PLATON Price System
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              {priceSystem.map((item) => (
                <article
                  key={item.number}
                  className="rounded-[30px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex items-center gap-4 sm:w-52 sm:shrink-0">
                      <span className="text-sm font-black tracking-[0.18em] text-white/20">
                        {item.number}
                      </span>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-400">
                        <RefreshCw
                          size={21}
                          strokeWidth={2.2}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40 sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-white/[0.08] bg-white/[0.035] p-6 backdrop-blur-2xl sm:p-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                Development plan
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                PLATON Roadmap
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40">
                The roadmap separates the current network foundation
                from planned future ecosystem expansion.
              </p>
            </div>

            <div className="mt-7 space-y-5">
              {roadmap.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.year}
                    className="rounded-[26px] border border-white/[0.07] bg-black/20 p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-4 sm:w-48 sm:shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-400">
                          <Icon size={20} />
                        </div>

                        <p className="text-2xl font-black text-blue-400">
                          {item.year}
                        </p>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-xl font-black text-white">
                            {item.title}
                          </h3>

                          <span className="w-fit rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-white/40">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-emerald-400/15 bg-emerald-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                <Globe2
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Future Ecosystem Utilities
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  These utilities belong to the long-term PLATON vision
                  and should not be treated as active features today.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {futureUtilities.map((utility) => {
                    const Icon = utility.icon;

                    return (
                      <div
                        key={utility.title}
                        className="rounded-2xl border border-white/[0.07] bg-black/20 p-5"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className="shrink-0 text-emerald-400"
                          />

                          <h3 className="text-sm font-black text-white">
                            {utility.title}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-white/40">
                          {utility.description}
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
                <ShieldCheck
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Advanced PLATON Checklist
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Keep the following distinctions in mind when
                  evaluating the ecosystem and its future plans.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {advancedRules.map((rule) => (
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
              <p className="text-xs font-black uppercase tracking-[0.16em] text-rose-400">
                Advanced lesson completed
              </p>

              <p className="mt-2 text-sm text-white/40">
                Review the official Whitepaper for the PLATON vision,
                economy and long-term development roadmap.
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
                href="/whitepaper"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-6 py-4 text-sm font-black text-white transition hover:bg-rose-400"
              >
                Open Whitepaper

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
