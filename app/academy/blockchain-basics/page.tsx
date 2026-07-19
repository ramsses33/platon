import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Blocks,
  CheckCircle2,
  Clock3,
  Database,
  Gauge,
  Hash,
  Layers3,
  Network,
  ReceiptText,
  Search,
  ShieldCheck,
  Timer,
  UsersRound,
  Wallet,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/layout/PageHeader";

const blockchainSteps = [
  {
    number: "01",
    title: "A Transaction Is Created",
    description:
      "A transaction begins when PLATON is transferred from one wallet address to another wallet address.",
    icon: ReceiptText,
  },
  {
    number: "02",
    title: "The Network Receives It",
    description:
      "The transaction is submitted to the network together with its sender, recipient, amount and transaction identifier.",
    icon: Network,
  },
  {
    number: "03",
    title: "Validators Confirm It",
    description:
      "Network validators verify transactions and help protect the blockchain from invalid activity.",
    icon: ShieldCheck,
  },
  {
    number: "04",
    title: "Transactions Enter a Block",
    description:
      "Confirmed transactions are grouped together inside a block containing a unique block number.",
    icon: Blocks,
  },
  {
    number: "05",
    title: "The Block Joins the Blockchain",
    description:
      "The confirmed block becomes part of the permanent blockchain history and can be inspected through the Explorer.",
    icon: Layers3,
  },
];

const networkMetrics = [
  {
    title: "Network TPS",
    description:
      "Transactions per second measures how many transactions the network can process during one second.",
    icon: Gauge,
    iconStyle:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
  },
  {
    title: "Validators",
    description:
      "Validators verify network activity and help maintain the integrity of confirmed blockchain records.",
    icon: UsersRound,
    iconStyle:
      "border-violet-400/20 bg-violet-400/10 text-violet-400",
  },
  {
    title: "Block Time",
    description:
      "Block Time shows the approximate time required for the network to produce or confirm a new block.",
    icon: Timer,
    iconStyle:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  },
  {
    title: "Network Status",
    description:
      "Network Status indicates whether the PLATON network services are currently operational.",
    icon: Activity,
    iconStyle:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  },
];

const blockFields = [
  {
    title: "Block Number",
    description:
      "A unique sequential identifier assigned to the block, usually displayed with a number sign.",
    icon: Hash,
  },
  {
    title: "Transactions",
    description:
      "The number of confirmed transactions contained inside the block.",
    icon: Database,
  },
  {
    title: "Validator",
    description:
      "The network validator associated with confirming or producing the block.",
    icon: ShieldCheck,
  },
  {
    title: "Block Age",
    description:
      "The amount of time that has passed since the block was confirmed.",
    icon: Clock3,
  },
];

const transactionFields = [
  {
    title: "Transaction Hash",
    description:
      "A unique identifier used to distinguish one blockchain transaction from another.",
    icon: Hash,
  },
  {
    title: "Amount",
    description:
      "The quantity of PLATON transferred during the transaction.",
    icon: ReceiptText,
  },
  {
    title: "From",
    description:
      "The wallet address that sent the PLATON transaction.",
    icon: Wallet,
  },
  {
    title: "To",
    description:
      "The wallet address that received the PLATON transaction.",
    icon: ArrowRight,
  },
  {
    title: "Status",
    description:
      "Confirmed means the transaction has been accepted and included in the network history.",
    icon: CheckCircle2,
  },
  {
    title: "Transaction Age",
    description:
      "The time that has passed since the transaction was confirmed.",
    icon: Clock3,
  },
];

const searchTypes = [
  {
    title: "Wallet Address",
    description:
      "Use a complete wallet address to inspect activity connected to that wallet.",
    icon: Wallet,
  },
  {
    title: "Transaction Identifier",
    description:
      "Use a complete transaction hash to locate one specific transaction.",
    icon: ReceiptText,
  },
  {
    title: "Block Number",
    description:
      "Use a block number to inspect transactions and information associated with that block.",
    icon: Blocks,
  },
  {
    title: "Network Identifier",
    description:
      "Explorer identifiers help locate specific records within the PLATON network history.",
    icon: Network,
  },
];

