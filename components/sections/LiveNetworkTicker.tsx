"use client";

import {
  Activity,
  Blocks,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Countdown from "@/components/market/Countdown";
import PriceTicker from "@/components/market/PriceTicker";

type NetworkStatsData = {
  totalBlocks: number;
  totalTransactions: number;
  latestBlockNumber: number | null;
  latestBlockConfirmedAt: string | null;
  networkStatus: string;
};

type NetworkStatsResponse = {
  success: boolean;
  stats?: NetworkStatsData;
  error?: string;
};

const REFRESH_INTERVAL_MS = 5000;

export default function LiveNetworkTicker() {
  const [networkStats, setNetworkStats] =
    useState<NetworkStatsData | null>(null);

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
          "Home network ticker load failed:",
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
      window.clearTimeout(initialLoadTimer);
      window.clearInterval(refreshTimer);
    };
  }, [loadNetworkStats]);

  const networkOnline =
    networkStats?.networkStatus === "online" &&
    !error;

  const latestBlock =
    networkStats?.latestBlockNumber !== null &&
    networkStats?.latestBlockNumber !==
      undefined
      ? `#${networkStats.latestBlockNumber}`
      : "None";

  return (
    <section className="relative overflow-hidden border-y border-white/[0.07] bg-[#070A0E]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[70%] -translate-x-1/2 bg-emerald-400/[0.05] blur-[100px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
              Live Network
            </p>

            <h2 className="mt-1 text-lg font-black tracking-[-0.02em] text-white sm:text-xl">
              Official PLATON Network Ticker
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
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
          <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-4 backdrop-blur-xl">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
              <Activity
                size={19}
                strokeWidth={2.2}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
                Official Price
              </p>

              <div className="mt-1 min-w-0">
                <PriceTicker />
              </div>
            </div>
          </article>

          <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-4 backdrop-blur-xl">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
              <Clock3
                size={19}
                strokeWidth={2.2}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
                Next Price Update
              </p>

              <div className="mt-1">
                <Countdown />
              </div>
            </div>
          </article>

          <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-4 backdrop-blur-xl">
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

          <article className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-4 backdrop-blur-xl">
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
                {loading ? "Loading" : latestBlock}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}