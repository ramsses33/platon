import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Coins,
  Gauge,
  Percent,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  WalletCards,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";

const buyingSteps = [
  {
    number: "01",
    title: "Open the Official Market",
    description:
      "Sign in to your PLATON account and open the Market page. PLATON is bought and sold only through the official ecosystem.",
    icon: ShoppingCart,
  },
  {
    number: "02",
    title: "Select Buy π",
    description:
      "Inside the Trading Panel, select Buy π. The Available section will display your current USDT balance.",
    icon: Coins,
  },
  {
    number: "03",
    title: "Review the Prices",
    description:
      "Official Price shows the current PLATON network price. Execution Limit shows the price limit calculated for your order.",
    icon: Gauge,
  },
  {
    number: "04",
    title: "Enter the PLATON Amount",
    description:
      "Enter how many π you want to purchase. You can also use the percentage buttons to spend part of your available USDT balance.",
    icon: Percent,
  },
  {
    number: "05",
    title: "Review the Order Total",
    description:
      "Check the Order Total, Treasury spread and Automatic settlement information before confirming the purchase.",
    icon: ReceiptText,
  },
  {
    number: "06",
    title: "Confirm the Purchase",
    description:
      "Press Buy PLATON. The system will create the order, match it automatically and add the purchased π to your wallet.",
    icon: CheckCircle2,
  },
];

const marketFields = [
  {
    title: "Available",
    description:
      "The amount of USDT currently available for purchasing PLATON.",
    icon: WalletCards,
  },
  {
    title: "Official Price",
    description:
      "The current official PLATON price displayed by the network.",
    icon: CircleDollarSign,
  },
  {
    title: "Execution Limit",
    description:
      "The maximum execution price used when processing the buy order.",
    icon: Gauge,
  },
  {
    title: "Order Total",
    description:
      "The estimated total amount of USDT required for the purchase.",
    icon: ReceiptText,
  },
];

const orderResults = [
  {
    title: "User Match",
    description:
      "Your order may be matched with another PLATON user.",
  },
  {
    title: "Treasury Execution",
    description:
      "When necessary, the PLATON Treasury automatically completes the order.",
  },
  {
    title: "Automatic Settlement",
    description:
      "Purchased PLATON is credited automatically after the order is executed.",
  },
];

export default function HowToBuyLessonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-yellow-500/[0.06] blur-[190px]" />

          <div className="absolute -left-40 top-[700px] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.05] blur-[170px]" />

          <div className="absolute -right-40 top-[1100px] h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[170px]" />
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
            badge="Lesson 2 · Beginner"
            title="How to Buy π"
            description="Learn how to purchase PLATON safely through the official market using your available USDT balance."
          />

          <div className="mt-10 rounded-[32px] border border-yellow-400/15 bg-yellow-400/[0.055] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                <ShoppingCart
                  size={25}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                  Lesson objective
                </p>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
                  By the end of this lesson, you will understand
                  every field inside the Trading Panel and know how
                  to place a PLATON buy order through the official
                  market.
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
                Buying PLATON
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              {buyingSteps.map((step) => {
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

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-400">
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
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-400">
                Trading Panel
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                Important Market Fields
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40">
                Review these values carefully before pressing the
                Buy PLATON button.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {marketFields.map((field) => {
                const Icon = field.icon;

                return (
                  <div
                    key={field.title}
                    className="rounded-[24px] border border-white/[0.07] bg-black/20 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.08] text-violet-400">
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
                <ShieldCheck
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  How the Order Is Executed
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  PLATON orders are processed automatically. You do
                  not need to search manually for another buyer or
                  seller.
                </p>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {orderResults.map((result) => (
                    <div
                      key={result.title}
                      className="rounded-2xl border border-white/[0.07] bg-black/20 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          size={18}
                          className="shrink-0 text-emerald-400"
                        />

                        <h3 className="text-sm font-black text-white">
                          {result.title}
                        </h3>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-white/40">
                        {result.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-yellow-400/15 bg-yellow-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <CircleDollarSign
                size={24}
                className="mt-1 shrink-0 text-yellow-300"
              />

              <div>
                <h2 className="text-xl font-black text-white">
                  Before Buying
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  Your account must contain enough available USDT
                  to cover the Order Total. USDT currently locked
                  by another open order cannot be used again.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-400">
                Ready to buy π
              </p>

              <p className="mt-2 text-sm text-white/40">
                Open the official Market and review your available
                USDT balance.
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
                href="/market"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black transition hover:bg-emerald-300"
              >
                Open Official Market

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