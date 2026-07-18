"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock3,
  CreditCard,
  FileText,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type PaymentTransaction = {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender_wallet: string;
  receiver_wallet: string;
  amount: number | string;
  type: string;
  status: string;
  note: string | null;
  created_at: string;
};

function shortenAddress(
  address: string
) {
  if (address.length <= 20) {
    return address;
  }

  return `${address.slice(
    0,
    11
  )}...${address.slice(-7)}`;
}

function formatAmount(
  amount: number | string
) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    }
  );
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

export default function PaymentHistory() {
  const [
    transactions,
    setTransactions,
  ] = useState<
    PaymentTransaction[]
  >([]);

  const [userId, setUserId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const loadPayments =
    useCallback(
      async (
        showRefresh = false
      ) => {
        if (showRefresh) {
          setRefreshing(true);
        }

        try {
          const {
            data: userData,
            error: userError,
          } =
            await supabase.auth.getUser();

          const user =
            userData.user;

          if (
            userError ||
            !user
          ) {
            setTransactions([]);

            setUserId("");

            setError(
              "Unable to identify the current user."
            );

            return;
          }

          setUserId(
            user.id
          );

          const {
            data,
            error:
              paymentsError,
          } = await supabase
            .from(
              "transactions"
            )
            .select(
              `
                id,
                sender_id,
                receiver_id,
                sender_wallet,
                receiver_wallet,
                amount,
                type,
                status,
                note,
                created_at
              `
            )
            .eq(
              "type",
              "payment"
            )
            .or(
              `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
            )
            .order(
              "created_at",
              {
                ascending: false,
              }
            )
            .limit(20);

          if (
            paymentsError
          ) {
            console.error(
              "Unable to load payment history:",
              paymentsError
            );

            setTransactions(
              []
            );

            setError(
              paymentsError.message
            );

            return;
          }

          setTransactions(
            (
              data ?? []
            ) as PaymentTransaction[]
          );

          setError("");
        } catch (
          loadError
        ) {
          console.error(
            "Payment history error:",
            loadError
          );

          setTransactions(
            []
          );

          setError(
            "Unable to load payment history."
          );
        } finally {
          setLoading(false);

          setRefreshing(false);
        }
      },
      []
    );

  useEffect(() => {
    void loadPayments();

    function handlePaymentCompleted() {
      void loadPayments();
    }

    window.addEventListener(
      "platon-payment-completed",
      handlePaymentCompleted
    );

    const channel =
      supabase
        .channel(
          "platon-payments-history"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "transactions",
          },
          () => {
            void loadPayments();
          }
        )
        .subscribe();

    return () => {
      window.removeEventListener(
        "platon-payment-completed",
        handlePaymentCompleted
      );

      void supabase.removeChannel(
        channel
      );
    };
  }, [loadPayments]);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/[0.06] blur-[100px]" />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400">
              Payment Activity
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
              Payment History
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Your latest sent and
              received PLATON
              payments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void loadPayments(
                true
              );
            }}
            disabled={
              refreshing
            }
            className="flex h-11 w-fit items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-black text-white transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-[26px] border border-white/[0.07] bg-black/20">
            <div className="text-center">
              <LoaderCircle
                size={34}
                className="mx-auto animate-spin text-cyan-400"
              />

              <p className="mt-4 font-bold text-white">
                Loading payments
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-[26px] border border-rose-400/20 bg-rose-400/[0.07] p-8 text-center">
            <p className="font-black text-rose-300">
              Unable to load
              payments
            </p>

            <p className="mt-2 text-sm text-rose-300/60">
              {error}
            </p>
          </div>
        ) : transactions.length ===
          0 ? (
          <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-[26px] border border-dashed border-white/10 bg-black/20">
            <div className="max-w-sm px-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <CreditCard
                  size={28}
                />
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                No payments yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/35">
                Completed PLATON
                payments will appear
                here automatically.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {transactions.map(
              (
                transaction
              ) => {
                const isSent =
                  transaction.sender_id ===
                  userId;

                const walletAddress =
                  isSent
                    ? transaction.receiver_wallet
                    : transaction.sender_wallet;

                const status =
                  transaction.status.toLowerCase();

                return (
                  <article
                    key={
                      transaction.id
                    }
                    className="group rounded-[24px] border border-white/[0.07] bg-black/20 p-5 transition duration-300 hover:border-white/15 hover:bg-white/[0.04]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                            isSent
                              ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-400"
                              : "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                          }`}
                        >
                          {isSent ? (
                            <ArrowUpRight
                              size={21}
                            />
                          ) : (
                            <ArrowDownLeft
                              size={21}
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-black text-white">
                              {isSent
                                ? "Payment sent"
                                : "Payment received"}
                            </h3>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.13em] ${
                                status ===
                                "completed"
                                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                                  : "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                              }`}
                            >
                              {
                                transaction.status
                              }
                            </span>
                          </div>

                          <p className="mt-2 break-all font-mono text-xs text-white/35">
                            {isSent
                              ? "To: "
                              : "From: "}

                            {shortenAddress(
                              walletAddress
                            )}
                          </p>

                          {transaction.note && (
                            <div className="mt-3 flex items-start gap-2">
                              <FileText
                                size={14}
                                className="mt-0.5 shrink-0 text-violet-400"
                              />

                              <p className="text-sm leading-5 text-white/45">
                                {
                                  transaction.note
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-end justify-between gap-5 border-t border-white/[0.06] pt-4 lg:block lg:border-0 lg:pt-0 lg:text-right">
                        <p
                          className={`text-xl font-black ${
                            isSent
                              ? "text-cyan-300"
                              : "text-emerald-400"
                          }`}
                        >
                          {isSent
                            ? "-"
                            : "+"}

                          {formatAmount(
                            transaction.amount
                          )}{" "}
                          π
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-xs text-white/25 lg:justify-end">
                          <Clock3
                            size={13}
                          />

                          {formatDate(
                            transaction.created_at
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}