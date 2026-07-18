"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

type TradeExecutionType =
  | "USER_MATCH"
  | "TREASURY_BUY"
  | "TREASURY_SELL";

type TradeSide =
  | "BUY"
  | "SELL"
  | "MATCH";

type TradeRow = {
  id: string;
  buy_order_id: string;
  sell_order_id: string;
  execution_type: TradeExecutionType;
  price: number | string;
  amount: number | string;
  created_at: string;
};

type Trade = {
  id: string;
  buy_order_id: string;
  sell_order_id: string;
  execution_type: TradeExecutionType;
  price: number;
  amount: number;
  created_at: string;
  side: TradeSide;
};

type OrderReference = {
  id: string;
  created_at: string;
};

const MAX_TRADES = 12;

function resolveTradeSide(
  trade: TradeRow,
  orderCreatedAtById: Map<string, string>
): TradeSide {
  if (
    trade.execution_type ===
    "TREASURY_SELL"
  ) {
    return "BUY";
  }

  if (
    trade.execution_type ===
    "TREASURY_BUY"
  ) {
    return "SELL";
  }

  const buyOrderCreatedAt =
    orderCreatedAtById.get(
      trade.buy_order_id
    );

  const sellOrderCreatedAt =
    orderCreatedAtById.get(
      trade.sell_order_id
    );

  if (
    !buyOrderCreatedAt ||
    !sellOrderCreatedAt
  ) {
    return "MATCH";
  }

  const buyOrderTime =
    new Date(
      buyOrderCreatedAt
    ).getTime();

  const sellOrderTime =
    new Date(
      sellOrderCreatedAt
    ).getTime();

  if (
    !Number.isFinite(
      buyOrderTime
    ) ||
    !Number.isFinite(
      sellOrderTime
    )
  ) {
    return "MATCH";
  }

  return buyOrderTime >= sellOrderTime
    ? "BUY"
    : "SELL";
}

