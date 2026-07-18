"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Overview = {
  price: number;
  treasuryPlaton: number;
  treasuryUsdt: number;
  openOrders: number;
  trades: number;
  users: number;
};

export default function AdminOverview() {
  const [data, setData] = useState<Overview>({
    price: 0,
    treasuryPlaton: 0,
    treasuryUsdt: 0,
    openOrders: 0,
    trades: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    setLoading(true);

    const [
      { data: priceData },
      { data: treasuryData },
      { count: openOrdersCount },
      { count: tradesCount },
      { count: usersCount },
    ] = await Promise.all([
      supabase
        .from("market_price")
        .select("price")
        .eq("id", 1)
        .single(),

      supabase
        .from("treasury_wallet")
        .select("platon_balance, usdt_balance")
        .eq("id", 1)
        .single(),

      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .in("status", ["OPEN", "PARTIAL"]),

      supabase
        .from("trades")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true }),
    ]);

    setData({
      price: Number(priceData?.price ?? 0),
      treasuryPlaton: Number(treasuryData?.platon_balance ?? 0),
      treasuryUsdt: Number(treasuryData?.usdt_balance ?? 0),
      openOrders: openOrdersCount ?? 0,
      trades: tradesCount ?? 0,
      users: usersCount ?? 0,
    });

    setLoading(false);
  }

  const cards = [
    {
      label: "Network Status",
      value: "● Online",
      className: "text-emerald-400",
    },
    {
      label: "Official Price",
      value: loading ? "Loading..." : `$${data.price.toFixed(8)}`,
      className: "text-yellow-400",
    },
    {
      label: "Treasury PLATON",
      value: loading
        ? "Loading..."
        : `${data.treasuryPlaton.toLocaleString()} π`,
      className: "text-white",
    },
    {
      label: "Treasury USDT",
      value: loading
        ? "Loading..."
        : `$${data.treasuryUsdt.toLocaleString()}`,
      className: "text-emerald-400",
    },
    {
      label: "Open Orders",
      value: loading ? "Loading..." : data.openOrders.toString(),
      className: "text-cyan-400",
    },
    {
      label: "Completed Trades",
      value: loading ? "Loading..." : data.trades.toString(),
      className: "text-violet-400",
    },
    {
      label: "Registered Users",
      value: loading ? "Loading..." : data.users.toString(),
      className: "text-white",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
        >
          <p className="text-sm text-gray-400">{card.label}</p>

          <h2 className={`mt-3 text-3xl font-black ${card.className}`}>
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}