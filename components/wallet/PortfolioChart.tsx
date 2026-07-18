"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { supabase } from "@/lib/supabase";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

type ChartPoint = {
  name: string;
  balance: number;
};

type Transaction = {
  amount: number | string;
  sender_wallet: string | null;
  receiver_wallet: string | null;
  created_at: string;
};

export default function PortfolioChart() {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshKey = useWalletRefresh((state) => state.refreshKey);

  const loadChart = useCallback(async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setData([]);
      setCurrentBalance(0);
      setLoading(false);
      return;
    }

    const { data: wallet } = await supabase
      .from("wallets")
      .select("wallet_address, balance")
      .eq("user_id", userData.user.id)
      .single();

    if (!wallet) {
      setData([]);
      setCurrentBalance(0);
      setLoading(false);
      return;
    }

    const walletBalance = Number(wallet.balance);

    setCurrentBalance(walletBalance);

    const { data: transactionData } = await supabase
      .from("transactions")
      .select(
        "amount, sender_wallet, receiver_wallet, created_at"
      )
      .order("created_at", { ascending: true });

    const transactions =
      (transactionData as Transaction[] | null) ?? [];

    let runningBalance = 0;

    const chart: ChartPoint[] = [];

    transactions.forEach((transaction, index) => {
      const amount = Number(transaction.amount);

      if (
        transaction.receiver_wallet ===
        wallet.wallet_address
      ) {
        runningBalance += amount;
      }

      if (
        transaction.sender_wallet ===
        wallet.wallet_address
      ) {
        runningBalance -= amount;
      }

      chart.push({
        name: `${index + 1}`,
        balance: runningBalance,
      });
    });

    if (chart.length === 0) {
      chart.push({
        name: "1",
        balance: walletBalance,
      });
    }

    setData(chart);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadChart();
  }, [loadChart, refreshKey]);

  const portfolioChange = useMemo(() => {
    if (data.length < 2) {
      return {
        value: 0,
        positive: true,
      };
    }

    const firstBalance = data[0].balance;
    const lastBalance = data[data.length - 1].balance;

    const difference = lastBalance - firstBalance;

    return {
      value: difference,
      positive: difference >= 0,
    };
  }, [data]);

  function formatBalance(value: number) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-black/20 p-5 sm:p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/[0.08] blur-[90px]" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
            Wallet Performance
          </p>

          <h3 className="mt-3 text-xl font-black tracking-[-0.03em] text-white sm:text-2xl">
            Balance History
          </h3>

          <p className="mt-2 text-sm text-white/40">
            Wallet balance movement over time
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-4 sm:text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            Current Balance
          </p>

          <p className="mt-2 text-xl font-black text-emerald-400">
            {formatBalance(currentBalance)} π
          </p>

          <p
            className={`mt-1 text-xs font-bold ${
              portfolioChange.positive
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {portfolioChange.positive ? "+" : ""}
            {formatBalance(portfolioChange.value)} π
          </p>
        </div>
      </div>

      <div className="relative mt-8 h-[320px]">
        {loading ? (
          <div className="flex h-full items-end gap-2 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            {Array.from({ length: 16 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex-1 animate-pulse rounded-t-lg bg-white/[0.06]"
                  style={{
                    height: `${25 + ((index * 17) % 65)}%`,
                  }}
                />
              )
            )}
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={data}
              margin={{
                top: 15,
                right: 5,
                left: 5,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="portfolioBalanceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#34D399"
                    stopOpacity={0.42}
                  />

                  <stop
                    offset="55%"
                    stopColor="#10B981"
                    stopOpacity={0.12}
                  />

                  <stop
                    offset="100%"
                    stopColor="#10B981"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,0.055)"
                strokeDasharray="4 8"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "rgba(255,255,255,0.25)",
                  fontSize: 11,
                }}
                minTickGap={30}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={58}
                tick={{
                  fill: "rgba(255,255,255,0.25)",
                  fontSize: 11,
                }}
                tickFormatter={(value) =>
                  Number(value).toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits: 0,
                    }
                  )
                }
              />

              <Tooltip
                cursor={{
                  stroke:
                    "rgba(52,211,153,0.35)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  background:
                    "rgba(5,7,10,0.96)",
                  border:
                    "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 16,
                  boxShadow:
                    "0 20px 50px rgba(0,0,0,0.45)",
                }}
                labelStyle={{
                  color:
                    "rgba(255,255,255,0.4)",
                  marginBottom: 6,
                }}
                itemStyle={{
                  color: "#34D399",
                  fontWeight: 800,
                }}
                formatter={(value) => [
                  `${formatBalance(
                    Number(value)
                  )} π`,
                  "Balance",
                ]}
                labelFormatter={(label) =>
                  `Transaction ${label}`
                }
              />

              <Area
                type="monotone"
                dataKey="balance"
                stroke="#34D399"
                strokeWidth={3}
                fill="url(#portfolioBalanceGradient)"
                activeDot={{
                  r: 5,
                  fill: "#34D399",
                  stroke: "#05070A",
                  strokeWidth: 3,
                }}
                dot={false}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />

          <span className="text-xs font-semibold text-white/35">
            Wallet data synchronized
          </span>
        </div>

        <span className="text-xs font-semibold text-white/25">
          PLATON Network
        </span>
      </div>
    </div>
  );
}