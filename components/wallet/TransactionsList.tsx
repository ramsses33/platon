"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock3,
  RefreshCw,
  ReceiptText,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

type Transaction = {
  id: string;
  sender_wallet: string | null;
  receiver_wallet: string;
  amount: number | string;
  type: string;
  status: string;
  created_at: string;
};

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [myAddress, setMyAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const refreshKey = useWalletRefresh(
    (state) => state.refreshKey
  );

  const loadTransactions = useCallback(
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
        setTransactions([]);
        setMyAddress("");
        setError("Unable to identify the current user.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const { data: wallet, error: walletError } =
        await supabase
          .from("wallets")
          .select("wallet_address")
          .eq("user_id", user.id)
          .single();

      if (walletError || !wallet) {
        console.error(
          "Failed to load wallet address:",
          walletError
        );

        setTransactions([]);
        setMyAddress("");
        setError("Unable to load wallet transactions.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setMyAddress(wallet.wallet_address);

      const {
        data: transactionData,
        error: transactionsError,
      } = await supabase
        .from("transactions")
        .select(
          `
            id,
            sender_wallet,
            receiver_wallet,
            amount,
            type,
            status,
            created_at
          `
        )
        .or(
          `sender_wallet.eq.${wallet.wallet_address},receiver_wallet.eq.${wallet.wallet_address}`
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(10);

      if (transactionsError) {
        console.error(
          "Failed to load transactions:",
          transactionsError
        );

        setTransactions([]);
        setError("Unable to load recent transactions.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setTransactions(
        (transactionData as Transaction[] | null) ?? []
      );

      setError("");
      setLoading(false);
      setRefreshing(false);
    },
    []
  );

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions, refreshKey]);

  useEffect(() => {
    const channel = supabase
      .channel("wallet-transactions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        () => {
          loadTransactions(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTransactions]);

  function formatAmount(value: number | string) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function shortenAddress(
    address: string | null
  ) {
    if (!address) {
      return "PLATON Network";
    }

    if (address.length <= 26) {
      return address;
    }

    return `${address.slice(0, 15)}...${address.slice(-9)}`;
  }

  if (loading) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
        <div className="animate-pulse">
          <div className="h-4 w-44 rounded-full bg-white/[0.07]" />

          <div className="mt-4 h-9 w-72 max-w-full rounded-xl bg-white/[0.07]" />

          <div className="mt-8 space-y-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-[24px] bg-white/[0.055]"
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-400/[0.06] blur-[100px]" />

      <div className="relative flex flex-col gap-5 border-b border-white/[0.07] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
            Wallet History
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
            Recent Transactions
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Your latest incoming and outgoing PLATON transfers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
              Live
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              loadTransactions(true)
            }
            disabled={refreshing}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/45 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Refresh transactions"
          >
            <RefreshCw
              size={17}
              className={
                refreshing ? "animate-spin" : ""
              }
            />
          </button>
        </div>
      </div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-400/15 bg-rose-400/[0.06] px-4 py-3">
            <p className="text-sm text-rose-300">
              {error}
            </p>
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/30">
              <ReceiptText size={28} />
            </div>

            <h3 className="mt-5 text-lg font-black text-white">
              No transactions yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
              Your PLATON transfers will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const incoming =
                transaction.receiver_wallet ===
                myAddress;

              const counterparty = incoming
                ? transaction.sender_wallet
                : transaction.receiver_wallet;

              return (
                <article
                  key={transaction.id}
                  className="group rounded-[24px] border border-white/[0.07] bg-black/20 p-5 transition duration-300 hover:border-white/15 hover:bg-black/30"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                          incoming
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                            : "border-rose-400/20 bg-rose-400/10 text-rose-400"
                        }`}
                      >
                        {incoming ? (
                          <ArrowDownLeft
                            size={22}
                          />
                        ) : (
                          <ArrowUpRight
                            size={22}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-black text-white">
                            {incoming
                              ? "Incoming"
                              : "Outgoing"}
                          </h3>

                          <span
                            className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                              transaction.status.toUpperCase() ===
                              "COMPLETED"
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                                : "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </div>

                        <p className="mt-2 truncate font-mono text-xs text-white/30">
                          {incoming
                            ? "From"
                            : "To"}
                          :{" "}
                          {shortenAddress(
                            counterparty
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p
                        className={`text-xl font-black tabular-nums ${
                          incoming
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {incoming ? "+" : "-"}
                        {formatAmount(
                          transaction.amount
                        )}{" "}
                        π
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-white/30 sm:justify-end">
                        <Clock3 size={13} />

                        <span>
                          {formatDate(
                            transaction.created_at
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs font-medium text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing latest {transactions.length} transactions
          </span>

          <span>
            Automatically synchronized
          </span>
        </div>
      </div>
    </section>
  );
}