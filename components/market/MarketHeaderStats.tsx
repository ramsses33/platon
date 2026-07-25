"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type MarketPriceRow = {
  price: number | string;
  updated_at: string;
};

type PriceHistoryRow = {
  price: number | string;
  created_at: string;
};

type MarketStatsRow = {
  volume_24h: number | string | null;
  market_cap: number | string | null;
};

type HeaderStats = {
  currentPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  updatedAt: string;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const REFRESH_INTERVAL_MS = 15000;

export default function MarketHeaderStats() {
  const [stats, setStats] =
    useState<HeaderStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const loadStats = useCallback(async () => {
    const since = new Date(
      Date.now() - DAY_IN_MS,
    ).toISOString();

    const [
      priceResult,
      historyResult,
      marketStatsResult,
    ] = await Promise.all([
      supabase
        .from("market_price")
        .select("price, updated_at")
        .eq("id", 1)
        .single(),

      supabase
        .from("price_history")
        .select("price, created_at")
        .gte("created_at", since)
        .order("created_at", {
          ascending: true,
        }),

      supabase
        .from("market_stats")
        .select("volume_24h, market_cap")
        .eq("id", 1)
        .single(),
    ]);

    if (
      priceResult.error ||
      !priceResult.data
    ) {
      console.error(
        "Unable to load official PLATON price:",
        priceResult.error,
      );

      setLoading(false);
      return;
    }

    if (historyResult.error) {
      console.error(
        "Unable to load 24H price history:",
        historyResult.error,
      );
    }

    if (marketStatsResult.error) {
      console.error(
        "Unable to load market statistics:",
        marketStatsResult.error,
      );
    }

    const marketPrice =
      priceResult.data as MarketPriceRow;

    const currentPrice = Number(
      marketPrice.price,
    );

    if (!Number.isFinite(currentPrice)) {
      console.error(
        "Official PLATON price is invalid.",
      );

      setLoading(false);
      return;
    }

    const historyPrices = (
      (historyResult.data ??
        []) as PriceHistoryRow[]
    )
      .map((row) => Number(row.price))
      .filter((price) =>
        Number.isFinite(price),
      );

    const firstPrice =
      historyPrices[0] ?? currentPrice;

    const allPrices = [
      ...historyPrices,
      currentPrice,
    ];

    const high24h =
      allPrices.length > 0
        ? Math.max(...allPrices)
        : currentPrice;

    const low24h =
      allPrices.length > 0
        ? Math.min(...allPrices)
        : currentPrice;

    const change24h =
      firstPrice > 0
        ? ((currentPrice - firstPrice) /
            firstPrice) *
          100
        : 0;

    const marketStats =
      marketStatsResult.data as
        | MarketStatsRow
        | null;

    const volume24h = Number(
      marketStats?.volume_24h ?? 0,
    );

    const marketCap = Number(
      marketStats?.market_cap ?? 0,
    );

    setStats({
      currentPrice,
      change24h,
      high24h,
      low24h,
      volume24h: Number.isFinite(
        volume24h,
      )
        ? volume24h
        : 0,
      marketCap: Number.isFinite(
        marketCap,
      )
        ? marketCap
        : 0,
      updatedAt: marketPrice.updated_at,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    function refreshStats() {
      if (active) {
        void loadStats();
      }
    }

    const initialTimer =
      window.setTimeout(
        refreshStats,
        0,
      );

    const fallbackInterval =
      window.setInterval(
        refreshStats,
        REFRESH_INTERVAL_MS,
      );

    const channelName =
      `market-header-stats-${window.crypto.randomUUID()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "market_price",
          filter: "id=eq.1",
        },
        refreshStats,
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "price_history",
        },
        refreshStats,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "market_stats",
          filter: "id=eq.1",
        },
        refreshStats,
      )
      .subscribe();

    return () => {
      active = false;

      window.clearTimeout(
        initialTimer,
      );

      window.clearInterval(
        fallbackInterval,
      );

      void supabase.removeChannel(
        channel,
      );
    };
  }, [loadStats]);

  const change =
    stats?.change24h ?? 0;

  const positive = change >= 0;

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-black sm:text-4xl">
              PLATON / USD
            </h2>

            <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-300">
              ● LIVE
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-4">
            <p className="text-4xl font-black text-yellow-400 sm:text-5xl">
              {loading
                ? "Loading..."
                : `$${(
                    stats?.currentPrice ??
                    0
                  ).toFixed(8)}`}
            </p>

            {!loading && stats && (
              <span
                className={`mb-1 rounded-xl px-3 py-2 text-sm font-black ${
                  positive
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-red-400/10 text-red-300"
                }`}
              >
                {positive ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            )}
          </div>

          {stats && (
            <p className="mt-3 text-sm text-gray-500">
              Updated{" "}
              {new Date(
                stats.updatedAt,
              ).toLocaleString()}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="24H High"
            value={
              stats
                ? `$${stats.high24h.toFixed(8)}`
                : "—"
            }
          />

          <Stat
            label="24H Low"
            value={
              stats
                ? `$${stats.low24h.toFixed(8)}`
                : "—"
            }
          />

          <Stat
            label="24H Volume"
            value={formatLargeUsd(
              stats?.volume24h ?? 0,
            )}
          />

          <Stat
            label="Market Cap"
            value={formatLargeUsd(
              stats?.marketCap ?? 0,
            )}
          />
        </div>
      </div>
    </div>
  );
}

type StatProps = {
  label: string;
  value: string;
};

function Stat({
  label,
  value,
}: StatProps) {
  return (
    <div className="min-w-[150px] rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
      <p className="text-xs uppercase tracking-[2px] text-gray-500">
        {label}
      </p>

      <p className="mt-2 font-black text-white">
        {value}
      </p>
    </div>
  );
}

function formatLargeUsd(
  value: number,
) {
  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    },
  ).format(value);
}