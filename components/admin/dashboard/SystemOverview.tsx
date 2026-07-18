"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DashboardStats = {
  price: number;
  treasuryPlaton: number;
  treasuryUsdt: number;
  openOrders: number;
  completedTrades: number;
  users: number;
};

export default function SystemOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    price: 0,
    treasuryPlaton: 0,
    treasuryUsdt: 0,
    openOrders: 0,
    completedTrades: 0,
    users: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const [
      { data: price },
      { data: treasury },
      { count: orders },
      { count: trades },
      { count: users },
    ] = await Promise.all([
      supabase.from("market_price").select("price").eq("id", 1).single(),

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

    setStats({
      price: Number(price?.price ?? 0),
      treasuryPlaton: Number(treasury?.platon_balance ?? 0),
      treasuryUsdt: Number(treasury?.usdt_balance ?? 0),
      openOrders: orders ?? 0,
      completedTrades: trades ?? 0,
      users: users ?? 0,
    });
  }

  const cards = [
    {
      title: "Official Price",
      value: `$${stats.price.toFixed(8)}`,
      color: "text-yellow-400",
    },
    {
      title: "Treasury PLATON",
      value: `${stats.treasuryPlaton.toLocaleString()} π`,
      color: "text-white",
    },
    {
      title: "Treasury USDT",
      value: `$${stats.treasuryUsdt.toLocaleString()}`,
      color: "text-emerald-400",
    },
    {
      title: "Open Orders",
      value: stats.openOrders,
      color: "text-cyan-400",
    },
    {
      title: "Completed Trades",
      value: stats.completedTrades,
      color: "text-violet-400",
    },
    {
      title: "Registered Users",
      value: stats.users,
      color: "text-white",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
        >
          <p className="text-gray-400">{card.title}</p>

          <h2 className={`mt-3 text-3xl font-black ${card.color}`}>
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}