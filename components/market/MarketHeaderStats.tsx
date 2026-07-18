"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MarketStatsRow = {
  current_price: number;
  price_change_24h: number;
  high_24h: number;
  low_24h: number;
  volume_24h: number;
  market_cap: number;
  treasury_platon: number;
  treasury_usdt: number;
  updated_at: string;
};

export default function MarketHeaderStats() {
  const [stats, setStats] = useState<MarketStatsRow | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    const { data, error } = await supabase
      .from("market_stats")
      .select(`
        current_price,
        price_change_24h,
        high_24h,
        low_24h,
        volume_24h,
        market_cap,
        treasury_platon,
        treasury_usdt,
        updated_at
      `)
      .eq("id", 1)
      .single();

    if (!error && data) {
      setStats({
        current_price: Number(data.current_price),
        price_change_24h: Number(data.price_change_24h),
        high_24h: Number(data.high_24h),
        low_24h: Number(data.low_24h),
        volume_24h: Number(data.volume_24h),
        market_cap: Number(data.market_cap),
        treasury_platon: Number(data.treasury_platon),
        treasury_usdt: Number(data.treasury_usdt),
        updated_at: data.updated_at,
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadStats();

    const channel = supabase
      .channel("market-header-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "market_stats",
        },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadStats]);

  const change = stats?.price_change_24h ?? 0;
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
                : `$${stats?.current_price.toFixed(8) ?? "0.00000000"}`}
            </p>

            {!loading && (
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
              Updated {new Date(stats.updated_at).toLocaleString()}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="24H High"
            value={`$${stats?.high_24h.toFixed(8) ?? "0.00000000"}`}
          />

          <Stat
            label="24H Low"
            value={`$${stats?.low_24h.toFixed(8) ?? "0.00000000"}`}
          />

          <Stat
            label="24H Volume"
            value={`$${(stats?.volume_24h ?? 0).toLocaleString()}`}
          />

          <Stat
            label="Market Cap"
            value={`$${(stats?.market_cap ?? 0).toLocaleString()}`}
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

function Stat({ label, value }: StatProps) {
  return (
    <div className="min-w-[150px] rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
      <p className="text-xs uppercase tracking-[2px] text-gray-500">
        {label}
      </p>

      <p className="mt-2 font-black text-white">{value}</p>
    </div>
  );
}