"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  wallet_address: string;
  order_type: "BUY" | "SELL";
  price: number;
  amount: number;
  remaining: number;
  status: "OPEN" | "PARTIAL" | "FILLED" | "CANCELLED";
  created_at: string;
};

type StatusFilter =
  | "ALL"
  | "OPEN"
  | "PARTIAL"
  | "FILLED"
  | "CANCELLED";

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const loadOrders = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        wallet_address,
        order_type,
        price,
        amount,
        remaining,
        status,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error(error);
      toast.error("Failed to load orders.");
      setOrders([]);
      setLoading(false);
      return;
    }

    const formatted = (data ?? []).map((order) => ({
      ...order,
      price: Number(order.price),
      amount: Number(order.amount),
      remaining: Number(order.remaining),
    })) as Order[];

    setOrders(formatted);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadOrders]);

  async function cancelOrder(orderId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    setCancellingId(orderId);

    try {
      const response = await fetch("/api/admin/orders/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to cancel order.");
        return;
      }

      toast.success("Order cancelled successfully.");
      await loadOrders();
    } catch {
      toast.error("Unable to connect to the server.");
    } finally {
      setCancellingId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      const matchesSearch =
        !normalizedSearch ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.wallet_address
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  function statusColor(status: Order["status"]) {
    switch (status) {
      case "OPEN":
        return "text-cyan-400";
      case "PARTIAL":
        return "text-yellow-400";
      case "FILLED":
        return "text-emerald-400";
      case "CANCELLED":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  }

  function shortWallet(address: string) {
    if (address.length <= 24) return address;

    return `${address.slice(0, 14)}...${address.slice(-6)}`;
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
          <h2 className="text-3xl font-black">Orders Manager</h2>

          <p className="mt-2 text-sm text-gray-400">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          disabled={loading}
          className="rounded-xl bg-white/10 px-4 py-3 font-bold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_220px]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by order ID or wallet address"
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-emerald-400"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as StatusFilter)
          }
          className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-emerald-400"
        >
          <option value="ALL">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="PARTIAL">Partial</option>
          <option value="FILLED">Filled</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          No matching orders found.
        </div>
      ) : (
        <>
          <div className="mt-8 hidden xl:block">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="w-[8%] pb-4">Type</th>
                  <th className="w-[22%] pb-4">Wallet</th>
                  <th className="w-[14%] pb-4">Price</th>
                  <th className="w-[13%] pb-4">Amount</th>
                  <th className="w-[13%] pb-4">Remaining</th>
                  <th className="w-[11%] pb-4">Status</th>
                  <th className="w-[12%] pb-4">Created</th>
                  <th className="w-[7%] pb-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const canCancel =
                    order.status === "OPEN" ||
                    order.status === "PARTIAL";

                  const isCancelling = cancellingId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 text-sm"
                    >
                      <td
                        className={`py-4 font-bold ${
                          order.order_type === "BUY"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {order.order_type}
                      </td>

                      <td className="py-4 pr-4">
                        <p
                          title={order.wallet_address}
                          className="truncate font-mono text-xs text-gray-300"
                        >
                          {shortWallet(order.wallet_address)}
                        </p>
                      </td>

                      <td className="py-4">
                        ${order.price.toFixed(8)}
                      </td>

                      <td className="py-4">
                        {order.amount.toLocaleString()} π
                      </td>

                      <td className="py-4">
                        {order.remaining.toLocaleString()} π
                      </td>

                      <td
                        className={`py-4 font-bold ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </td>

                      <td className="py-4 text-xs text-gray-400">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="py-4 text-right">
                        {canCancel ? (
                          <button
                            type="button"
                            onClick={() => cancelOrder(order.id)}
                            disabled={isCancelling}
                            className="rounded-xl bg-red-500/15 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isCancelling ? "..." : "Cancel"}
                          </button>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-4 xl:hidden">
            {filteredOrders.map((order) => {
              const canCancel =
                order.status === "OPEN" ||
                order.status === "PARTIAL";

              const isCancelling = cancellingId === order.id;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-black/25 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        order.order_type === "BUY"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      {order.order_type}
                    </span>

                    <span
                      className={`text-xs font-bold ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p
                    title={order.wallet_address}
                    className="mt-4 truncate font-mono text-xs text-gray-400"
                  >
                    {shortWallet(order.wallet_address)}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="mt-1 font-bold">
                        ${order.price.toFixed(8)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="mt-1 font-bold">
                        {order.amount.toLocaleString()} π
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Remaining</p>
                      <p className="mt-1 font-bold">
                        {order.remaining.toLocaleString()} π
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="mt-1 text-xs font-bold">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    {canCancel ? (
                      <button
                        type="button"
                        onClick={() => cancelOrder(order.id)}
                        disabled={isCancelling}
                        className="w-full rounded-xl bg-red-500/15 px-4 py-3 font-bold text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isCancelling
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    ) : (
                      <div className="rounded-xl bg-white/5 px-4 py-3 text-center text-sm text-gray-500">
                        No actions available
                      </div>
                    )}
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