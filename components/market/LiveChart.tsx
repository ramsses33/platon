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
  CartesianGrid,
  ReferenceLine,
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

type MarketPriceRow = {
  price: number | string;
  updated_at: string;
};

type ChartPoint = {
  id: number;
  timestamp: number;
  time: string;
  fullTime: string;
  price: number;
};

type TimeRange = "1H" | "6H" | "24H" | "ALL";

const ranges: TimeRange[] = ["1H", "6H", "24H", "ALL"];
const REFRESH_INTERVAL_MS = 15000;

function createChartPoint(
  id: number,
  price: number,
  dateValue: string,
): ChartPoint | null {
  const date = new Date(dateValue);
  const timestamp = date.getTime();

  if (
    !Number.isFinite(price) ||
    !Number.isFinite(timestamp)
  ) {
    return null;
  }

  return {
    id,
    timestamp,
    time: date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    fullTime: date.toLocaleString(),
    price,
  };
}

export default function LiveChart() {
  const [history, setHistory] = useState<ChartPoint[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("24H");
  const [loading, setLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] =
    useState<"CONNECTING" | "LIVE" | "OFFLINE">("CONNECTING");

  const loadPriceHistory = useCallback(async () => {
    const [historyResult, marketPriceResult] = await Promise.all([
      supabase
        .from("price_history")
        .select("id, price, created_at")
        .order("created_at", { ascending: false })
        .limit(500),

      supabase
        .from("market_price")
        .select("price, updated_at")
        .eq("id", 1)
        .single(),
    ]);

    if (historyResult.error) {
      console.error(
        "Failed to load price history:",
        historyResult.error,
      );
      setLoading(false);
      return;
    }

    const formattedHistory = (
      (historyResult.data ?? []) as PricePoint[]
    )
      .map((item) =>
        createChartPoint(
          Number(item.id),
          Number(item.price),
          item.created_at,
        ),
      )
      .filter(
        (item): item is ChartPoint => item !== null,
      )
      .sort(
        (firstPoint, secondPoint) =>
          firstPoint.timestamp - secondPoint.timestamp,
      );

    let synchronizedHistory = formattedHistory;

    if (
      !marketPriceResult.error &&
      marketPriceResult.data
    ) {
      const marketPrice =
        marketPriceResult.data as MarketPriceRow;

      const officialPoint = createChartPoint(
        Number.MAX_SAFE_INTEGER,
        Number(marketPrice.price),
        marketPrice.updated_at,
      );

      if (officialPoint) {
        synchronizedHistory = [
          ...formattedHistory.filter(
            (point) =>
              point.timestamp !== officialPoint.timestamp,
          ),
          officialPoint,
        ].sort(
          (firstPoint, secondPoint) =>
            firstPoint.timestamp - secondPoint.timestamp,
        );
      }
    } else if (marketPriceResult.error) {
      console.error(
        "Failed to load official PLATON price:",
        marketPriceResult.error,
      );
    }

    setHistory(synchronizedHistory);
    setLoading(false);
  }, []);

  useEffect(() => {
    const refreshHistory = () => {
      void loadPriceHistory();
    };

    const initialLoadTimer = window.setTimeout(
      refreshHistory,
      0,
    );

    const channelName =
      `market-live-chart-${window.crypto.randomUUID()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "price_history",
        },
        refreshHistory,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "market_price",
          filter: "id=eq.1",
        },
        refreshHistory,
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setRealtimeStatus("LIVE");
        } else if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        ) {
          setRealtimeStatus("OFFLINE");
        }
      });

    const fallbackInterval = window.setInterval(
      refreshHistory,
      REFRESH_INTERVAL_MS,
    );

    return () => {
      window.clearTimeout(initialLoadTimer);
      window.clearInterval(fallbackInterval);
      void supabase.removeChannel(channel);
    };
  }, [loadPriceHistory]);

  const data = useMemo(() => {
    if (timeRange === "ALL") {
      return history;
    }

    const latestTimestamp =
      history[history.length - 1]?.timestamp ?? 0;

    const duration =
      timeRange === "1H"
        ? 60 * 60 * 1000
        : timeRange === "6H"
          ? 6 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000;

    return history.filter(
      (point) =>
        point.timestamp >= latestTimestamp - duration,
    );
  }, [history, timeRange]);

  const chartStats = useMemo(() => {
    if (data.length === 0) {
      return {
        currentPrice: 0,
        firstPrice: 0,
        highPrice: 0,
        lowPrice: 0,
        change: 0,
        changePercent: 0,
      };
    }

    const prices = data.map((point) => point.price);
    const firstPrice = prices[0];
    const currentPrice = prices[prices.length - 1];
    const highPrice = Math.max(...prices);
    const lowPrice = Math.min(...prices);
    const change = currentPrice - firstPrice;

    const changePercent =
      firstPrice > 0 ? (change / firstPrice) * 100 : 0;

    return {
      currentPrice,
      firstPrice,
      highPrice,
      lowPrice,
      change,
      changePercent,
    };
  }, [data]);

  const positive = chartStats.change >= 0;
  const lineColor = positive ? "#10B981" : "#F87171";
  const gradientId = positive
    ? "positiveMarketGradient"
    : "negativeMarketGradient";

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-black uppercase tracking-[4px] text-gray-500">
                PLATON / USD
              </p>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${
                  realtimeStatus === "LIVE"
                    ? "bg-emerald-400/10 text-emerald-300"
                    : realtimeStatus === "OFFLINE"
                      ? "bg-red-400/10 text-red-300"
                      : "bg-yellow-400/10 text-yellow-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    realtimeStatus === "LIVE"
                      ? "animate-pulse bg-emerald-400"
                      : realtimeStatus === "OFFLINE"
                        ? "bg-red-400"
                        : "animate-pulse bg-yellow-400"
                  }`}
                />

                {realtimeStatus}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-4">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                ${chartStats.currentPrice.toFixed(8)}
              </h2>

              <span
                className={`mb-1 rounded-xl px-3 py-2 text-sm font-black ${
                  positive
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-red-400/10 text-red-300"
                }`}
              >
                {positive ? "+" : ""}
                {chartStats.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ranges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                  timeRange === range
                    ? "bg-white text-black"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ChartStat
            label="Open"
            value={`$${chartStats.firstPrice.toFixed(8)}`}
          />

          <ChartStat
            label="High"
            value={`$${chartStats.highPrice.toFixed(8)}`}
          />

          <ChartStat
            label="Low"
            value={`$${chartStats.lowPrice.toFixed(8)}`}
          />

          <ChartStat
            label="Points"
            value={data.length.toLocaleString()}
          />
        </div>
      </div>

      <div className="h-[440px] p-3 sm:h-[500px] sm:p-6">
        {loading ? (
          <ChartMessage text="Loading market history..." />
        ) : data.length === 0 ? (
          <ChartMessage text="No price history available for this range." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 10,
                bottom: 0,
                left: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="positiveMarketGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#10B981"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="70%"
                    stopColor="#10B981"
                    stopOpacity={0.08}
                  />
                  <stop
                    offset="100%"
                    stopColor="#10B981"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="negativeMarketGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#F87171"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="70%"
                    stopColor="#F87171"
                    stopOpacity={0.08}
                  />
                  <stop
                    offset="100%"
                    stopColor="#F87171"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,0.055)"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{
                  fill: "#6B7280",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                minTickGap={42}
              />

              <YAxis
                domain={["auto", "auto"]}
                orientation="right"
                tick={{
                  fill: "#6B7280",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  `$${Number(value).toFixed(5)}`
                }
                width={82}
              />

              <Tooltip
                cursor={{
                  stroke: "rgba(255,255,255,0.2)",
                  strokeDasharray: "4 4",
                }}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullTime ?? ""
                }
                formatter={(value) => [
                  `$${Number(value).toFixed(8)}`,
                  "PLATON Price",
                ]}
                contentStyle={{
                  background: "rgba(5, 7, 10, 0.96)",
                  border:
                    "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  color: "#ffffff",
                  boxShadow:
                    "0 20px 50px rgba(0,0,0,0.45)",
                }}
                labelStyle={{
                  color: "#9CA3AF",
                  marginBottom: "8px",
                }}
              />

              <ReferenceLine
                y={chartStats.firstPrice}
                stroke="rgba(255,255,255,0.18)"
                strokeDasharray="6 6"
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={3}
                fill={`url(#${gradientId})`}
                activeDot={{
                  r: 5,
                  fill: lineColor,
                  stroke: "#05070A",
                  strokeWidth: 3,
                }}
                animationDuration={450}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Chart updates automatically from PLATON price history.
        </p>

        <p>
          Fallback refresh: 15 seconds
        </p>
      </div>
    </div>
  );
}

type ChartStatProps = {
  label: string;
  value: string;
};

function ChartStat({
  label,
  value,
}: ChartStatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs uppercase tracking-[2px] text-gray-500">
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-black text-white">
        {value}
      </p>
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
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />

        <p className="mt-4 text-sm text-gray-400">
          {text}
        </p>
      </div>
    </div>
  );
}