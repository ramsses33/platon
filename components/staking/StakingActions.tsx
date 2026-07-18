"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  Gift,
  Loader2,
  RefreshCw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type StakingMode =
  | "STAKE"
  | "UNSTAKE";

type StakingSummary = {
  walletBalance: number;
  availableWalletBalance: number;
  stakedBalance: number;
  accruedRewards: number;
  apr: number;
};

type StakingApiResponse = {
  success?: boolean;
  error?: string;
  data?: {
    walletBalance?: number | string;
    availableWalletBalance?: number | string;
    stakedBalance?: number | string;
    accruedRewards?: number | string;
    apr?: number | string;
  };
};

const EMPTY_SUMMARY: StakingSummary = {
  walletBalance: 0,
  availableWalletBalance: 0,
  stakedBalance: 0,
  accruedRewards: 0,
  apr: 8.4,
};

function normalizeSummary(
  data: StakingApiResponse["data"]
): StakingSummary {
  return {
    walletBalance: Number(
      data?.walletBalance ?? 0
    ),
    availableWalletBalance: Number(
      data?.availableWalletBalance ?? 0
    ),
    stakedBalance: Number(
      data?.stakedBalance ?? 0
    ),
    accruedRewards: Number(
      data?.accruedRewards ?? 0
    ),
    apr: Number(
      data?.apr ?? 8.4
    ),
  };
}

function formatAmount(
  value: number
) {
  if (!Number.isFinite(value)) {
    return "0.00";
  }

  return value.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }
  );
}

