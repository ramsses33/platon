import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleDollarSign,
  Coins,
  KeyRound,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";

const lessonSteps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Register with your email address and sign in to access your personal PLATON dashboard.",
    icon: KeyRound,
  },
  {
    number: "02",
    title: "Open Your PLATON Wallet",
    description:
      "Your account includes an internal wallet with a unique PLATON address for receiving and sending π.",
    icon: WalletCards,
  },
  {
    number: "03",
    title: "Fund Your Account",
    description:
      "Deposit supported assets into your account before buying PLATON through the official market.",
    icon: CircleDollarSign,
  },
  {
    number: "04",
    title: "Buy and Use π",
    description:
      "Buy PLATON on the official market, transfer it to other users, make payments or participate in staking.",
    icon: Coins,
  },
];

const safetyRules = [
  "Use a strong and unique account password.",
  "Never share login codes, passwords or private information.",
  "Always verify the recipient wallet address before sending π.",
  "Use only the official PLATON website and market.",
];

export default function GettingStartedLessonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[190px]" />

          <div className="absolute -left-40 top-[700px] h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[170px]" />
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
            badge="Lesson 1 · Beginner"
            title="Getting Started with PLATON"
            description="Learn how to create your account, use your wallet and begin exploring the official PLATON ecosystem."
          />

          <div className="mt-10 rounded-[32px] border border-emerald-400/15 bg-emerald-400/[0.055] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                <BookOpen
                  size={25}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                  Lesson objective
                </p>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
                  By the end of this lesson, you will understand
                  the basic steps required to access PLATON,
                  manage your wallet and safely begin using π.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {lessonSteps.map((step) => {
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
                      <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                        {step.title}
                      </h2>

                      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40 sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="mt-8 rounded-[32px] border border-yellow-400/15 bg-yellow-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                <ShieldCheck
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Basic Security Rules
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Protecting your account is an essential part of
                  using the PLATON ecosystem.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {safetyRules.map((rule) => (
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
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-400">
                Lesson completed
              </p>

              <p className="mt-2 text-sm text-white/40">
                Continue to the next lesson to learn how to buy π.
              </p>
            </div>

            <Link
              href="/academy"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black transition hover:bg-emerald-300"
            >
              Return to Academy

              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}