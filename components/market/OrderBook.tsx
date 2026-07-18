"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  order_type: "BUY" | "SELL";
  price: number;
  remaining: number;
  status: "OPEN" | "PARTIAL" | "FILLED" | "CANCELLED";
  created_at: string;
};

type AggregatedOrder = {
  price: number;
  amount: number;
  total: number;
  depthPercent: number;
};

const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 8,
});

const valueFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

export default function OrderBook() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [realtimeStatus, setRealtimeStatus] =
    useState<"CONNECTING" | "LIVE" | "OFFLINE">("CONNECTING");

  const loadOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, order_type, price, remaining, status, created_at"
      )
      .in("status", ["OPEN", "PARTIAL"])
      .gt("remaining", 0)
      .order("created_at", { ascending: true })
      .limit(500);

    if (error) {
      console.error("Failed to load order book:", error);
      setLoading(false);
      return;
    }

    const formatted = (data ?? [])
      .map((order) => ({
        ...order,
        price: Number(order.price),
        remaining: Number(order.remaining),
      }))
      .filter(
        (order) =>
          Number.isFinite(order.price) &&
          Number.isFinite(order.remaining) &&
          order.price > 0 &&
          order.remaining > 0
      ) as Order[];

    setOrders(formatted);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();

    function handleOrdersUpdated() {
      loadOrders();
    }

    window.addEventListener(
      "platon-orders-updated",
      handleOrdersUpdated
    );

    const channel = supabase
      .channel("market-order-book")
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
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setRealtimeStatus("LIVE");
        } else if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        ) {
          setRealtimeStatus("OFFLINE");
        }
      });

    const fallbackInterval = window.setInterval(() => {
      loadOrders();
    }, 15000);

    return () => {
      window.removeEventListener(
        "platon-orders-updated",
        handleOrdersUpdated
      );

      window.clearInterval(fallbackInterval);
      supabase.removeChannel(channel);
    };
  }, [loadOrders]);

  const buyOrders = useMemo(() => {
    return aggregateOrders(
      orders.filter((order) => order.order_type === "BUY"),
      "BUY"
    );
  }, [orders]);

  const sellOrders = useMemo(() => {
    return aggregateOrders(
      orders.filter((order) => order.order_type === "SELL"),
      "SELL"
    );
  }, [orders]);

  const bestBid = buyOrders[0]?.price ?? 0;
  const bestAsk = sellOrders[0]?.price ?? 0;

  const spread =
    bestBid > 0 && bestAsk > 0
      ? Number((bestAsk - bestBid).toFixed(8))
      : 0;

  const midpoint =
    bestBid > 0 && bestAsk > 0
      ? Number(((bestBid + bestAsk) / 2).toFixed(8))
      : bestBid || bestAsk || 0;

  const buyDepth = buyOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  const sellDepth = sellOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[3px] text-gray-500">
              Market Depth
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Order Book
            </h2>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${
              realtimeStatus === "LIVE"
                ? "bg-emerald-400/10 text-emerald-300"
                : realtimeStatus === "OFFLINE"
                  ? "bg-red-400/10 text-red-300"
                  : "bg-yellow-400/10 text-yellow-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                realtimeStatus === "LIVE"
                  ? "animate-pulse bg-emerald-400"
                  : realtimeStatus === "OFFLINE"
                    ? "bg-red-400"
                    : "animate-pulse bg-yellow-400"
              }`}
            />

            {realtimeStatus}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <BookStat
            label="Best Bid"
            value={
              bestBid > 0
                ? `$${bestBid.toFixed(8)}`
                : "—"
            }
            className="text-emerald-300"
          />

          <BookStat
            label="Best Ask"
            value={
              bestAsk > 0
                ? `$${bestAsk.toFixed(8)}`
                : "—"
            }
            className="text-red-300"
          />

          <BookStat
            label="Spread"
            value={
              spread > 0
                ? `$${spread.toFixed(8)}`
                : "—"
            }
            className="text-yellow-300"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />

            <p className="mt-4 text-sm text-gray-400">
              Loading order book...
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-[1.5px] text-gray-600">
            <span>Price USD</span>
            <span className="text-right">Amount π</span>
            <span className="text-right">Total USD</span>
          </div>

          <div className="max-h-[310px] overflow-y-auto">
            {sellOrders.length === 0 ? (
              <EmptyRows
                text="No sell orders"
                className="text-red-300"
              />
            ) : (
              [...sellOrders]
                .reverse()
                .map((order) => (
                  <OrderRow
                    key={`SELL-${order.price}`}
                    order={order}
                    side="SELL"
                  />
                ))
            )}
          </div>

          <div className="border-y border-white/10 bg-black/25 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[2px] text-gray-600">
                  Mid Market
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {midpoint > 0
                    ? `$${midpoint.toFixed(8)}`
                    : "$0.00000000"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-600">
                  Total depth
                </p>

                <p className="mt-1 text-sm font-bold text-gray-300">
                  {amountFormatter.format(
                    buyDepth + sellDepth
                  )}{" "}
                  π
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-[310px] overflow-y-auto">
            {buyOrders.length === 0 ? (
              <EmptyRows
                text="No buy orders"
                className="text-emerald-300"
              />
            ) : (
              buyOrders.map((order) => (
                <OrderRow
                  key={`BUY-${order.price}`}
                  order={order}
                  side="BUY"
                />
              ))
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-5">
        <DepthSummary
          label="BUY Depth"
          amount={buyDepth}
          className="text-emerald-300"
        />

        <DepthSummary
          label="SELL Depth"
          amount={sellDepth}
          className="text-red-300"
        />
      </div>

      <div className="border-t border-white/10 px-5 py-4 text-xs text-gray-600">
        Realtime order book with 15-second fallback refresh.
      </div>
    </div>
  );
}

function aggregateOrders(
  orders: Order[],
  side: "BUY" | "SELL"
): AggregatedOrder[] {
  const grouped = new Map<number, number>();

  orders.forEach((order) => {
    const normalizedPrice = Number(order.price.toFixed(8));

    grouped.set(
      normalizedPrice,
      (grouped.get(normalizedPrice) ?? 0) +
        order.remaining
    );
  });

  const aggregated = Array.from(grouped.entries())
    .map(([price, amount]) => ({
      price,
      amount: Number(amount.toFixed(8)),
      total: Number((price * amount).toFixed(8)),
      depthPercent: 0,
    }))
    .sort((a, b) =>
      side === "BUY"
        ? b.price - a.price
        : a.price - b.price
    )
    .slice(0, 15);

  const maximumAmount = Math.max(
    ...aggregated.map((order) => order.amount),
    1
  );

  return aggregated.map((order) => ({
    ...order,
    depthPercent: Math.max(
      4,
      Math.min(
        100,
        (order.amount / maximumAmount) * 100
      )
    ),
  }));
}

type OrderRowProps = {
  order: AggregatedOrder;
  side: "BUY" | "SELL";
};

function OrderRow({
  order,
  side,
}: OrderRowProps) {
  const isBuy = side === "BUY";

  return (
    <div className="group relative grid grid-cols-[1fr_1fr_1fr] items-center px-5 py-2.5 text-xs transition hover:bg-white/[0.035]">
      <div
        className={`absolute inset-y-0 right-0 opacity-70 ${
          isBuy
            ? "bg-emerald-400/[0.09]"
            : "bg-red-400/[0.09]"
        }`}
        style={{
          width: `${order.depthPercent}%`,
        }}
      />

      <span
        className={`relative z-10 font-mono font-black ${
          isBuy
            ? "text-emerald-300"
            : "text-red-300"
        }`}
      >
        {order.price.toFixed(8)}
      </span>

      <span className="relative z-10 text-right font-mono text-gray-300">
        {amountFormatter.format(order.amount)}
      </span>

      <span className="relative z-10 text-right font-mono text-gray-500">
        {valueFormatter.format(order.total)}
      </span>
    </div>
  );
}

type BookStatProps = {
  label: string;
  value: string;
  className: string;
};

function BookStat({
  label,
  value,
  className,
}: BookStatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] uppercase tracking-[1.5px] text-gray-600">
        {label}
      </p>

      <p
        className={`mt-2 truncate text-xs font-black ${className}`}
      >
        {value}
      </p>
    </div>
  );
}

type DepthSummaryProps = {
  label: string;
  amount: number;
  className: string;
};

function DepthSummary({
  label,
  amount,
  className,
}: DepthSummaryProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-gray-600">
        {label}
      </p>

      <p className={`mt-2 font-black ${className}`}>
        {amountFormatter.format(amount)} π
      </p>
    </div>
  );
}

type EmptyRowsProps = {
  text: string;
  className: string;
};

function EmptyRows({
  text,
  className,
}: EmptyRowsProps) {
  return (
    <div className="flex h-[120px] items-center justify-center">
      <p className={`text-sm ${className}`}>
        {text}
      </p>
    </div>
  );
}