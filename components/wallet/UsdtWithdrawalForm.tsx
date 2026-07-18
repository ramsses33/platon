"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  Wallet,
} from "lucide-react";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type WithdrawalResponse = {
  success?: boolean;

  error?: string;

  withdrawal?: {
    withdrawalId?: string;

    destinationAddress?: string;

    amount?: string | number;

    status?: string;
  };
};

function formatUsdt(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }
  ).format(value);
}

function createIdempotencyKey() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  throw new Error(
    "Secure withdrawal request IDs are not supported by this browser."
  );
}

export default function UsdtWithdrawalForm() {
  const [
    usdtBalance,
    setUsdtBalance,
  ] = useState(0);

  const [
    destinationAddress,
    setDestinationAddress,
  ] = useState("");

  const [
    amount,
    setAmount,
  ] = useState("");

  const [
    loadingBalance,
    setLoadingBalance,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<
    string | null
  >(null);

  const [
    idempotencyKey,
    setIdempotencyKey,
  ] = useState("");

  const loadBalance =
    useCallback(
      async () => {
        setLoadingBalance(
          true
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
            userData.user;

          if (
            !user
          ) {
            throw new Error(
              "User session was not found."
            );
          }

          const {
            data:
              walletData,

            error:
              walletError,
          } =
            await supabase
              .from(
                "wallets"
              )
              .select(
                "usdt_balance"
              )
              .eq(
                "user_id",
                user.id
              )
              .single();

          if (
            walletError
          ) {
            throw walletError;
          }

          const balance =
            Number(
              walletData
                ?.usdt_balance ??
                0
            );

          setUsdtBalance(
            Number.isFinite(
              balance
            )
              ? balance
              : 0
          );
        } catch (
          balanceError
        ) {
          console.error(
            "Unable to load USDT balance:",
            balanceError
          );

          setUsdtBalance(
            0
          );
        } finally {
          setLoadingBalance(
            false
          );
        }
      },

      []
    );

  useEffect(
    () => {
      setIdempotencyKey(
        createIdempotencyKey()
      );

      void loadBalance();
    },

    [
      loadBalance,
    ]
  );

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      submitting
    ) {
      return;
    }

    setError(
      null
    );

    setSuccessMessage(
      null
    );

    const normalizedAddress =
      destinationAddress.trim();

    const normalizedAmount =
      amount.trim();

    if (
      !/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(
        normalizedAddress
      )
    ) {
      setError(
        "Enter a valid TRON TRC20 address."
      );

      return;
    }

    if (
      !/^(?:0|[1-9]\d{0,23})(?:\.\d{1,6})?$/.test(
        normalizedAmount
      )
    ) {
      setError(
        "Enter a valid USDT amount with up to 6 decimal places."
      );

      return;
    }

    const numericAmount =
      Number(
        normalizedAmount
      );

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      setError(
        "Withdrawal amount must be greater than zero."
      );

      return;
    }

    if (
      numericAmount >
      usdtBalance
    ) {
      setError(
        "Insufficient USDT balance."
      );

      return;
    }

    if (
      !idempotencyKey
    ) {
      setError(
        "Withdrawal request ID is not ready. Please try again."
      );

      return;
    }

    setSubmitting(
      true
    );

    try {
      const {
        data:
          sessionData,

        error:
          sessionError,
      } =
        await supabase
          .auth
          .getSession();

      if (
        sessionError
      ) {
        throw sessionError;
      }

      const accessToken =
        sessionData
          .session
          ?.access_token;

      if (
        !accessToken
      ) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      const response =
        await fetch(
          "/api/wallet/usdt/withdraw",

          {
            method:
              "POST",

            headers: {
              Authorization:
                `Bearer ${accessToken}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                destinationAddress:
                  normalizedAddress,

                amount:
                  normalizedAmount,

                idempotencyKey,
              }),
          }
        );

      const result =
        (
          await response.json()
        ) as
          WithdrawalResponse;

      if (
        !response.ok ||
        result.success !==
          true
      ) {
        throw new Error(
          result.error ??
            "USDT withdrawal request failed."
        );
      }

      setSuccessMessage(
        `${formatUsdt(
          numericAmount
        )} USDT withdrawal request created successfully.`
      );

      setDestinationAddress(
        ""
      );

      setAmount(
        ""
      );

      setIdempotencyKey(
        createIdempotencyKey()
      );

      await loadBalance();
    } catch (
      submitError
    ) {
      const message =
        submitError instanceof
        Error
          ? submitError.message
          : "USDT withdrawal request failed.";

      setError(
        message
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  function useMaximumBalance() {
    if (
      usdtBalance <= 0
    ) {
      setAmount(
        ""
      );

      return;
    }

    setAmount(
      String(
        usdtBalance
      )
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-400">
              TRON TRC20
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
              Withdraw USDT
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
              Send USDT from your PLATON balance to an external TRON wallet.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07] px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300/60">
              Available
            </p>

            <div className="mt-1 flex items-center gap-2">
              <Wallet
                size={16}
                className="text-cyan-400"
              />

              <p className="text-lg font-black text-white">
                {loadingBalance
                  ? "..."
                  : formatUsdt(
                      usdtBalance
                    )}{" "}
                USDT
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-7 space-y-5"
        >
          <div>
            <label
              htmlFor="usdt-withdraw-address"
              className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40"
            >
              Destination TRC20 Address
            </label>

            <input
              id="usdt-withdraw-address"
              type="text"
              value={
                destinationAddress
              }
              onChange={
                (
                  event
                ) => {
                  setDestinationAddress(
                    event
                      .target
                      .value
                  );

                  setError(
                    null
                  );

                  setSuccessMessage(
                    null
                  );
                }
              }
              placeholder="T..."
              autoComplete="off"
              spellCheck={false}
              disabled={
                submitting
              }
              className="mt-3 h-14 w-full rounded-2xl border border-white/[0.09] bg-black/20 px-4 font-mono text-sm text-white outline-none transition placeholder:text-white/15 focus:border-cyan-400/40 focus:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="usdt-withdraw-amount"
                className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40"
              >
                Amount
              </label>

              <button
                type="button"
                onClick={
                  useMaximumBalance
                }
                disabled={
                  submitting ||
                  loadingBalance
                }
                className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-400 transition hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Use Max
              </button>
            </div>

            <div className="relative mt-3">
              <input
                id="usdt-withdraw-amount"
                type="text"
                inputMode="decimal"
                value={
                  amount
                }
                onChange={
                  (
                    event
                  ) => {
                    const value =
                      event
                        .target
                        .value;

                    if (
                      value ===
                        "" ||
                      /^\d*(?:\.\d{0,6})?$/.test(
                        value
                      )
                    ) {
                      setAmount(
                        value
                      );

                      setError(
                        null
                      );

                      setSuccessMessage(
                        null
                      );
                    }
                  }
                }
                placeholder="0.00"
                autoComplete="off"
                disabled={
                  submitting
                }
                className="h-14 w-full rounded-2xl border border-white/[0.09] bg-black/20 px-4 pr-20 text-lg font-black text-white outline-none transition placeholder:text-white/15 focus:border-cyan-400/40 focus:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-[0.12em] text-white/35">
                USDT
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-400/15 bg-yellow-400/[0.06] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-yellow-300"
              />

              <div>
                <p className="text-sm font-black text-yellow-100">
                  TRON network only
                </p>

                <p className="mt-1 text-xs leading-5 text-yellow-100/45">
                  Send only to a USDT TRC20 address. Other networks are not supported.
                </p>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
              <div className="flex items-start gap-3">
                <TriangleAlert
                  size={19}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <p className="text-sm font-semibold leading-6 text-red-200">
                  {error}
                </p>
              </div>
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <p className="text-sm font-semibold leading-6 text-emerald-200">
                  {successMessage}
                </p>
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={
              submitting ||
              loadingBalance ||
              usdtBalance <= 0
            }
            className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-400 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submitting ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Creating Request
              </>
            ) : (
              <>
                <ArrowUpRight
                  size={18}
                />

                Withdraw USDT
              </>
            )}
          </button>

          <button
            type="button"
            onClick={
              () => {
                void loadBalance();
              }
            }
            disabled={
              loadingBalance ||
              submitting
            }
            className="inline-flex w-full items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-white/30 transition hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw
              size={13}
              className={
                loadingBalance
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh Balance
          </button>
        </form>
      </div>
    </section>
  );
}