export default function RecentTrades() {
  const [
    trades,
    setTrades,
  ] = useState<Trade[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const loadTrades = useCallback(
    async (
      silent = false
    ) => {
      if (
        silent
      ) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const {
        data,
        error: loadError,
      } = await supabase
        .from("trades")
        .select(`
          id,
          buy_order_id,
          sell_order_id,
          execution_type,
          price,
          amount,
          created_at
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(
          MAX_TRADES
        );

      if (
        loadError
      ) {
        console.error(
          "Failed to load recent trades:",
          loadError
        );

        setError(
          "Recent trades are temporarily unavailable."
        );

        if (
          !silent
        ) {
          setTrades([]);
        }

        setLoading(false);
        setRefreshing(false);
        return;
      }

      const tradeRows =
        (
          data ??
          []
        ) as TradeRow[];

      const userMatchOrderIds =
        Array.from(
          new Set(
            tradeRows
              .filter(
                (
                  trade
                ) =>
                  trade.execution_type ===
                  "USER_MATCH"
              )
              .flatMap(
                (
                  trade
                ) => [
                  trade.buy_order_id,
                  trade.sell_order_id,
                ]
              )
          )
        );

      const orderCreatedAtById =
        new Map<
          string,
          string
        >();

      if (
        userMatchOrderIds.length >
        0
      ) {
        const {
          data: orderData,
          error: orderLoadError,
        } = await supabase
          .from("orders")
          .select(`
            id,
            created_at
          `)
          .in(
            "id",
            userMatchOrderIds
          );

        if (
          orderLoadError
        ) {
          console.error(
            "Failed to load trade order references:",
            orderLoadError
          );
        } else {
          const orderReferences =
            (
              orderData ??
              []
            ) as OrderReference[];

          for (
            const order
            of orderReferences
          ) {
            orderCreatedAtById.set(
              order.id,
              order.created_at
            );
          }
        }
      }

      const formattedTrades =
        tradeRows.map(
          (
            trade
          ): Trade => ({
            id: trade.id,
            buy_order_id:
              trade.buy_order_id,
            sell_order_id:
              trade.sell_order_id,
            execution_type:
              trade.execution_type,
            price: Number(
              trade.price
            ),
            amount: Number(
              trade.amount
            ),
            created_at:
              trade.created_at,
            side:
              resolveTradeSide(
                trade,
                orderCreatedAtById
              ),
          })
        );

      setTrades(
        formattedTrades
      );

      setError("");
      setLoading(false);
      setRefreshing(false);
    },
    []
  );

  useEffect(
    () => {
      loadTrades();

      const channel =
        supabase
          .channel(
            "market-recent-trades"
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "trades",
            },
            () => {
              loadTrades(true);
            }
          )
          .subscribe();

      const refreshInterval =
        window.setInterval(
          () => {
            loadTrades(true);
          },
          15000
        );

      return () => {
        window.clearInterval(
          refreshInterval
        );

        supabase.removeChannel(
          channel
        );
      };
    },
    [
      loadTrades,
    ]
  );

  const totalVolume =
    useMemo(
      () => {
        return trades.reduce(
          (
            total,
            trade
          ) => {
            return (
              total +
              trade.amount
            );
          },
          0
        );
      },
      [
        trades,
      ]
    );

  function getSideStyles(
    side: TradeSide
  ) {
    switch (
      side
    ) {
      case "BUY":
        return {
          text:
            "text-emerald-400",
          badge:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
          dot:
            "bg-emerald-400",
        };

      case "SELL":
        return {
          text:
            "text-rose-400",
          badge:
            "border-rose-400/20 bg-rose-400/10 text-rose-400",
          dot:
            "bg-rose-400",
        };

      default:
        return {
          text:
            "text-violet-400",
          badge:
            "border-violet-400/20 bg-violet-400/10 text-violet-400",
          dot:
            "bg-violet-400",
        };
    }
  }

  function formatPrice(
    value: number
  ) {
    return value.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      }
    );
  }

  function formatAmount(
    value: number
  ) {
    return value.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function formatTotal(
    value: number
  ) {
    return value.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }
    );
  }

  function formatTime(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }
    );
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl">
      <div className="border-b border-white/10 px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-black text-white">
                Recent Trades
              </h2>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400">
                  LIVE
                </span>
              </div>
            </div>

            <p className="mt-2 text-sm text-white/40">
              Latest executed PLATON market orders
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadTrades(
                true
              )
            }
            disabled={
              refreshing
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-lg text-white/60 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Refresh recent trades"
          >
            <span
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            >
              ↻
            </span>
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Trades
            </p>

            <p className="mt-1 text-lg font-black text-white">
              {
                trades.length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Volume
            </p>

            <p className="mt-1 truncate text-lg font-black text-white">
              {
                formatAmount(
                  totalVolume
                )
              }{" "}
              π
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-7">
        {loading ? (
          <div className="space-y-3">
            {Array.from({
              length: 7,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="grid animate-pulse grid-cols-[72px_1fr_1fr_68px] items-center gap-3 rounded-xl px-2 py-3"
                >
                  <div className="h-6 rounded-lg bg-white/[0.07]" />
                  <div className="h-4 rounded bg-white/[0.07]" />
                  <div className="h-4 rounded bg-white/[0.07]" />
                  <div className="h-4 rounded bg-white/[0.07]" />
                </div>
              )
            )}
          </div>
        ) : error &&
          trades.length ===
            0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-2xl">
              !
            </div>

            <p className="mt-4 font-bold text-white">
              Unable to load trades
            </p>

            <p className="mt-2 max-w-xs text-sm leading-6 text-white/40">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                loadTrades()
              }
              className="mt-5 rounded-xl border border-white/10 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Try again
            </button>
          </div>
        ) : trades.length ===
          0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl text-white/30">
              π
            </div>

            <p className="mt-4 font-bold text-white">
              No trades yet
            </p>

            <p className="mt-2 text-sm text-white/40">
              Completed market trades will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[72px_1fr_1fr_68px] gap-3 border-b border-white/[0.07] px-2 pb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
              <span>
                Side
              </span>

              <span>
                Price
              </span>

              <span className="text-right">
                Amount
              </span>

              <span className="text-right">
                Time
              </span>
            </div>

            <div className="divide-y divide-white/[0.05]">
              {trades.map(
                (
                  trade
                ) => {
                  const styles =
                    getSideStyles(
                      trade.side
                    );

                  const total =
                    trade.price *
                    trade.amount;

                  return (
                    <div
                      key={
                        trade.id
                      }
                      className="group grid grid-cols-[72px_1fr_1fr_68px] items-center gap-3 rounded-xl px-2 py-4 transition hover:bg-white/[0.035]"
                    >
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-black ${styles.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                          />

                          {
                            trade.side
                          }
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-black tabular-nums ${styles.text}`}
                        >
                          $
                          {
                            formatPrice(
                              trade.price
                            )
                          }
                        </p>

                        <p className="mt-1 truncate text-[10px] font-medium text-white/25">
                          $
                          {
                            formatTotal(
                              total
                            )
                          }
                        </p>
                      </div>

                      <div className="min-w-0 text-right">
                        <p className="truncate text-sm font-bold tabular-nums text-white">
                          {
                            formatAmount(
                              trade.amount
                            )
                          }
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-white/25">
                          π
                        </p>
                      </div>

                      <p className="text-right text-xs font-semibold tabular-nums text-white/35">
                        {
                          formatTime(
                            trade.created_at
                          )
                        }
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}