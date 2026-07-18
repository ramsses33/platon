import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Coins,
  ReceiptText,
} from "lucide-react";

const transactions = [
  {
    hash: "0x9af2...82d1",
    amount: "12,450 π",
    from: "platon_8f2a...91c4",
    to: "platon_72de...a821",
    age: "2 sec",
  },
  {
    hash: "0x4bc1...7da4",
    amount: "4,180 π",
    from: "platon_314b...cc42",
    to: "platon_a821...88fd",
    age: "4 sec",
  },
  {
    hash: "0x91ae...11f2",
    amount: "18,250 π",
    from: "platon_d18a...720c",
    to: "platon_1fc2...4e91",
    age: "6 sec",
  },
  {
    hash: "0xfaa2...82aa",
    amount: "2,800 π",
    from: "platon_34bd...197f",
    to: "platon_c842...7ab1",
    age: "8 sec",
  },
  {
    hash: "0x1bd4...9ce1",
    amount: "32,140 π",
    from: "platon_91ca...842d",
    to: "platon_24ac...6ed3",
    age: "10 sec",
  },
];

export default function LatestTransactions() {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/[0.07] blur-[100px]" />

      <div className="relative flex items-start justify-between gap-5 border-b border-white/[0.07] px-6 py-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400">
            Network Transfers
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">
            Latest Transactions
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Recently confirmed transfers across the PLATON Network.
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
          <ReceiptText
            size={22}
            strokeWidth={2.2}
          />
        </div>
      </div>

      <div className="relative p-4 sm:p-6">
        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <article
              key={transaction.hash}
              className="group rounded-[22px] border border-white/[0.07] bg-black/20 p-5 transition duration-300 hover:border-emerald-400/20 hover:bg-black/30"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                      <ArrowRight
                        size={21}
                        strokeWidth={2.2}
                      />

                      {index === 0 && (
                        <span className="absolute -right-1 -top-1 flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#0A0D12] bg-emerald-400" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-mono text-sm font-black text-cyan-400">
                          {transaction.hash}
                        </p>

                        {index === 0 && (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-400">
                            Latest
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <CheckCircle2
                          size={13}
                          className="text-emerald-400"
                        />

                        <span className="text-xs font-semibold text-white/30">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="flex items-center gap-2 sm:justify-end">
                      <Coins
                        size={16}
                        className="text-yellow-300"
                      />

                      <p className="text-xl font-black text-white">
                        {transaction.amount}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-white/30 sm:justify-end">
                      <Clock3 size={13} />

                      <span>{transaction.age}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/25">
                      From
                    </p>

                    <p className="mt-1 truncate font-mono text-xs text-white/45">
                      {transaction.from}
                    </p>
                  </div>

                  <div className="hidden h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/30 sm:flex">
                    <ArrowRight size={14} />
                  </div>

                  <div className="min-w-0 sm:text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/25">
                      To
                    </p>

                    <p className="mt-1 truncate font-mono text-xs text-white/45">
                      {transaction.to}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs font-medium text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing latest {transactions.length} transactions
          </span>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span>Transactions synchronized</span>
          </div>
        </div>
      </div>
    </section>
  );
}