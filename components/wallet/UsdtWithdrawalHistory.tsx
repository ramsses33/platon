"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileSignature,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type WithdrawalStatus =
  | "REQUESTED"
  | "PROCESSING"
  | "SIGNED"
  | "BROADCAST"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

type UsdtWithdrawal = {
  id: string;

  network:
    | "SHASTA"
    | "MAINNET";

  destination_address:
    string;

  amount:
    string
    | number;

  fee:
    string
    | number;

  net_amount:
    string
    | number;

  status:
    WithdrawalStatus;

  txid:
    string
    | null;

  requested_at:
    string;

  signed_at:
    string
    | null;

  broadcast_at:
    string
    | null;

  completed_at:
    string
    | null;

  error_message:
    string
    | null;
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

  return new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits:
        2,

      maximumFractionDigits:
        6,
    }
  ).format(
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

  return new Intl.DateTimeFormat(
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
  ).format(
    date
  );
}

function shortenValue(
  value:
    string,

  startLength =
    8,

  endLength =
    7
) {
  if (
    value.length <=
    startLength +
      endLength +
      3
  ) {
    return value;
  }

  return `${value.slice(
    0,
    startLength
  )}...${value.slice(
    -endLength
  )}`;
}

function getStatusDetails(
  status:
    WithdrawalStatus
) {
  switch (
    status
  ) {
    case "COMPLETED":
      return {
        label:
          "Completed",

        icon:
          ShieldCheck,

        className:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
      };

    case "BROADCAST":
      return {
        label:
          "Broadcast",

        icon:
          ExternalLink,

        className:
          "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
      };

    case "SIGNED":
      return {
        label:
          "Signed",

        icon:
          FileSignature,

        className:
          "border-blue-400/20 bg-blue-400/10 text-blue-300",
      };

    case "PROCESSING":
      return {
        label:
          "Processing",

        icon:
          RefreshCw,

        className:
          "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
      };

    case "FAILED":
      return {
        label:
          "Failed",

        icon:
          TriangleAlert,

        className:
          "border-red-400/20 bg-red-400/10 text-red-400",
      };

    case "CANCELLED":
      return {
        label:
          "Cancelled",

        icon:
          XCircle,

        className:
          "border-white/10 bg-white/5 text-white/45",
      };

    default:
      return {
        label:
          "Requested",

        icon:
          Clock3,

        className:
          "border-violet-400/20 bg-violet-400/10 text-violet-300",
      };
  }
}

export default function UsdtWithdrawalHistory() {
  const [
    withdrawals,

    setWithdrawals,
  ] =
    useState<
      UsdtWithdrawal[]
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

  const loadWithdrawals =
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
              withdrawalsError,
          } =
            await supabase
              .from(
                "usdt_withdrawals"
              )
              .select(
                `
                  id,
                  network,
                  destination_address,
                  amount,
                  fee,
                  net_amount,
                  status,
                  txid,
                  requested_at,
                  signed_at,
                  broadcast_at,
                  completed_at,
                  error_message
                `
              )
              .eq(
                "user_id",
                user.id
              )
              .order(
                "requested_at",

                {
                  ascending:
                    false,
                }
              )
              .limit(
                20
              );

          if (
            withdrawalsError
          ) {
            throw withdrawalsError;
          }

          setWithdrawals(
            (
              data ??
              []
            ) as
              UsdtWithdrawal[]
          );
        } catch (
          loadError
        ) {
          const message =
            loadError instanceof
            Error
              ? loadError.message
              : "Unable to load USDT withdrawals.";

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
      void loadWithdrawals();
    },

    [
      loadWithdrawals,
    ]
  );

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl">
      <div className="flex flex-col gap-4 border-b border-white/[0.07] px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-400">
            TRC20 Withdrawals
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
            USDT Withdrawal History
          </h2>

          <p className="mt-2 text-sm text-white/35">
            Track outgoing USDT transfers from your PLATON wallet.
          </p>
        </div>

        <button
          type="button"
          onClick={
            () => {
              void loadWithdrawals(
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
                  className="h-28 animate-pulse rounded-[24px] border border-white/[0.06] bg-white/[0.03]"
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
                  Unable to load withdrawals
                </p>

                <p className="mt-1 text-sm text-red-200/60">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : withdrawals.length ===
          0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
              <ArrowUpRight
                size={
                  24
                }
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-white">
              No USDT withdrawals yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
              Your outgoing USDT TRC20 transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map(
              (
                withdrawal
              ) => {
                const status =
                  getStatusDetails(
                    withdrawal
                      .status
                  );

                const StatusIcon =
                  status.icon;

                const statusDate =
                  withdrawal
                    .completed_at ??
                  withdrawal
                    .broadcast_at ??
                  withdrawal
                    .signed_at ??
                  withdrawal
                    .requested_at;

                return (
                  <div
                    key={
                      withdrawal
                        .id
                    }
                    className="rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.05]"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                          <ArrowUpRight
                            size={
                              21
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-black text-white">
                              -
                              {formatAmount(
                                withdrawal
                                  .amount
                              )}{" "}
                              USDT
                            </p>

                            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-white/45">
                              {
                                withdrawal
                                  .network
                              }
                            </span>
                          </div>

                          <p className="mt-2 truncate font-mono text-xs text-white/35">
                            To:{" "}
                            {shortenValue(
                              withdrawal
                                .destination_address
                            )}
                          </p>

                          {withdrawal
                            .txid ? (
                            <p className="mt-1 truncate font-mono text-xs text-white/25">
                              TX:{" "}
                              {shortenValue(
                                withdrawal
                                  .txid,
                                9,
                                7
                              )}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center xl:justify-end">
                        <div className="grid grid-cols-2 gap-5 sm:flex sm:items-center">
                          <div className="sm:text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
                              Network Fee
                            </p>

                            <p className="mt-1 text-sm font-bold text-white/60">
                              {formatAmount(
                                withdrawal
                                  .fee
                              )}{" "}
                              USDT
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
                              Date
                            </p>

                            <p className="mt-1 text-sm font-bold text-white/60">
                              {formatDate(
                                statusDate
                              )}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] ${status.className}`}
                        >
                          <StatusIcon
                            size={
                              14
                            }
                            className={
                              withdrawal
                                .status ===
                              "PROCESSING"
                                ? "animate-spin"
                                : ""
                            }
                          />

                          {
                            status.label
                          }
                        </div>
                      </div>
                    </div>

                    {withdrawal
                      .error_message ? (
                      <div className="mt-4 rounded-2xl border border-red-400/15 bg-red-400/[0.07] px-4 py-3">
                        <p className="text-xs leading-5 text-red-200/70">
                          {
                            withdrawal
                              .error_message
                          }
                        </p>
                      </div>
                    ) : null}
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