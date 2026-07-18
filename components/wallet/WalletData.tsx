"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Copy,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

type WalletDataType = {
  wallet_address: string;
  balance: number | string;
};

const PLATON_PRICE = 0.121;

export default function WalletData() {
  const [wallet, setWallet] = useState<WalletDataType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const refreshKey = useWalletRefresh(
    (state) => state.refreshKey
  );

  const loadWallet = useCallback(
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
        setWallet(null);
        setError("Unable to identify the current user.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const { data, error: walletError } = await supabase
        .from("wallets")
        .select("wallet_address, balance")
        .eq("user_id", user.id)
        .single();

      if (walletError || !data) {
        console.error(
          "Failed to load wallet:",
          walletError
        );

        setWallet(null);
        setError("Unable to load wallet data.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setWallet(data);
      setError("");
      setLoading(false);
      setRefreshing(false);
    },
    []
  );

  useEffect(() => {
    loadWallet();
  }, [loadWallet, refreshKey]);

  async function copyAddress() {
    if (!wallet) return;

    try {
      await navigator.clipboard.writeText(
        wallet.wallet_address
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (copyError) {
      console.error(
        "Failed to copy wallet address:",
        copyError
      );
    }
  }

  function formatBalance(value: number) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }

  function formatUsd(value: number) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (loading) {
    return (
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/[0.08] blur-[100px]" />

        <div className="relative animate-pulse">
          <div className="h-4 w-44 rounded-full bg-white/[0.07]" />

          <div className="mt-8 h-16 w-80 max-w-full rounded-2xl bg-white/[0.07]" />

          <div className="mt-5 h-8 w-40 rounded-xl bg-white/[0.07]" />

          <div className="mt-10 h-36 rounded-[26px] bg-white/[0.05]" />
        </div>
      </section>
    );
  }

  if (!wallet || error) {
    return (
      <section className="rounded-[36px] border border-rose-400/15 bg-white/[0.045] p-8 text-center backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-400">
          <Wallet size={28} />
        </div>

        <h2 className="mt-5 text-xl font-black text-white">
          Wallet unavailable
        </h2>

        <p className="mt-2 text-sm text-white/40">
          {error}
        </p>

        <button
          type="button"
          onClick={() => loadWallet()}
          className="mt-6 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          Try again
        </button>
      </section>
    );
  }

  const balance = Number(wallet.balance);
  const usdValue = balance * PLATON_PRICE;

  return (
    <section className="group relative overflow-hidden rounded-[40px] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/[0.11] via-white/[0.045] to-emerald-400/[0.08] p-6 backdrop-blur-2xl sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-28 -top-28 h-[380px] w-[380px] rounded-full bg-yellow-400/[0.1] blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[360px] w-[360px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
              <Wallet size={22} />
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-yellow-300">
                PLATON Wallet
              </p>

              <p className="mt-1 text-sm text-white/35">
                Official network balance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                Synchronized
              </span>
            </div>

            <button
              type="button"
              onClick={() => loadWallet(true)}
              disabled={refreshing}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/45 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Refresh wallet"
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

        <div className="mt-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/30">
            Available Balance
          </p>

          <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
            <h1 className="break-all text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              {formatBalance(balance)}
            </h1>

            <span className="pb-1 text-4xl font-black text-yellow-300 sm:text-5xl">
              π
            </span>
          </div>

          <p className="mt-5 text-2xl font-black text-emerald-400 sm:text-3xl">
            ≈ ${formatUsd(usdValue)}
          </p>

          <p className="mt-2 text-sm font-medium text-white/30">
            Estimated at ${PLATON_PRICE.toFixed(3)} per π
          </p>
        </div>

        <div className="mt-10 rounded-[28px] border border-white/[0.08] bg-black/25 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={17}
                  className="text-emerald-400"
                />

                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
                  Wallet Address
                </p>
              </div>

              <p className="mt-3 break-all font-mono text-sm font-semibold leading-7 text-emerald-300 sm:text-base">
                {wallet.wallet_address}
              </p>
            </div>

            <div className="shrink-0">
              <Button
                onClick={copyAddress}
                variant="secondary"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={18} />

                    <span className="ml-2">
                      Copied
                    </span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />

                    <span className="ml-2">
                      Copy Address
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}