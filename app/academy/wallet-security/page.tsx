import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleAlert,
  EyeOff,
  KeyRound,
  LockKeyhole,
  LogOut,
  MailCheck,
  ScanLine,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/layout/PageHeader";

const securitySteps = [
  {
    number: "01",
    title: "Confirm Your Email",
    description:
      "Complete the email confirmation sent during registration. This verifies that the email address connected to your PLATON account belongs to you.",
    icon: MailCheck,
  },
  {
    number: "02",
    title: "Create a Strong Password",
    description:
      "Use a long and unique password that is not used on any other website, email account or financial service.",
    icon: KeyRound,
  },
  {
    number: "03",
    title: "Keep Login Details Private",
    description:
      "Never share your password, authentication information or private account details with another person.",
    icon: EyeOff,
  },
  {
    number: "04",
    title: "Verify the Wallet Address",
    description:
      "Before sending π, compare the complete recipient wallet address carefully. A transfer sent to the wrong address may not be recoverable.",
    icon: ScanLine,
  },
  {
    number: "05",
    title: "Use the Official Website",
    description:
      "Access your wallet and the PLATON Market only through the official PLATON website. Avoid unknown links received through messages or social media.",
    icon: ShieldCheck,
  },
  {
    number: "06",
    title: "Sign Out Safely",
    description:
      "Always use Logout after accessing PLATON from a shared or public computer. Do not allow the browser to save your password on devices you do not control.",
    icon: LogOut,
  },
];

const accountProtection = [
  {
    title: "Protected Account Pages",
    description:
      "Private PLATON pages verify that you are signed in before displaying account information.",
    icon: LockKeyhole,
  },
  {
    title: "Email Authentication",
    description:
      "Your confirmed email address is used together with your password to access the account.",
    icon: MailCheck,
  },
  {
    title: "Personal Wallet",
    description:
      "Your PLATON wallet and balances are connected to your authenticated account.",
    icon: WalletCards,
  },
  {
    title: "Secure Logout",
    description:
      "The Logout button ends your active PLATON session on the current browser.",
    icon: LogOut,
  },
];

const warningSigns = [
  "Someone asks you to reveal your PLATON password.",
  "A message pressures you to send π immediately.",
  "A website address looks similar to PLATON but is not the official address.",
  "Someone promises guaranteed profits in exchange for an advance transfer.",
  "A person asks you to share account screenshots containing private information.",
  "A recipient changes their wallet address during a conversation.",
];

const securityChecklist = [
  "My registration email is confirmed.",
  "My password is strong and used only for PLATON.",
  "I have checked that I am using the official website.",
  "I have verified the complete recipient wallet address.",
  "I have reviewed the transfer amount before confirming.",
  "I will log out when using a shared device.",
];

export default function WalletSecurityLessonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[190px]" />

          <div className="absolute -left-40 top-[750px] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.05] blur-[170px]" />

          <div className="absolute -right-40 top-[1350px] h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[170px]" />
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
            badge="Lesson 3 · Beginner"
            title="Wallet Security"
            description="Learn how to protect your PLATON account, verify wallet transfers and recognize common security threats."
          />

          <div className="mt-10 rounded-[32px] border border-cyan-400/15 bg-cyan-400/[0.055] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <ShieldCheck
                  size={25}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
                  Lesson objective
                </p>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
                  By the end of this lesson, you will understand how to
                  protect your account credentials, identify suspicious
                  requests and safely confirm PLATON wallet transfers.
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
                Protecting Your PLATON Account
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              {securitySteps.map((step) => {
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

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-400">
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
                Account protection
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                How Your Account Is Protected
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40">
                PLATON uses authenticated account access to protect
                personal wallet pages and account information.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {accountProtection.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/[0.07] bg-black/20 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.08] text-violet-400">
                        <Icon size={19} />
                      </div>

                      <div>
                        <h3 className="text-base font-black text-white">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-white/40">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-red-400/15 bg-red-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
                <CircleAlert
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Security Warning Signs
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Stop and review the situation whenever you notice one
                  of these warning signs.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {warningSigns.map((warning) => (
                    <div
                      key={warning}
                      className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4"
                    >
                      <CircleAlert
                        size={18}
                        className="mt-0.5 shrink-0 text-red-300"
                      />

                      <p className="text-sm leading-6 text-white/50">
                        {warning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-emerald-400/15 bg-emerald-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                <BadgeCheck
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Security Checklist
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Complete this checklist before using your wallet or
                  confirming a transfer.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {securityChecklist.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />

                      <p className="text-sm leading-6 text-white/50">
                        {item}
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
                Account protected
              </p>

              <p className="mt-2 text-sm text-white/40">
                Review your wallet address and account security before
                making your next transaction.
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
                href="/wallet"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black transition hover:bg-emerald-300"
              >
                Open Your Wallet

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