"use client";

import {
  Blocks,
  Clock3,
  Database,
  Layers3,
  RefreshCw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

type NetworkBlock = {
  block_number: number;
  block_hash: string;
  previous_hash: string;
  validator: string;
  transaction_count: number;
  confirmed_at: string;
};

type ExplorerBlocksResponse = {
  success: boolean;
  blocks?: NetworkBlock[];
  error?: string;
};

const REFRESH_INTERVAL_MS = 5000;

function shortenHash(value: string) {
  if (value.length <= 24) {
    return value;
  }

  return `${value.slice(0, 12)}...${value.slice(-10)}`;
}

function formatAge(
  confirmedAt: string,
  now: number,
) {
  const confirmedTime =
    new Date(confirmedAt).getTime();

  if (!Number.isFinite(confirmedTime)) {
    return "Unknown";
  }

  const seconds = Math.max(
    0,
    Math.floor(
      (now - confirmedTime) / 1000,
    ),
  );

  if (seconds < 60) {
    return `${seconds} sec`;
  }

  const minutes = Math.floor(
    seconds / 60,
  );

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours} hr`;
  }

  const days = Math.floor(
    hours / 24,
  );

  return `${days} day${days === 1 ? "" : "s"}`;
}

export default function LatestBlocks() {
  const [blocks, setBlocks] =
    useState<NetworkBlock[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [now, setNow] = useState(
    Date.now(),
  );

  const loadBlocks = useCallback(
    async (silent = false) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetch(
          "/api/explorer/blocks",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result =
          (await response.json()) as
            ExplorerBlocksResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ??
              "Unable to load network blocks.",
          );
        }

        setBlocks(result.blocks ?? []);
        setError("");
      } catch (loadError) {
        console.error(
          "Explorer blocks load failed:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load network blocks.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadBlocks();

    const refreshTimer =
      window.setInterval(() => {
        void loadBlocks(true);
      }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(
        refreshTimer,
      );
    };
  }, [loadBlocks]);

  useEffect(() => {
    const ageTimer =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1000);

    return () => {
      window.clearInterval(ageTimer);
    };
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl">
        <div className="animate-pulse">
          <div className="h- );

  useEffect(() => {
    void loadBlocks();

    const refreshTimer =
      window.setInterval(() => {
        void loadBlocks(true);
      }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(
        refreshTimer,
      );
    };
  }, [loadBlocks]);

  useEffect(() => {
    const ageTimer =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1000);

    return () => {
      window.clearInterval(ageTimer);
    };
  }, []);

  if (4 w-40 rounded-full bg-white/[0.07]" />

          <div className="mt-4 h-8 w-56 rounded-xl bg-white/[0.07]" />

          <div className="mt-8 space-y-3">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-[22px] bg-white/[0.055]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

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
            Recently confirmed blocks on the
            PLATON Network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              void loadBlocks(true);
            }}
            disabled={refreshing}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/45 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Refresh explorer blocks"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
          </button>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
            <Blocks
              size={22}
              strokeWidth={2.2}
            />
          </div>
        </div>
      </div>

      <div className="relative p-4 sm:p-6">
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-400/15 bg-rose-400/[0.06] px-4 py-3">
            <p className="text-sm text-rose-300">
              {error}
            </p>
          </div>
        )}

        {blocks.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/30">
              <Blocks size={28} />
            </div>

            <h3 className="mt-5 text-lg font-black text-white">
              No blocks yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
              Confirmed PLATON blocks will
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {blocks.map(
              (block, index) => (
                <article
                  key={block.block_number}
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
                            #
                            {
                              block.block_number
                            }
                          </h3>

                          {index === 0 && (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-400">
                              Latest
                            </span>
                          )}
                        </div>

                        <p className="mt-2 truncate text-xs font-medium text-white/35">
                          {
                            block.validator
                          }
                        </p>

                        <p className="mt-1 truncate font-mono text-[10px] text-white/20">
                          {shortenHash(
                            block.block_hash,
                          )}
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
                            {
                              block.transaction_count
                            }{" "}
                            tx
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
                            {formatAge(
                              block.confirmed_at,
                              now,
                            )}
                          </p>
                        </div>

                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                          Block Age
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs font-medium text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing latest {blocks.length} blocks
          </span>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span>
              Automatically synchronized
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
