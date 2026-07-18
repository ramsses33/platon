"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

type Trade = {
  id: string;
  buy_order_id: string;
  sell_order_id: string;
  buyer_id: string | null;
  seller_id: string | null;
  buyer_source: "USER" | "TREASURY";
  seller_source: "USER" | "TREASURY";
  execution_type:
    | "USER_MATCH"
    | "TREASURY_BUY"
    | "TREASURY_SELL";
  price: number;
  amount: number;
  created_at: string;
};

type ExecutionFilter =
  | "ALL"
  | "USER_MATCH"
  | "TREASURY_BUY"
  | "TREASURY_SELL";

export default function TradesManager() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [executionFilter, setExecutionFilter] =
    useState<ExecutionFilter>("ALL");

  const loadTrades = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("trades")
      .select(`
        id,
        buy_order_id,
        sell_order_id,
        buyer_id,
        seller_id,
        buyer_source,
        seller_source,
        execution_type,
        price,
        amount,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error(error);
      toast.error("Failed to load trades.");
      setTrades([]);
      setLoading(false);
      return;
    }

    const formatted = (data ?? []).map((trade) => ({
      ...trade,
      price: Number(trade.price),
      amount: Number(trade.amount),
    })) as Trade[];

    setTrades(formatted);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTrades();

    const channel = supabase
      .channel("admin-trades")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trades",
        },
        () => {
          loadTrades();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTrades]);

  const filteredTrades = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return trades.filter((trade) => {
      const matchesExecution =
        executionFilter === "ALL" ||
        trade.execution_type === executionFilter;

      const matchesSearch =
        !normalizedSearch ||
        trade.id.toLowerCase().includes(normalizedSearch) ||
        trade.buy_order_id.toLowerCase().includes(normalizedSearch) ||
        trade.sell_order_id.toLowerCase().includes(normalizedSearch) ||
        trade.buyer_id?.toLowerCase().includes(normalizedSearch) ||
        trade.seller_id?.toLowerCase().includes(normalizedSearch);

      return matchesExecution && matchesSearch;
    });
  }, [trades, search, executionFilter]);

  function executionLabel(type: Trade["execution_type"]) {
    switch (type) {
      case "USER_MATCH":
        return "USER ↔ USER";
      case "TREASURY_BUY":
        return "TREASURY BUY";
      case "TREASURY_SELL":
        return "TREASURY SELL";
    }
  }

  function executionColor(type: Trade["execution_type"]) {
    switch (type) {
      case "USER_MATCH":
        return "text-violet-400";
      case "TREASURY_BUY":
        return "text-cyan-400";
      case "TREASURY_SELL":
        return "text-yellow-400";
    }
  }

  function shortId(value: string | null) {
    if (!value) return "Treasury";
    if (value.length <= 18) return value;

    return `${value.slice(0, 8)}...${value.slice(-6)}`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl sm:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-3xl font-black">Trades Manager</h2>

          <p className="mt-2 text-sm text-gray-400">
            Showing {filteredTrades.length} of {trades.length} trades
          </p>
        </div>

        <button
          type="button"
          onClick={loadTrades}
          disabled={loading}
          className="rounded-xl bg-white/10 px-4 py-3 font-bold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_240px]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by trade, order or user ID"
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-emerald-400"
        />

        <select
          value={executionFilter}
          onChange={(event) =>
            setExecutionFilter(
              event.target.value as ExecutionFilter
            )
          }
          className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-emerald-400"
        >
          <option value="ALL">All execution types</option>
          <option value="USER_MATCH">User ↔ User</option>
          <option value="TREASURY_BUY">Treasury Buy</option>
          <option value="TREASURY_SELL">Treasury Sell</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">
          Loading trades...
        </div>
      ) : filteredTrades.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          No matching trades found.
        </div>
      ) : (
        <>
          <div className="mt-8 hidden xl:block">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="w-[18%] pb-4">Execution</th>
                  <th className="w-[15%] pb-4">Buyer</th>
                  <th className="w-[15%] pb-4">Seller</th>
                  <th className="w-[15%] pb-4">Price</th>
                  <th className="w-[15%] pb-4">Amount</th>
                  <th className="w-[12%] pb-4">Value</th>
                  <th className="w-[10%] pb-4">Created</th>
                </tr>
              </thead>

              <tbody>
                {filteredTrades.map((trade) => {
                  const value = trade.price * trade.amount;

                  return (
                    <tr
                      key={trade.id}
                      className="border-b border-white/5 text-sm"
                    >
                      <td
                        className={`py-4 font-bold ${executionColor(
                          trade.execution_type
                        )}`}
                      >
                        {executionLabel(trade.execution_type)}
                      </td>

                      <td
                        className="py-4 font-mono text-xs text-gray-300"
                        title={trade.buyer_id ?? "Treasury"}
                      >
                        {trade.buyer_source === "TREASURY"
                          ? "Treasury"
                          : shortId(trade.buyer_id)}
                      </td>

                      <td
                        className="py-4 font-mono text-xs text-gray-300"
                        title={trade.seller_id ?? "Treasury"}
                      >
                        {trade.seller_source === "TREASURY"
                          ? "Treasury"
                          : shortId(trade.seller_id)}
                      </td>

                      <td className="py-4">
                        ${trade.price.toFixed(8)}
                      </td>

                      <td className="py-4">
                        {trade.amount.toLocaleString()} π
                      </td>

                      <td className="py-4 text-emerald-400">
                        ${value.toFixed(2)}
                      </td>

                      <td className="py-4 text-xs text-gray-400">
                        {formatDate(trade.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-4 xl:hidden">
            {filteredTrades.map((trade) => {
              const value = trade.price * trade.amount;

              return (
                <div
                  key={trade.id}
                  className="rounded-2xl border border-white/10 bg-black/25 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`text-sm font-black ${executionColor(
                        trade.execution_type
                      )}`}
                    >
                      {executionLabel(trade.execution_type)}
                    </span>

                    <span className="text-xs text-gray-500">
                      {formatDate(trade.created_at)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Buyer</p>
                      <p className="mt-1 truncate font-mono text-xs">
                        {trade.buyer_source === "TREASURY"
                          ? "Treasury"
                          : shortId(trade.buyer_id)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Seller</p>
                      <p className="mt-1 truncate font-mono text-xs">
                        {trade.seller_source === "TREASURY"
                          ? "Treasury"
                          : shortId(trade.seller_id)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="mt-1 font-bold">
                        ${trade.price.toFixed(8)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="mt-1 font-bold">
                        {trade.amount.toLocaleString()} π
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-gray-500">Trade Value</p>
                      <p className="mt-1 text-lg font-black text-emerald-400">
                        ${value.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}