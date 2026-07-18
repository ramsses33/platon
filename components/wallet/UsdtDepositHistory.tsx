"use client";

import {
  ArrowDownToLine,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "@/lib/supabase";

type DepositStatus =
  | "DETECTED"
  | "CONFIRMED"
  | "CREDITED"
  | "SWEEP_PENDING"
  | "SWEPT"
  | "FAILED";

type UsdtDeposit = {
  id:
    string;

  network:
    "SHASTA"
    | "MAINNET";

  txid:
    string;

  amount:
    string
    | number;

  status:
    DepositStatus;

  block_timestamp:
    string
    | null;

  credited_at:
    string
    | null;

  swept_at:
    string
    | null;

  created_at:
    string;
};

function formatAmount(
  value:
    string
    | number
) {
  const amount =
    Number(
      value
    );

  if (
    !Number.isFinite(
      amount
    )
  ) {
    return "0.00";
  }

  return new Intl
    .NumberFormat(
      "en-US",

      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          6,
      }
    )
    .format(
      amount
    );
}

function formatDate(
  value:
    string
    | null
) {
  if (
    !value
  ) {
    return "—";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl
    .DateTimeFormat(
      "en-GB",

      {
        day:
          "2-digit",

        month:
          "short",

        year:
          "numeric",

        hour:
          "2-digit",

        minute:
          "2-digit",
      }
    )
    .format(
      date
    );
}

function shortenTxid(
  txid:
    string
) {
  if (
    txid.length <=
    18
  ) {
    return txid;
  }

  return (
    `${txid.slice(
      0,
      9
    )}...${txid.slice(
      -7
    )}`
  );
}

function getStatusStyle(
  status:
    DepositStatus
) {
  switch (
    status
  ) {
    case "SWEPT":
      return {
        label:
          "Completed",

        className:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",

        icon:
          ShieldCheck,
      };

    case "CREDITED":
      return {
        label:
          "Credited",

        className:
          "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",

        icon:
          CheckCircle2,
      };

    case "SWEEP_PENDING":
      return {
        label:
          "Treasury Pending",

        className:
          "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",

        icon:
          Clock3,
      };

    case "CONFIRMED":
      return {
        label:
          "Confirmed",

        className:
          "border-blue-400/20 bg-blue-400/10 text-blue-400",

        icon:
          CheckCircle2,
      };

    case "FAILED":
      return {
        label:
          "Failed",

        className:
          "border-red-400/20 bg-red-400/10 text-red-400",

        icon:
          TriangleAlert,
      };

    default:
      return {
        label:
          "Detected",

        className:
          "border-white/10 bg-white/5 text-white/50",

        icon:
          Clock3,
      };
  }
}

export default function UsdtDepositHistory() {
  const [
    deposits,

    setDeposits,
  ] =
    useState<
      UsdtDeposit[]
    >(
      []
    );

  const [
    loading,

    setLoading,
  ] =
    useState(
      true
    );

  const [
    refreshing,

    setRefreshing,
  ] =
    useState(
      false
    );

  const [
    error,

    setError,
  ] =
    useState<
      string
      | null
    >(
      null
    );

  const loadDeposits =
    useCallback(
      async (
        isRefresh =
          false
      ) => {
        if (
          isRefresh
        ) {
          setRefreshing(
            true
          );
        } else {
          setLoading(
            true
          );
        }

        setError(
          null
        );

        try {
          const {
            data:
              userData,

            error:
              userError,
          } =
            await supabase
              .auth
              .getUser();

          if (
            userError
          ) {
            throw userError;
          }

          const user =
            userData
              .user;

          if (
            !user
          ) {
            throw new Error(
              "User session was not found."
            );
          }

          const {
            data,

            error:
              depositsError,
          } =
            await supabase
              .from(
                "usdt_deposits"
              )
              .select(
                `
                  id,
                  network,
                  txid,
                  amount,
                  status,
                  block_timestamp,
                  credited_at,
                  swept_at,
                  created_at
                `
              )
              .eq(
                "user_id",
                user.id
              )
              .order(
                "created_at",

                {
                  ascending:
                    false,
                }
              )
              .limit(
                20
              );

          if (
            depositsError
          ) {
            throw depositsError;
          }

          setDeposits(
            (
              data ??
              []
            ) as
              UsdtDeposit[]
          );
        } catch (
          loadError
        ) {
          const message =
            loadError instanceof
            Error
              ? loadError.message
              : "Unable to load USDT deposits.";

          setError(
            message
          );
        } finally {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      },

      []
    );

  useEffect(
    () => {
      void loadDeposits();
    },

    [
      loadDeposits,
    ]
  );

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl">
      <div className="flex flex-col gap-4 border-b border-white/[0.07] px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400">
            TRC20 Deposits
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
            USDT Deposit History
          </h2>

          <p className="mt-2 text-sm text-white/35">
            Confirmed deposits credited to your PLATON wallet.
          </p>
        </div>

        <button
          type="button"
          onClick={
            () => {
              void loadDeposits(
                true
              );
            }
          }
          disabled={
            refreshing
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-xs font-black uppercase tracking-[0.14em] text-white/65 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={
              15
            }
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from(
              {
                length:
                  3,
              }
            ).map(
              (
                _,

                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="h-24 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]"
                />
              )
            )}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
            <div className="flex items-start gap-3">
              <TriangleAlert
                size={
                  20
                }
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <p className="font-black text-red-300">
                  Unable to load deposits
                </p>

                <p className="mt-1 text-sm text-red-200/60">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : deposits.length ===
          0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
              <ArrowDownToLine
                size={
                  24
                }
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-white">
              No USDT deposits yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
              Incoming USDT TRC20 deposits will appear here after confirmation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {deposits.map(
              (
                deposit
              ) => {
                const status =
                  getStatusStyle(
                    deposit
                      .status
                  );

                const StatusIcon =
                  status
                    .icon;

                return (
                  <div
                    key={
                      deposit
                        .id
                    }
                    className="rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.05]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                          <ArrowDownToLine
                            size={
                              21
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-black text-white">
                              +
                              {formatAmount(
                                deposit
                                  .amount
                              )}{" "}
                              USDT
                            </p>

                            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-white/45">
                              {
                                deposit
                                  .network
                              }
                            </span>
                          </div>

                          <p className="mt-2 truncate font-mono text-xs text-white/35">
                            TX:{" "}
                            {shortenTxid(
                              deposit
                                .txid
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                        <div className="sm:text-right">
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
                            Date
                          </p>

                          <p className="mt-1 text-sm font-bold text-white/60">
                            {formatDate(
                              deposit
                                .block_timestamp ??
                                deposit
                                  .created_at
                            )}
                          </p>
                        </div>

                        <div
                          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] ${status.className}`}
                        >
                          <StatusIcon
                            size={
                              14
                            }
                          />

                          {
                            status
                              .label
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}