"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

type Stats = {
  volume: number;
  trades: number;
  users: number;
  avgPrice: number;
  buyVolume: number;
  sellVolume: number;
};

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats>({
    volume: 0,
    trades: 0,
    users: 0,
    avgPrice: 0,
    buyVolume: 0,
    sellVolume: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);

    const [
      { data: trades, error: tradesError },
      { count: usersCount },
    ] = await Promise.all([
      supabase
        .from("trades")
        .select("price, amount, buyer_source"),

      supabase
        .from("wallets")
        .select("*", {
          count: "exact",
          head: true,
        }),
    ]);

    if (tradesError) {
      toast.error("Failed to load analytics.");
      setLoading(false);
      return;
    }

    let volume = 0;
    let avgPrice = 0;
    let buyVolume = 0;
    let sellVolume = 0;

    if (trades && trades.length) {
      trades.forEach((trade) => {
        const value =
          Number(trade.price) *
          Number(trade.amount);

        volume += value;
        avgPrice += Number(trade.price);

        if (trade.buyer_source === "USER") {
          buyVolume += value;
        } else {
          sellVolume += value;
        }
      });

      avgPrice /= trades.length;
    }

    setStats({
      volume,
      trades: trades?.length ?? 0,
      users: usersCount ?? 0,
      avgPrice,
      buyVolume,
      sellVolume,
    });

    setLoading(false);
  }

  const cards = [
    {
      title: "Total Volume",
      value: `$${stats.volume.toFixed(2)}`,
      color: "text-yellow-400",
    },
    {
      title: "Trades",
      value: stats.trades.toString(),
      color: "text-cyan-400",
    },
    {
      title: "Users",
      value: stats.users.toString(),
      color: "text-white",
    },
    {
      title: "Average Price",
      value: `$${stats.avgPrice.toFixed(8)}`,
      color: "text-emerald-400",
    },
    {
      title: "BUY Volume",
      value: `$${stats.buyVolume.toFixed(2)}`,
      color: "text-green-400",
    },
    {
      title: "SELL Volume",
      value: `$${stats.sellVolume.toFixed(2)}`,
      color: "text-red-400",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
        >
          <p className="text-sm text-gray-400">
            {card.title}
          </p>

          <h2
            className={`mt-3 text-3xl font-black ${card.color}`}
          >
            {loading ? "..." : card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}