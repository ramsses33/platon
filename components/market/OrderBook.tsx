"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  order_type: "BUY" | "SELL";
  price: number;
  remaining: number;
  status: "OPEN" | "PARTIAL" | "FILLED" | "CANCELLED";
  created_at: string;
};

export default function OrderBook() {
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();

    function handleOrdersUpdated() {
      loadOrders();
    }

    window.addEventListener("platon-orders-updated", handleOrdersUpdated);

    const interval = setInterval(() => {
      loadOrders();
    }, 15000);

    return () => {
      window.removeEventListener(
        "platon-orders-updated",
        handleOrdersUpdated
      );
      clearInterval(interval);
    };
  }, []);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, order_type, price, remaining, status, created_at"
      )
      .in("status", ["OPEN", "PARTIAL"])
      .order("created_at", { ascending: true });

    if (error) {
      setLoading(false);
      return;
    }

    const orders = (data || []).map((order) => ({
      ...order,
      price: Number(order.price),
      remaining: Number(order.remaining),
    })) as Order[];

    const buys = orders
      .filter((order) => order.order_type === "BUY")
      .sort((a, b) => b.price - a.price);

    const sells = orders
      .filter((order) => order.order_type === "SELL")
      .sort((a, b) => a.price - b.price);

    setBuyOrders(buys);
    setSellOrders(sells);
    setLoading(false);
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-black">Order Book</h2>

        <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
          LIVE
        </span>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading orders...</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-emerald-400">BUY</h3>
              <span className="text-xs text-gray-500">
                Price / Remaining
              </span>
            </div>

            <div className="space-y-3">
              {buyOrders.length === 0 ? (
                <p className="rounded-xl bg-black/20 px-4 py-3 text-sm text-gray-500">
                  No buy orders
                </p>
              ) : (
                buyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between gap-4 rounded-xl bg-emerald-400/10 px-4 py-3"
                  >
                    <span className="font-bold text-emerald-400">
                      ${order.price.toFixed(8)}
                    </span>

                    <span>{order.remaining.toLocaleString()} π</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-red-400">SELL</h3>
              <span className="text-xs text-gray-500">
                Price / Remaining
              </span>
            </div>

            <div className="space-y-3">
              {sellOrders.length === 0 ? (
                <p className="rounded-xl bg-black/20 px-4 py-3 text-sm text-gray-500">
                  No sell orders
                </p>
              ) : (
                sellOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between gap-4 rounded-xl bg-red-400/10 px-4 py-3"
                  >
                    <span className="font-bold text-red-400">
                      ${order.price.toFixed(8)}
                    </span>

                    <span>{order.remaining.toLocaleString()} π</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}