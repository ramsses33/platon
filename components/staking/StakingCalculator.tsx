"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  CalendarDays,
  Coins,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Button from "@/components/ui/Button";

const STAKING_APR = 8.4;
const DAYS_PER_YEAR = 365;
const MONTH_ESTIMATE_DAYS = 30;

export default function StakingCalculator() {
  const [amount, setAmount] = useState("");
  const [estimatedAmount, setEstimatedAmount] =
    useState(0);

  const enteredAmount = useMemo(() => {
    const value = Number(amount);

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return 0;
    }

    return value;
  }, [amount]);

  const annualRate =
    STAKING_APR / 100;

  const monthlyReward =
    estimatedAmount *
    annualRate *
    (MONTH_ESTIMATE_DAYS /
      DAYS_PER_YEAR);

  const yearlyReward =
    estimatedAmount *
    annualRate;

  const totalAfterYear =
    estimatedAmount +
    yearlyReward;

  function estimateRewards() {
    setEstimatedAmount(
      enteredAmount
    );
  }

  function formatAmount(
    value: number
  ) {
    if (
      !Number.isFinite(value)
    ) {
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

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-yellow-400/[0.07] blur-[100px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
              Earnings Forecast
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
              Staking Calculator
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Estimate your potential PLATON rewards using
              the current network APR.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
            <Calculator
              size={22}
              strokeWidth={2.2}
            />
          </div>
        </div>

        <div className="mt-8">
          <label
            htmlFor="staking-calculator-amount"
            className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-white/35"
          >
            Amount to Stake
          </label>

          <div className="relative">
            <Coins
              size={19}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/25"
            />

            <input
              id="staking-calculator-amount"
              type="number"
              min="0"
              step="0.00000001"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black/25 py-4 pl-14 pr-16 text-xl font-black text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-black/35"
            />

            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xl font-black text-yellow-300">
              π
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-[26px] border border-white/[0.07] bg-black/20 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-white/35">
              Current APR
            </span>

            <span className="text-sm font-black text-emerald-400">
              {STAKING_APR}%
            </span>
          </div>

          <div className="mt-5 h-px bg-white/[0.07]" />

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <CalendarDays
                  size={18}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Monthly Reward
                </p>

                <p className="mt-1 text-xs text-white/25">
                  30-day estimate
                </p>
              </div>
            </div>

            <span className="text-lg font-black text-emerald-400">
              +
              {formatAmount(
                monthlyReward
              )}{" "}
              π
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
                <TrendingUp
                  size={18}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Yearly Reward
                </p>

                <p className="mt-1 text-xs text-white/25">
                  365-day estimate
                </p>
              </div>
            </div>

            <span className="text-lg font-black text-emerald-400">
              +
              {formatAmount(
                yearlyReward
              )}{" "}
              π
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-violet-400/15 bg-violet-400/[0.06] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-white/30">
                Estimated Balance
              </p>

              <p className="mt-2 text-sm text-white/35">
                After one year
              </p>
            </div>

            <p className="text-xl font-black text-white">
              {formatAmount(
                totalAfterYear
              )}{" "}
              π
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="secondary"
            onClick={
              estimateRewards
            }
            disabled={
              enteredAmount <= 0
            }
          >
            <Sparkles
              size={18}
            />

            <span className="ml-2">
              Estimate Earnings
            </span>
          </Button>
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-white/25">
          Calculations use a 365-day year and match the
          current staking reward formula. Future APR may
          change.
        </p>
      </div>
    </section>
  );
}