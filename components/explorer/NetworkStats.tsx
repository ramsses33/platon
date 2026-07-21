"use client";

import {
  Activity,
  Blocks,
  Hash,
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
  latestBlockConfirmedAt: string | null;
  networkStatus: string;
};

type NetworkStatsResponse = {
  success: boolean;
  stats?: NetworkStatsData;
  error?: string;
};

const REFRESH_INTERVAL_MS = 5000;

function formatNumber(value: number) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value);
}

function formatAge(
  confirmedAt: string | null,
  now: number,
) {
  if (!confirmedAt) {
    return "No confirmed blocks";
  }

  const confirmedTime =
    new Date(confirmedAt).getTime();

  if (!Number.isFinite(confirmedTime)) {
    return "Confirmation time unavailable";
  }

  const seconds = Math.max(
    0,
    Math.floor(
      (now - confirmedTime) / 1000,
    ),
  );

  if (seconds < 60) {
    return `Confirmed ${seconds} sec ago`;
  }

  const minutes = Math.floor(
    seconds / 60,
  );

  if (minutes < 60) {
    return `Confirmed ${minutes} min ago`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `Confirmed ${hours} hr ago`;
  }

  const days = Math.floor(
    hours / 24,
  );

  return `Confirmed ${days} day${
    days === 1 ? "" : "s"
  } ago`;
}

export default function NetworkStats() {
  const [networkStats, setNetworkStats] =
    useState<NetworkStatsData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [now, setNow] = useState(
    Date.now(),
  );

  const loadStats = useCallback(
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
              "Unable to load network statistics.",
          );
        }

        setNetworkStats(result.stats);
        setError("");
      } catch (loadError) {
        console.error(
          "Explorer stats load failed:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load network statistics.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadStats();

    const refreshTimer =
      window.setInterval(() => {
        void loadStats();
      }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(
        refreshTimer,
      );
    };
  }, [loadStats]);

  useEffect(() => {
    const ageTimer =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1000);

    return () => {
      window.clearInterval(ageTimer);
    };
  }, []);

  const online =
    networkStats?.networkStatus ===
      "online" && !error;

  const stats = [
    {
      title: "Total Blocks",
      value: loading
        ? "—"
        : formatNumber(
            networkStats?.totalBlocks ??
              0,
          ),
      description:
        "Confirmed PLATON ledger blocks",
      badge: "Verified",
      icon: Blocks,
      iconStyle:
        "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
      valueStyle: "text-cyan-400",
      badgeStyle:
        "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
      glow: "bg-cyan-400/10",
      active: false,
    },
    {
      title: "Total Transactions",
      value: loading
        ? "—"
        : formatNumber(
            networkStats?.totalTransactions ??
              0,
          ),
      description:
        "Recorded network transactions",
      badge: "Live Data",
      icon: Activity,
      iconStyle:
        "border-violet-400/20 bg-violet-400/10 text-violet-400",
      valueStyle: "text-violet-400",
      badgeStyle:
        "border-violet-400/20 bg-violet-400/10 text-violet-400",
      glow: "bg-violet-400/10",
      active: false,
    },
    {
      title: "Latest Block",
      value: loading
        ? "—"
        : networkStats
              ?.latestBlockNumber !==
            null &&
          networkStats
            ?.latestBlockNumber !==
            undefined
          ? `#${networkStats.latestBlockNumber}`
          : "None",
      description: loading
        ? "Loading confirmation data"
        : formatAge(
            networkStats?.latestBlockConfirmedAt ??
              null,
            now,
          ),
      badge: "Confirmed",
      icon: Hash,
      iconStyle:
        "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
      valueStyle: "text-yellow-300",
      badgeStyle:
        "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
      glow: "bg-yellow-400/10",
      active: false,
    },
    {
      title: "Network Status",
      value: loading
        ? "Checking"
        : online
          ? "Online"
          : "Unavailable",
      description: loading
        ? "Checking network services"
        : online
          ? "Explorer services operational"
          : "Unable to verify network status",
      badge: loading
        ? "Checking"
        : online
          ? "Live"
          : "Check Failed",
      icon: ShieldCheck,
      iconStyle: online
        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
        : "border-rose-400/20 bg-rose-400/10 text-rose-300",
      valueStyle: online
        ? "text-emerald-400"
        : "text-rose-300",
      badgeStyle: online
        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
        : "border-rose-400/20 bg-rose-400/10 text-rose-300",
      glow: online
        ? "bg-emerald-400/10"
        : "bg-rose-400/10",
      active: online,
    },
  ];

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400">
            Network Metrics
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
            PLATON Network Status
          </h2>
        </div>

        <div
          className={`flex w-fit items-center gap-2 rounded-full border px-3 py-2 ${
            online
              ? "border-emerald-400/20 bg-emerald-400/10"
              : "border-white/10 bg-white/[0.05]"
          }`}
        >
          <span className="relative flex h-2 w-2">
            {online && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            )}

            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                online
                  ? "bg-emerald-400"
                  : "bg-white/30"
              }`}
            />
          </span>

          <span
            className={`text-[10px] font-black uppercase tracking-[0.16em] ${
              online
                ? "text-emerald-400"
                : "text-white/40"
            }`}
          >
            {loading
              ? "Checking Network"
              : online
                ? "Network Live"
                : "Status Unavailable"}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-400/15 bg-rose-400/[0.06] px-4 py-3">
          <p className="text-sm text-rose-300">
            {error}
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.065]"
            >
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-[70px] transition duration-300 group-hover:scale-125 ${stat.glow}`}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.iconStyle}`}
                  >
                    <Icon
                      size={21}
                      strokeWidth={2.2}
                    />
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${stat.badgeStyle}`}
                  >
                    {stat.badge}
                  </span>
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.17em] text-white/30">
                  {stat.title}
                </p>

                <h3
                  className={`mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl ${stat.valueStyle}`}
                >
                  {stat.value}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-white/35">
                  {stat.description}
                </p>

                <div className="mt-6 h-px bg-gradient-to-r from-white/10 via-white/[0.05] to-transparent" />

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-white/25">
                    PLATON Network
                  </span>

                  <span
                    className={`h-2 w-2 rounded-full ${
                      stat.active
                        ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]"
                        : "bg-white/25"
                    }`}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
