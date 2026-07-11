"use client";

import { useEffect, useState } from "react";
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

type PricePoint = {
  id: number;
  price: number;
  created_at: string;
};

type ChartPoint = {
  time: string;
  fullTime: string;
  price: number;
};

export default function LiveChart() {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPriceHistory();

    const interval = setInterval(() => {
      loadPriceHistory();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  async function loadPriceHistory() {
    const { data: history, error } = await supabase
      .from("price_history")
      .select("id, price, created_at")
      .order("created_at", { ascending: true })
      .limit(100);

    if (!error && history) {
      const formatted = (history as PricePoint[]).map((item) => {
        const date = new Date(item.created_at);

        return {
          time: date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          fullTime: date.toLocaleString(),
          price: Number(item.price),
        };
      });

      setData(formatted);
    }

    setLoading(false);
  }

  const currentPrice = data.at(-1)?.price ?? 0;
  const firstPrice = data.at(0)?.price ?? currentPrice;
  const change = currentPrice - firstPrice;

  const changePercent =
    firstPrice > 0 ? (change / firstPrice) * 100 : 0;

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[4px] text-gray-500">
            PLATON / USD
          </p>

          <h2 className="mt-3 text-4xl font-black">
            ${currentPrice.toFixed(5)}
          </h2>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm font-bold ${
            change >= 0
              ? "bg-emerald-400/10 text-emerald-300"
              : "bg-red-400/10 text-red-300"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {changePercent.toFixed(2)}%
        </div>
      </div>

      <div className="mt-8 h-[420px]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            Loading price history...
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            No price history available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="marketPriceGradient"
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

              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                minTickGap={35}
              />

              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${Number(value).toFixed(4)}`}
                width={75}
              />

              <Tooltip
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullTime ?? ""
                }
                formatter={(value) => [
                  `$${Number(value).toFixed(8)}`,
                  "PLATON Price",
                ]}
                contentStyle={{
                  background: "#05070A",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  color: "#ffffff",
                }}
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#marketPriceGradient)"
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Price chart automatically refreshes every 15 seconds.
      </p>
    </div>
  );
}