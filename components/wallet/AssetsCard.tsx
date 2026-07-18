"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  Coins,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

type Stats = {
  balance: number;
  usdtBalance: number;
  transactions: number;
  received: number;
  sent: number;
};

type Transaction = {
  amount: number | string;
  sender_wallet: string | null;
  receiver_wallet: string | null;
};

const initialStats: Stats = {
  balance: 0,
  usdtBalance: 0,
  transactions: 0,
  received: 0,
  sent: 0,
};

export default function AssetsCard() {
  const [stats, setStats] = useState<Stats>(initialStats);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const refreshKey = useWalletRefresh(
    (state) => state.refreshKey
  );

  const loadStats = useCallback(
    async (silent = false) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setStats(initialStats);

        setError(
          "Unable to identify the current user."
        );

        setLoading(false);

        setRefreshing(false);

        return;
      }

      const {
        data: wallet,
        error: walletError,
      } = await supabase
        .from("wallets")
        .select(
          `
            wallet_address,
            balance,
            usdt_balance
          `
        )
        .eq("user_id", user.id)
        .single();

      if (walletError || !wallet) {
        console.error(
          "Failed to load wallet statistics:",
          walletError
        );

        setStats(initialStats);

        setError(
          "Unable to load wallet statistics."
        );

        setLoading(false);

        setRefreshing(false);

        return;
      }

      const {
        data: transactionData,
        error: transactionError,
      } = await supabase
        .from("transactions")
        .select(
          `
            amount,
            sender_wallet,
            receiver_wallet
          `
        )
        .or(
          `sender_wallet.eq.${wallet.wallet_address},receiver_wallet.eq.${wallet.wallet_address}`
        );

      if (transactionError) {
        console.error(
          "Failed to load wallet transactions:",
          transactionError
        );

        setStats({
          balance: Number(wallet.balance),

          usdtBalance: Number(
            wallet.usdt_balance
          ),

          transactions: 0,

          received: 0,

          sent: 0,
        });

        setError(
          "Wallet loaded, but transaction statistics are unavailable."
        );

        setLoading(false);

        setRefreshing(false);

        return;
      }

      const transactions =
        (transactionData as
          | Transaction[]
          | null) ?? [];

      const received = transactions
        .filter(
          (transaction) =>
            transaction.receiver_wallet ===
            wallet.wallet_address
        )
        .reduce(
          (total, transaction) =>
            total +
            Number(transaction.amount),

          0
        );

      const sent = transactions
        .filter(
          (transaction) =>
            transaction.sender_wallet ===
            wallet.wallet_address
        )
        .reduce(
          (total, transaction) =>
            total +
            Number(transaction.amount),

          0
        );

      setStats({
        balance: Number(
          wallet.balance
        ),

        usdtBalance: Number(
          wallet.usdt_balance
        ),

        transactions:
          transactions.length,

        received,

        sent,
      });

      setError("");

      setLoading(false);

      setRefreshing(false);
    },

    []
  );

  useEffect(() => {
    void loadStats();
  }, [loadStats, refreshKey]);

  const netFlow = useMemo(() => {
    return (
      stats.received -
      stats.sent
    );
  }, [
    stats.received,
    stats.sent,
  ]);

  function formatAmount(
    value: number
  ) {
    return value.toLocaleString(
      "en-US",
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          8,
      }
    );
  }

  const cards = [
    {
      title:
        "PLATON Balance",

      value:
        `${formatAmount(
          stats.balance
        )} π`,

      description:
        "Available PLATON",

      icon:
        Coins,

      valueStyle:
        "text-yellow-300",

      iconStyle:
        "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",

      glow:
        "bg-yellow-400/10",
    },

    {
      title:
        "USDT Balance",

      value:
        `${formatAmount(
          stats.usdtBalance
        )} USDT`,

      description:
        "Available for PLATON trading",

      icon:
        CircleDollarSign,

      valueStyle:
        "text-emerald-300",

      iconStyle:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",

      glow:
        "bg-emerald-400/10",
    },

    {
      title:
        "Transactions",

      value:
        stats.transactions.toLocaleString(
          "en-US"
        ),

      description:
        "Wallet operations",

      icon:
        Activity,

      valueStyle:
        "text-white",

      iconStyle:
        "border-violet-400/20 bg-violet-400/10 text-violet-400",

      glow:
        "bg-violet-400/10",
    },

    {
      title:
        "Received",

      value:
        `+${formatAmount(
          stats.received
        )} π`,

      description:
        "Total incoming",

      icon:
        ArrowDownLeft,

      valueStyle:
        "text-emerald-400",

      iconStyle:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",

      glow:
        "bg-emerald-400/10",
    },

    {
      title:
        "Sent",

      value:
        `-${formatAmount(
          stats.sent
        )} π`,

      description:
        "Total outgoing",

      icon:
        ArrowUpRight,

      valueStyle:
        "text-rose-400",

      iconStyle:
        "border-rose-400/20 bg-rose-400/10 text-rose-400",

      glow:
        "bg-rose-400/10",
    },
  ];

  if (loading) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
        <div className="animate-pulse">
          <div className="h-4 w-36 rounded-full bg-white/[0.07]" />

          <div className="mt-4 h-8 w-52 rounded-xl bg-white/[0.07]" />

          <div className="mt-8 space-y-4">
            {Array.from({
              length: 5,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-[22px] bg-white/[0.055]"
                />
              )
            )}
          </div>

          <div className="mt-5 h-24 rounded-[22px] bg-white/[0.055]" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-yellow-400/[0.07] blur-[100px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
              Wallet Analytics
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
              Wallet Statistics
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Overview of your
              PLATON and USDT
              balances.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void loadStats(
                true
              );
            }}
            disabled={
              refreshing
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/45 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Refresh wallet statistics"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-yellow-400/15 bg-yellow-400/[0.06] px-4 py-3">
            <p className="text-xs font-medium leading-5 text-yellow-200/70">
              {error}
            </p>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {cards.map(
            (card) => {
              const Icon =
                card.icon;

              return (
                <div
                  key={
                    card.title
                  }
                  className="group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-black/20 p-5 transition duration-300 hover:border-white/15 hover:bg-black/30"
                >
                  <div
                    className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full blur-[55px] transition duration-300 group-hover:scale-125 ${card.glow}`}
                  />

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${card.iconStyle}`}
                      >
                        <Icon
                          size={
                            19
                          }
                          strokeWidth={
                            2.2
                          }
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-white/30">
                          {
                            card.title
                          }
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          {
                            card.description
                          }
                        </p>
                      </div>
                    </div>

                    <p
                      className={`max-w-[55%] truncate text-right text-xl font-black tabular-nums ${card.valueStyle}`}
                    >
                      {
                        card.value
                      }
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div className="mt-5 rounded-[22px] border border-emerald-400/15 bg-emerald-400/[0.06] p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                <ShieldCheck
                  size={19}
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-white/30">
                  Wallet Status
                </p>

                <p className="mt-1 text-sm font-black text-emerald-400">
                  Active &
                  Synchronized
                </p>
              </div>
            </div>

            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
            </span>
          </div>

          <div className="mt-5 border-t border-emerald-400/10 pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-white/35">
                Net PLATON flow
              </span>

              <span
                className={`text-sm font-black ${
                  netFlow >= 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {netFlow >= 0
                  ? "+"
                  : ""}

                {formatAmount(
                  netFlow
                )}{" "}
                π
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}