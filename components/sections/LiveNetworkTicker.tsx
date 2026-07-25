"use client";

import {
  Activity,
  Blocks,
  Database,
  ShieldCheck,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

type NetworkStatsData = {
  totalBlocks: number;
  totalTransactions: number;
  latestBlockNumber: number | null;
  networkStatus: string;
};

type NetworkStatsResponse = {
  success: boolean;
  stats?: NetworkStatsData;
  error?: string;
};

const REFRESH_INTERVAL_MS = 5000;

function formatNetworkNumber(
  value: number | undefined,
) {
  if (value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-US",
  ).format(value);
}

export default function LiveNetworkTicker() {
  const [networkStats, setNetworkStats] =
    useState<NetworkStatsData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadNetworkStats = useCallback(
    async () => {
      try {
        const response = await fetch(
          "/api/explorer/stats",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result =
          (await response.json()) as
            NetworkStatsResponse;

        if (
          !response.ok ||
          !result.success ||
          !result.stats
        ) {
          throw new Error(
            result.error ??
              "Unable to load network status.",
          );
        }

        setNetworkStats(result.stats);
        setError("");
      } catch (loadError) {
        console.error(
          "Home network activity load failed:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load network status.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const initialLoadTimer =
      window.setTimeout(() => {
        void loadNetworkStats();
      }, 0);

    const refreshTimer =
      window.setInterval(() => {
        void loadNetworkStats();
      }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearTimeout(
        initialLoadTimer,
      );

      window.clearInterval(
        refreshTimer,
      );
    };
  }, [loadNetworkStats]);

  const networkOnline =
    networkStats?.networkStatus ===
      "online" && !error;

  const latestBlock =
    networkStats?.latestBlockNumber !==
      null &&
    networkStats?.latestBlockNumber !==
      undefined
      ? `#${formatNetworkNumber(
          networkStats.latestBlockNumber,
        )}`
      : "None";

  const totalBlocks =
    formatNetworkNumber(
      networkStats?.totalBlocks,
    );

  const totalTransactions =
    formatNetworkNumber(
      networkStats?.totalTransactions,
    );

  return (
    <section className="relative mt-12 overflow-hidden border-y border-white/[0.07] bg-[#070A0E] sm:mt-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-52 w-[70%] -translate-x-1/2 bg-emerald-400/[0.045] blur-[110px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
              Live Network
            </p>

            <h2 className="mt-2 text-xl font-black tracking-[-0.025em] text-white sm:text-2xl">
              PLATON Network Activity
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
              Live operational data from
              the official PLATON
              network.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="relative flex h-2 w-2">
              {networkOnline && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              )}

              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  networkOnline
                    ? "bg-emerald-400"
                    : "bg-white/30"
                }`}
              />
            </span>

            <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white/45">
              Live Data
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-5 backdrop-blur-xl">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                networkOnline
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                  : "border-white/10 bg-white/[0.05] text-white/30"
              }`}
            >
              <ShieldCheck
                size={19}
                strokeWidth={2.2}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
                Network Status
              </p>

              <p
                className={`mt-1 text-lg font-black ${
                  networkOnline
                    ? "text-emerald-400"
                    : "text-white/45"
                }`}
              >
                {loading
                  ? "Checking"
                  : networkOnline
                    ? "Online"
                    : "Unavailable"}
              </p>
            </div>
          </article>

          <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-5 backdrop-blur-xl">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
              <Blocks
                size={19}
                strokeWidth={2.2}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
                Latest Block
              </p>

              <p className="mt-1 truncate text-lg font-black text-violet-400">
                {loading
                  ? "Loading"
                  : latestBlock}
              </p>
            </div>
          </article>

          <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-5 backdrop-blur-xl">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
              <Database
                size={19}
                strokeWidth={2.2}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
                Total Blocks
              </p>

              <p className="mt-1 truncate text-lg font-black text-cyan-400">
                {loading
                  ? "Loading"
                  : totalBlocks}
              </p>
            </div>
          </article>

          <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-5 backdrop-blur-xl">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
              <Activity
                size={19}
                strokeWidth={2.2}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
                Total Transactions
              </p>

              <p className="mt-1 truncate text-lg font-black text-yellow-300">
                {loading
                  ? "Loading"
                  : totalTransactions}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}