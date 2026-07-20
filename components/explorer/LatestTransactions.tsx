"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Coins,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

type Transaction = {
  id: string;
  sender_wallet: string | null;
  receiver_wallet: string;
  amount: number | string;
  type: string;
  status: string;
  created_at: string;
};

type ExplorerTransactionsResponse = {
  success: boolean;
  transactions?: Transaction[];
  error?: string;
};

const REFRESH_INTERVAL_MS = 5000;

function shortenValue(
  value: string | null,
  startLength = 13,
  endLength = 8,
) {
  if (!value) {
    return "PLATON Network";
  }

  if (
    value.length <=
    startLength + endLength + 3
  ) {
    return value;
  }

  return `${value.slice(
    0,
    startLength,
  )}...${value.slice(-endLength)}`;
}

function formatAmount(
  value: number | string,
) {
  return Number(value).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    },
  );
}

function formatAge(
  createdAt: string,
  now: number,
) {
  const createdTime =
    new Date(createdAt).getTime();

  if (!Number.isFinite(createdTime)) {
    return "Unknown";
  }

  const seconds = Math.max(
    0,
    Math.floor(
      (now - createdTime) / 1000,
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

export default function LatestTransactions() {
  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [now, setNow] = useState(
    Date.now(),
  );

  const loadTransactions = useCallback(
    async (silent = false) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetch(
          "/api/explorer/transactions",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result =
          (await response.json()) as
            ExplorerTransactionsResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ??
              "Unable to load network transactions.",
          );
        }

        setTransactions(
          result.transactions ?? [],
        );

        setError("");
      } catch (loadError) {
        console.error(
          "Explorer transactions load failed:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load network transactions.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadTransactions();

    const refreshTimer =
      window.setInterval(() => {
        void loadTransactions(true);
      }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(
        refreshTimer,
      );
    };
  }, [loadTransactions]);

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
          <div className="h-4 w-40 rounded-full bg-white/[0.07]" />

          <div className="mt-4 h-8 w-64 rounded-xl bg-white/[0.07]" />

          <div className="mt-8 space-y-3">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="h-40 rounded-[22px] bg-white/[0.055]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

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
            Recently confirmed transfers across
            the PLATON Network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              void loadTransactions(true);
            }}
            disabled={refreshing}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/45 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Refresh explorer transactions"
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

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
            <ReceiptText
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

        {transactions.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/30">
              <ReceiptText size={28} />
            </div>

            <h3 className="mt-5 text-lg font-black text-white">
              No transactions yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
              Confirmed PLATON transfers will
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map(
              (transaction, index) => {
                const completed =
                  transaction.status
                    .toUpperCase() ===
                  "COMPLETED";

                return (
                  <article
                    key={transaction.id}
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
                                {shortenValue(
                                  transaction.id,
                                  8,
                                  8,
                                )}
                              </p>

                              {index === 0 && (
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-400">
                                  Latest
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <CheckCircle2
                                size={13}
                                className={
                                  completed
                                    ? "text-emerald-400"
                                    : "text-yellow-300"
                                }
                              />

                              <span className="text-xs font-semibold text-white/30">
                                {
                                  transaction.status
                                }
                              </span>

                              <span className="text-white/15">
                                •
                              </span>

                              <span className="text-xs font-semibold uppercase text-white/25">
                                {
                                  transaction.type
                                }
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
                              {formatAmount(
                                transaction.amount,
                              )}{" "}
                              π
                            </p>
                          </div>

                          <div className="mt-2 flex items-center gap-2 text-xs text-white/30 sm:justify-end">
                            <Clock3 size={13} />

                            <span>
                              {formatAge(
                                transaction.created_at,
                                now,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/25">
                            From
                          </p>

                          <p className="mt-1 truncate font-mono text-xs text-white/45">
                            {shortenValue(
                              transaction.sender_wallet,
                            )}
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
                            {shortenValue(
                              transaction.receiver_wallet,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs font-medium text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing latest{" "}
            {transactions.length} transactions
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
