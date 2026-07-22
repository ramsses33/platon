"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { supabase } from "@/lib/supabase";

type PricePoint = {
  id: number;
  price: number | string;
  created_at: string;
};

type ChartPoint = {
  id: number;
  timestamp: number;
  time: string;
  fullTime: string;
  price: number;
};

type RealtimeStatus =
  | "CONNECTING"
  | "LIVE"
  | "OFFLINE";

const FALLBACK_REFRESH_MS = 15000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function formatPrice(value: number) {
  return `$${value.toFixed(8)}`;
}

export default function MarketMiniChart() {
  const [history, setHistory] = useState<
    ChartPoint[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [realtimeStatus, setRealtimeStatus] =
    useState<RealtimeStatus>("CONNECTING");

  const loadPriceHistory = useCallback(
    async () => {
      const { data, error: priceError } =
        await supabase
          .from("price_history")
          .select("id, price, created_at")
          .order("created_at", {
            ascending: false,
          })
          .limit(160);

      if (priceError) {
        console.error(
          "Home market preview load failed:",
          priceError,
        );

        setError(
          "Unable to load official price history.",
        );

        setLoading(false);
        return;
      }

      const formatted = (
        (data ?? []) as PricePoint[]
      )
        .map((item) => {
          const date = new Date(
            item.created_at,
          );

          return {
            id: Number(item.id),
            timestamp: date.getTime(),
            time: date.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              },
            ),
            fullTime:
              date.toLocaleString(),
            price: Number(item.price),
          };
        })
        .filter(
          (item) =>
            Number.isFinite(
              item.timestamp,
            ) &&
            Number.isFinite(item.price),
        )
        .reverse();

      setHistory(formatted);
      setError("");
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    const initialLoadTimer =
      window.setTimeout(() => {
        void loadPriceHistory();
      }, 0);

    const priceChannel = supabase
      .channel("home-market-mini-chart")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "price_history",
        },
        () => {
          void loadPriceHistory();
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setRealtimeStatus("LIVE");
          return;
        }

        if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        ) {
          setRealtimeStatus("OFFLINE");
        }
      });

    const fallbackInterval =
      window.setInterval(() => {
        void loadPriceHistory();
      }, FALLBACK_REFRESH_MS);

    return () => {
      window.clearTimeout(
        initialLoadTimer,
      );

      window.clearInterval(
        fallbackInterval,
      );

      void supabase.removeChannel(
        priceChannel,
      );
    };
  }, [loadPriceHistory]);

  const chartData = useMemo(() => {
    if (history.length === 0) {
      return [];
    }

    const latestTimestamp =
      history[history.length - 1].timestamp;

    const startTime =
      latestTimestamp - DAY_IN_MS;

    const lastDay = history.filter(
      (point) =>
        point.timestamp >= startTime,
    );

    return lastDay.length > 0
      ? lastDay
      : history;
  }, [history]);

  const chartStats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        currentPrice: 0,
        changePercent: 0,
      };
    }

    const firstPrice =
      chartData[0].price;

    const currentPrice =
      chartData[
        chartData.length - 1
      ].price;

    const changePercent =
      firstPrice > 0
        ? ((currentPrice -
            firstPrice) /
            firstPrice) *
          100
        : 0;

    return {
      currentPrice,
      changePercent,
    };
  }, [chartData]);

  const positive =
    chartStats.changePercent >= 0;

  const lineColor = positive
    ? "#10B981"
    : "#F87171";

  const gradientId = positive
    ? "homePositiveMarketGradient"
    : "homeNegativeMarketGradient";

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-400/[0.07] blur-[90px]" />

      <div className="relative flex flex-col gap-5 border-b border-white/[0.08] p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
              PLATON / USD
            </p>

            <span
              className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${
                realtimeStatus === "LIVE"
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                  : realtimeStatus ===
                      "OFFLINE"
                    ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
                    : "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  realtimeStatus === "LIVE"
                    ? "animate-pulse bg-emerald-400"
                    : realtimeStatus ===
                        "OFFLINE"
                      ? "bg-rose-300"
                      : "animate-pulse bg-yellow-300"
                }`}
              />

              {realtimeStatus}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-end gap-3">
            <h3 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              {loading
                ? "Loading..."
                : formatPrice(
                    chartStats.currentPrice,
                  )}
            </h3>

            {!loading &&
              chartData.length > 0 && (
                <span
                  className={`mb-1 rounded-xl px-2.5 py-1.5 text-xs font-black ${
                    positive
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-rose-400/10 text-rose-300"
                  }`}
                >
                  {positive ? "+" : ""}
                  {chartStats.changePercent.toFixed(
                    2,
                  )}
                  %
                </span>
              )}
          </div>
        </div>

        <div className="w-fit rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
            Range
          </p>

          <p className="mt-1 text-sm font-black text-white">
            24 Hours
          </p>
        </div>
      </div>

      <div className="relative h-[250px] p-3 sm:h-[280px] sm:p-5">
        {loading ? (
          <ChartMessage text="Loading official market history..." />
        ) : error ? (
          <ChartMessage text={error} />
        ) : chartData.length === 0 ? (
          <ChartMessage text="No official price history available." />
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={chartData}
              margin={{
                top: 12,
                right: 6,
                bottom: 0,
                left: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="homePositiveMarketGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#10B981"
                    stopOpacity={0.38}
                  />

                  <stop
                    offset="100%"
                    stopColor="#10B981"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="homeNegativeMarketGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#F87171"
                    stopOpacity={0.38}
                  />

                  <stop
                    offset="100%"
                    stopColor="#F87171"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                minTickGap={50}
                tick={{
                  fill: "#6B7280",
                  fontSize: 10,
                }}
              />

              <YAxis
                domain={["auto", "auto"]}
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={72}
                tickFormatter={(value) =>
                  `$${Number(value).toFixed(
                    5,
                  )}`
                }
                tick={{
                  fill: "#6B7280",
                  fontSize: 10,
                }}
              />

              <Tooltip
                cursor={{
                  stroke:
                    "rgba(255,255,255,0.18)",
                  strokeDasharray: "4 4",
                }}
                labelFormatter={(
                  _,
                  payload,
                ) =>
                  payload?.[0]?.payload
                    ?.fullTime ?? ""
                }
                formatter={(value) => [
                  formatPrice(
                    Number(value),
                  ),
                  "Official Price",
                ]}
                contentStyle={{
                  background:
                    "rgba(5,7,10,0.96)",
                  border:
                    "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "14px",
                  color: "#ffffff",
                }}
                labelStyle={{
                  color: "#9CA3AF",
                  marginBottom: "6px",
                }}
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                activeDot={{
                  r: 4,
                  fill: lineColor,
                  stroke: "#05070A",
                  strokeWidth: 2,
                }}
                animationDuration={400}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="relative flex flex-col gap-2 border-t border-white/[0.07] px-5 py-4 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Official network price history
        </span>

        <span>
          Automatically synchronized
        </span>
      </div>
    </div>
  );
}

type ChartMessageProps = {
  text: string;
};

function ChartMessage({
  text,
}: ChartMessageProps) {
  return (
    <div className="flex h-full items-center justify-center text-center">
      <div>
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />

        <p className="mt-4 text-sm text-white/40">
          {text}
        </p>
      </div>
    </div>
  );
}