export default function StakingActions() {
  const [
    mode,
    setMode,
  ] = useState<StakingMode>(
    "STAKE"
  );

  const [
    amount,
    setAmount,
  ] = useState("");

  const [
    summary,
    setSummary,
  ] = useState<StakingSummary>(
    EMPTY_SUMMARY
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const enteredAmount =
    useMemo(
      () => {
        const value =
          Number(amount);

        if (
          !Number.isFinite(value) ||
          value <= 0
        ) {
          return 0;
        }

        return value;
      },
      [
        amount,
      ]
    );

  const maximumAmount =
    mode === "STAKE"
      ? summary.availableWalletBalance
      : summary.stakedBalance;

  const amountIsValid =
    enteredAmount > 0 &&
    enteredAmount <=
      maximumAmount;

  const loadSummary =
    useCallback(
      async (
        silent = false
      ) => {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        try {
          const {
            data: sessionData,
            error: sessionError,
          } =
            await supabase.auth.getSession();

          const accessToken =
            sessionData.session
              ?.access_token;

          if (
            sessionError ||
            !accessToken
          ) {
            throw new Error(
              "Please sign in to use staking."
            );
          }

          const response =
            await fetch(
              "/api/staking",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  action:
                    "SUMMARY",
                  accessToken,
                }),
              }
            );

          const result =
            (await response.json()) as StakingApiResponse;

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.error ||
                "Failed to load staking summary."
            );
          }

          setSummary(
            normalizeSummary(
              result.data
            )
          );
        } catch (
          loadError
        ) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "Failed to load staking summary.";

          console.error(
            "Staking summary error:",
            loadError
          );

          setError(message);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  useEffect(
    () => {
      loadSummary();

      const {
        data: authListener,
      } =
        supabase.auth.onAuthStateChange(
          (
            event
          ) => {
            if (
              event ===
                "SIGNED_IN" ||
              event ===
                "TOKEN_REFRESHED"
            ) {
              loadSummary(true);
            }

            if (
              event ===
              "SIGNED_OUT"
            ) {
              setSummary(
                EMPTY_SUMMARY
              );

              setError(
                "Please sign in to use staking."
              );
            }
          }
        );

      function handleWalletUpdated() {
        loadSummary(true);
      }

      window.addEventListener(
        "wallet-updated",
        handleWalletUpdated
      );

      return () => {
        authListener.subscription.unsubscribe();

        window.removeEventListener(
          "wallet-updated",
          handleWalletUpdated
        );
      };
    },
    [
      loadSummary,
    ]
  );

  function changeMode(
    nextMode: StakingMode
  ) {
    if (
      submitting
    ) {
      return;
    }

    setMode(nextMode);
    setAmount("");
    setError("");
  }

  function useMaximumAmount() {
    if (
      maximumAmount <= 0
    ) {
      return;
    }

    setAmount(
      maximumAmount.toFixed(8)
    );
  }

  async function submitStakingAction() {
    if (
      !amountIsValid ||
      submitting
    ) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      const accessToken =
        sessionData.session
          ?.access_token;

      if (
        sessionError ||
        !accessToken
      ) {
        throw new Error(
          "Please sign in to continue."
        );
      }

      const response =
        await fetch(
          "/api/staking",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action: mode,
              amount:
                enteredAmount,
              accessToken,
            }),
          }
        );

      const result =
        (await response.json()) as StakingApiResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "Staking operation failed."
        );
      }

      setAmount("");

      toast.success(
        mode === "STAKE"
          ? `${formatAmount(
              enteredAmount
            )} π staked successfully.`
          : `${formatAmount(
              enteredAmount
            )} π unstaked successfully.`
      );

      await loadSummary(true);

      window.dispatchEvent(
        new Event(
          "wallet-updated"
        )
      );

      window.dispatchEvent(
        new Event(
          "staking-updated"
        )
      );
    } catch (
      submitError
    ) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Staking operation failed.";

      console.error(
        "Staking action error:",
        submitError
      );

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.08] blur-[100px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-400">
              PLATON Staking
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
              Stake and Unstake π
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Lock PLATON to earn network rewards or return
              staked PLATON to your wallet.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadSummary(true)
            }
            disabled={
              refreshing ||
              submitting
            }
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/50 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Refresh staking balance"
          >
            <RefreshCw
              size={20}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
          </button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[22px] border border-white/[0.07] bg-black/20 p-4">
            <div className="flex items-center gap-2 text-white/30">
              <WalletCards
                size={16}
              />

              <span className="text-[10px] font-black uppercase tracking-[0.14em]">
                Available
              </span>
            </div>

            <p className="mt-3 truncate text-lg font-black text-white">
              {loading
                ? "—"
                : `${formatAmount(
                    summary.availableWalletBalance
                  )} π`}
            </p>
          </div>

          <div className="rounded-[22px] border border-violet-400/15 bg-violet-400/[0.06] p-4">
            <div className="flex items-center gap-2 text-violet-400">
              <Coins
                size={16}
              />

              <span className="text-[10px] font-black uppercase tracking-[0.14em]">
                Staked
              </span>
            </div>

            <p className="mt-3 truncate text-lg font-black text-white">
              {loading
                ? "—"
                : `${formatAmount(
                    summary.stakedBalance
                  )} π`}
            </p>
          </div>

          <div className="rounded-[22px] border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Gift
                size={16}
              />

              <span className="text-[10px] font-black uppercase tracking-[0.14em]">
                Rewards
              </span>
            </div>

            <p className="mt-3 truncate text-lg font-black text-emerald-400">
              {loading
                ? "—"
                : `+${formatAmount(
                    summary.accruedRewards
                  )} π`}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 rounded-2xl border border-white/[0.08] bg-black/25 p-1.5">
          <button
            type="button"
            onClick={() =>
              changeMode(
                "STAKE"
              )
            }
            disabled={
              submitting
            }
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
              mode === "STAKE"
                ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                : "text-white/35 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <ArrowDownToLine
              size={17}
            />

            Stake
          </button>

          <button
            type="button"
            onClick={() =>
              changeMode(
                "UNSTAKE"
              )
            }
            disabled={
              submitting
            }
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
              mode === "UNSTAKE"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "text-white/35 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <ArrowUpFromLine
              size={17}
            />

            Unstake
          </button>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <label
              htmlFor="staking-action-amount"
              className="text-xs font-black uppercase tracking-[0.16em] text-white/35"
            >
              {mode === "STAKE"
                ? "Amount to Stake"
                : "Amount to Unstake"}
            </label>

            <button
              type="button"
              onClick={
                useMaximumAmount
              }
              disabled={
                maximumAmount <= 0 ||
                submitting
              }
              className="text-xs font-black uppercase tracking-[0.12em] text-violet-400 transition hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Max
            </button>
          </div>

          <div className="relative">
            <Coins
              size={19}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/25"
            />

            <input
              id="staking-action-amount"
              type="number"
              min="0"
              step="0.00000001"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              disabled={
                loading ||
                submitting
              }
              onChange={(
                event
              ) =>
                setAmount(
                  event.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black/25 py-4 pl-14 pr-16 text-xl font-black text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-black/35 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xl font-black text-yellow-300">
              π
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 text-xs">
            <span className="text-white/25">
              Maximum
            </span>

            <span className="font-bold text-white/45">
              {formatAmount(
                maximumAmount
              )}{" "}
              π
            </span>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/[0.08] px-4 py-3 text-sm font-semibold text-rose-300">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={
            submitStakingAction
          }
          disabled={
            !amountIsValid ||
            submitting ||
            loading
          }
          className={`mt-6 flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40 ${
            mode === "STAKE"
              ? "bg-violet-500 text-white hover:bg-violet-400"
              : "bg-emerald-500 text-black hover:bg-emerald-400"
          }`}
        >
          {submitting ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              <span className="ml-2">
                Processing...
              </span>
            </>
          ) : mode ===
            "STAKE" ? (
            <>
              <ArrowDownToLine
                size={18}
              />

              <span className="ml-2">
                Stake π
              </span>
            </>
          ) : (
            <>
              <ArrowUpFromLine
                size={18}
              />

              <span className="ml-2">
                Unstake π
              </span>
            </>
          )}
        </button>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/25">
          <ShieldCheck
            size={14}
            className="text-emerald-400"
          />

          <span>
            Current APR:{" "}
            {formatAmount(
              summary.apr
            )}
            %
          </span>
        </div>
      </div>
    </section>
  );
}