const explorerRules = [
  "Always compare the complete wallet address before sending PLATON.",
  "A shortened wallet address or transaction hash is only a visual preview.",
  "Transaction status should be confirmed before treating a transfer as complete.",
  "Block Age and Transaction Age show when network activity occurred.",
  "A transaction hash identifies a transaction but does not reveal a password.",
  "Never share passwords or private account information when checking a transaction.",
];

export default function BlockchainBasicsLessonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <Navbar />

      <section className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[190px]" />

          <div className="absolute -left-40 top-[800px] h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[170px]" />

          <div className="absolute -right-40 top-[1500px] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.05] blur-[170px]" />
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
            badge="Lesson 5 · Intermediate"
            title="Blockchain Basics"
            description="Understand transactions, blocks, validators and the information displayed inside the official PLATON Explorer."
          />

          <div className="mt-10 rounded-[32px] border border-blue-400/15 bg-blue-400/[0.055] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-400">
                <Blocks
                  size={25}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                  Lesson objective
                </p>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
                  By the end of this lesson, you will understand how a
                  transaction becomes part of a block, how validators
                  protect the network and how to read the main sections
                  of the PLATON Explorer.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                Blockchain process
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                How a Transaction Is Confirmed
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              {blockchainSteps.map((step) => {
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

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-400/[0.08] text-blue-400">
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
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
                Network metrics
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                Understanding Network Status
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/40">
                The PLATON Explorer displays important indicators that
                describe network activity and performance.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {networkMetrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    key={metric.title}
                    className="rounded-[24px] border border-white/[0.07] bg-black/20 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${metric.iconStyle}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div>
                        <h3 className="text-base font-black text-white">
                          {metric.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-white/40">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-violet-400/15 bg-violet-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
                <Layers3
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Reading Latest Blocks
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Every block contains information that helps identify
                  when it was confirmed and what network activity it
                  contains.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {blockFields.map((field) => {
                    const Icon = field.icon;

                    return (
                      <div
                        key={field.title}
                        className="rounded-2xl border border-white/[0.07] bg-black/20 p-5"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className="shrink-0 text-violet-400"
                          />

                          <h3 className="text-sm font-black text-white">
                            {field.title}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-white/40">
                          {field.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-emerald-400/15 bg-emerald-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                <ReceiptText
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Reading Latest Transactions
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  A transaction record explains what was transferred,
                  which wallets were involved and whether the transfer
                  was confirmed.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {transactionFields.map((field) => {
                    const Icon = field.icon;

                    return (
                      <div
                        key={field.title}
                        className="rounded-2xl border border-white/[0.07] bg-black/20 p-5"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className="shrink-0 text-emerald-400"
                          />

                          <h3 className="text-sm font-black text-white">
                            {field.title}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-white/40">
                          {field.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[32px] border border-cyan-400/15 bg-cyan-400/[0.045] p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <Search
                  size={22}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Explorer Search
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Blockchain records are located using identifiers.
                  Always use the complete identifier when checking a
                  specific record.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {searchTypes.map((type) => {
                    const Icon = type.icon;

                    return (
                      <div
                        key={type.title}
                        className="rounded-2xl border border-white/[0.07] bg-black/20 p-5"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className="shrink-0 text-cyan-400"
                          />

                          <h3 className="text-sm font-black text-white">
                            {type.title}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-white/40">
                          {type.description}
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
                  Explorer Safety Rules
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  Explorer information is useful for verification, but
                  wallet transfers must still be checked carefully.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {explorerRules.map((rule) => (
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
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-400">
                Explore the network
              </p>

              <p className="mt-2 text-sm text-white/40">
                Open the official Explorer and review blocks,
                transactions and network metrics.
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
                href="/explorer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 py-4 text-sm font-black text-white transition hover:bg-blue-400"
              >
                Open PLATON Explorer

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
