import {
  Blocks,
  Clock3,
  Database,
  Layers3,
} from "lucide-react";

const blocks = [
  {
    number: "#4829184",
    age: "2 sec",
    transactions: "184 tx",
    validator: "PLATON Validator 12",
  },
  {
    number: "#4829183",
    age: "4 sec",
    transactions: "201 tx",
    validator: "PLATON Validator 08",
  },
  {
    number: "#4829182",
    age: "6 sec",
    transactions: "176 tx",
    validator: "PLATON Validator 21",
  },
  {
    number: "#4829181",
    age: "8 sec",
    transactions: "192 tx",
    validator: "PLATON Validator 04",
  },
  {
    number: "#4829180",
    age: "10 sec",
    transactions: "208 tx",
    validator: "PLATON Validator 17",
  },
];

export default function LatestBlocks() {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-400/[0.07] blur-[100px]" />

      <div className="relative flex items-start justify-between gap-5 border-b border-white/[0.07] px-6 py-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-400">
            Blockchain Feed
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">
            Latest Blocks
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Recently confirmed blocks on the PLATON Network.
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
          <Blocks
            size={22}
            strokeWidth={2.2}
          />
        </div>
      </div>

      <div className="relative p-4 sm:p-6">
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <article
              key={block.number}
              className="group rounded-[22px] border border-white/[0.07] bg-black/20 p-5 transition duration-300 hover:border-violet-400/20 hover:bg-black/30"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
                    <Layers3
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
                      <h3 className="text-lg font-black text-violet-400">
                        {block.number}
                      </h3>

                      {index === 0 && (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-400">
                          Latest
                        </span>
                      )}
                    </div>

                    <p className="mt-2 truncate text-xs font-medium text-white/30">
                      {block.validator}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-5 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-2 sm:justify-end">
                      <Database
                        size={14}
                        className="text-cyan-400"
                      />

                      <p className="text-sm font-black text-white">
                        {block.transactions}
                      </p>
                    </div>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                      Transactions
                    </p>
                  </div>

                  <div className="h-9 w-px bg-white/[0.07]" />

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Clock3
                        size={14}
                        className="text-yellow-300"
                      />

                      <p className="text-sm font-black text-white">
                        {block.age}
                      </p>
                    </div>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                      Block Age
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs font-medium text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing latest {blocks.length} blocks
          </span>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span>Network synchronized</span>
          </div>
        </div>
      </div>
    </section>
  );
}