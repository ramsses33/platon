"use client";

import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Copy,
  QrCode,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

type Wallet = {
  wallet_address: string;
};

export default function ReceiveCard() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const loadWallet = useCallback(async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setWallet(null);
      setError("Unable to identify the current user.");
      setLoading(false);
      return;
    }

    const { data, error: walletError } = await supabase
      .from("wallets")
      .select("wallet_address")
      .eq("user_id", user.id)
      .single();

    if (walletError || !data) {
      console.error(
        "Failed to load wallet address:",
        walletError
      );

      setWallet(null);
      setError("Unable to load your wallet address.");
      setLoading(false);
      return;
    }

    setWallet(data);
    setError("");
    setLoading(false);
  }, []);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

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

  if (loading) {
    return (
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

        <div className="relative animate-pulse">
          <div className="h-5 w-32 rounded-full bg-white/[0.07]" />

          <div className="mt-4 h-8 w-48 rounded-xl bg-white/[0.07]" />

          <div className="mx-auto mt-10 h-[230px] w-[230px] rounded-[28px] bg-white/[0.07]" />

          <div className="mt-8 h-20 rounded-[22px] bg-white/[0.06]" />

          <div className="mt-6 h-12 rounded-2xl bg-white/[0.07]" />
        </div>
      </section>
    );
  }

  if (!wallet || error) {
    return (
      <section className="flex min-h-[560px] flex-col items-center justify-center rounded-[32px] border border-rose-400/15 bg-white/[0.045] p-8 text-center backdrop-blur-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-400">
          <QrCode size={28} />
        </div>

        <h2 className="mt-5 text-xl font-black text-white">
          Wallet address unavailable
        </h2>

        <p className="mt-2 text-sm text-white/40">
          {error}
        </p>

        <button
          type="button"
          onClick={loadWallet}
          className="mt-6 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

      <div className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-emerald-400/[0.05] blur-[90px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
              <QrCode
                size={22}
                strokeWidth={2.3}
              />
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-400">
                Wallet Deposit
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                Receive π
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Scan the QR code or share your official
                PLATON wallet address.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 sm:flex">
            <ShieldCheck
              size={14}
              className="text-emerald-400"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
              Verified
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative rounded-[30px] border border-white/10 bg-white p-5 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
            <QRCodeSVG
              value={wallet.wallet_address}
              size={220}
              level="H"
              includeMargin
              bgColor="#FFFFFF"
              fgColor="#05070A"
            />

            <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border-4 border-white bg-[#05070A] text-xl font-black text-yellow-300">
              π
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[22px] border border-white/[0.07] bg-black/25 p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={16}
              className="text-emerald-400"
            />

            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
              Your PLATON Address
            </p>
          </div>

          <p className="mt-4 break-all font-mono text-sm font-semibold leading-7 text-emerald-300">
            {wallet.wallet_address}
          </p>
        </div>

        <div className="mt-6">
          <Button
            onClick={copyAddress}
            variant="secondary"
            className="w-full"
          >
            {copied ? (
              <>
                <CheckCircle2 size={18} />

                <span className="ml-2">
                  Address Copied
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

        <div className="mt-6 rounded-[22px] border border-yellow-400/10 bg-yellow-400/[0.05] p-4">
          <p className="text-center text-xs font-medium leading-5 text-yellow-200/60">
            Only send PLATON π to this address. Always
            verify the address before transferring funds.
          </p>
        </div>
      </div>
    </section>
  );
}