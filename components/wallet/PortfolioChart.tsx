"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { supabase } from "@/lib/supabase";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

type ChartPoint = {
  name: string;
  balance: number;
};

export default function PortfolioChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  const refreshKey = useWalletRefresh((s) => s.refreshKey);

  useEffect(() => {
    loadChart();
  }, [refreshKey]);

  async function loadChart() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data: wallet } = await supabase
      .from("wallets")
      .select("wallet_address,balance")
      .eq("user_id", userData.user.id)
      .single();

    if (!wallet) return;

    const { data: txs } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: true });

    const transactions = txs || [];

    let runningBalance = 0;

    const chart: ChartPoint[] = [];

    transactions.forEach((tx, index) => {
      if (tx.receiver_wallet === wallet.wallet_address) {
        runningBalance += Number(tx.amount);
      }

      if (tx.sender_wallet === wallet.wallet_address) {
        runningBalance -= Number(tx.amount);
      }

      chart.push({
        name: `${index + 1}`,
        balance: runningBalance,
      });
    });

    if (chart.length === 0) {
      chart.push({
        name: "1",
        balance: Number(wallet.balance),
      });
    }

    setData(chart);
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">
            Balance History
          </h2>

          <p className="mt-2 text-gray-400">
            Wallet balance over time
          </p>
        </div>
      </div>

      <div className="mt-8 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="platonGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#10B981"
                  stopOpacity={0.45}
                />

                <stop
                  offset="95%"
                  stopColor="#10B981"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <Tooltip
              contentStyle={{
                background: "#05070A",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 16,
              }}
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#platonGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}