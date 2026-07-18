"use client";

import {
  CheckCircle2,
  Copy,
  LoaderCircle,
  QrCode,
  Receipt,
  Wallet,
} from "lucide-react";

import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

type WalletData = {
  wallet_address: string;
};

export default function PaymentRequest() {
  const [wallet, setWallet] = useState<WalletData | null>(
    null
  );

  const [amount, setAmount] = useState("");

  const [note, setNote] = useState("");

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

      setError(
        "Unable to identify the current user."
      );

      setLoading(false);

      return;
    }

    const {
      data,
      error: walletError,
    } = await supabase
      .from("wallets")
      .select("wallet_address")
      .eq("user_id", user.id)
      .single();

    if (walletError || !data) {
      console.error(
        "Failed to load payment wallet:",
        walletError
      );

      setWallet(null);

      setError(
        "Unable to load your PLATON wallet."
      );

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

  const paymentPayload = useMemo(() => {
    if (!wallet) {
      return "";
    }

    const parameters =
      new URLSearchParams();

    const amountNumber =
      Number(amount);

    if (
      Number.isFinite(
        amountNumber
      ) &&
      amountNumber > 0
    ) {
      parameters.set(
        "amount",
        String(
          amountNumber
        )
      );
    }

    if (note.trim()) {
      parameters.set(
        "note",
        note.trim()
      );
    }

    const query =
      parameters.toString();

    return query
      ? `platon:${wallet.wallet_address}?${query}`
      : `platon:${wallet.wallet_address}`;
  }, [
    amount,
    note,
    wallet,
  ]);

  async function copyPaymentRequest() {
    if (!paymentPayload) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        paymentPayload
      );

      setCopied(true);

      toast.success(
        "Payment request copied."
      );

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (copyError) {
      console.error(
        "Failed to copy payment request:",
        copyError
      );

      toast.error(
        "Unable to copy payment request."
      );
    }
  }

  function formatAmount() {
    const value =
      Number(amount);

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return "Open amount";
    }

    return `${value.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 8,
      }
    )} π`;
  }

  if (loading) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
        <div className="flex min-h-[580px] items-center justify-center">
          <div className="text-center">
            <LoaderCircle
              size={36}
              className="mx-auto animate-spin text-cyan-400"
            />

            <p className="mt-4 font-bold text-white">
              Loading payment wallet
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!wallet || error) {
    return (
      <section className="rounded-[32px] border border-rose-400/15 bg-white/[0.045] p-8 text-center backdrop-blur-2xl">
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
          onClick={loadWallet}
          className="mt-6 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-400/[0.07] blur-[100px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-400">
              Payment Request
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
              Receive Payment
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Create a PLATON QR payment request and share it
              with another user.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-400">
            <Receipt
              size={22}
              strokeWidth={2.2}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <label
              htmlFor="request-amount"
              className="text-xs font-black uppercase tracking-[0.16em] text-white/35"
            >
              Requested Amount
            </label>

            <div className="relative mt-3">
              <input
                id="request-amount"
                type="number"
                min="0"
                step="0.00000001"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
                placeholder="Optional amount"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 pr-16 text-xl font-black text-white outline-none transition placeholder:text-sm placeholder:font-normal placeholder:text-white/20 focus:border-violet-400/50"
              />

              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xl font-black text-yellow-300">
                π
              </span>
            </div>

            <label
              htmlFor="request-note"
              className="mt-6 block text-xs font-black uppercase tracking-[0.16em] text-white/35"
            >
              Payment Description
            </label>

            <input
              id="request-note"
              type="text"
              value={note}
              onChange={(event) =>
                setNote(
                  event.target.value
                )
              }
              maxLength={120}
              placeholder="Optional payment description"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
            />

            <p className="mt-2 text-right text-xs text-white/20">
              {note.length}/120
            </p>

            <div className="mt-6 rounded-[24px] border border-white/[0.07] bg-black/20 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-white/35">
                  Request amount
                </span>

                <span className="font-black text-yellow-300">
                  {formatAmount()}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-white/35">
                  Network
                </span>

                <span className="font-black text-white">
                  PLATON
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-white/35">
                  Settlement
                </span>

                <span className="font-black text-emerald-400">
                  Instant
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-[28px] border border-white/10 bg-white p-5 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <QRCodeSVG
                value={paymentPayload}
                size={250}
                level="H"
                includeMargin
                bgColor="#FFFFFF"
                fgColor="#05070A"
                className="h-auto w-full"
              />
            </div>

            <div className="mt-5 rounded-[20px] border border-white/[0.07] bg-black/20 p-4">
              <div className="flex items-center gap-2">
                <QrCode
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30">
                  PLATON Payment QR
                </p>
              </div>

              <p className="mt-3 break-all font-mono text-xs leading-6 text-white/35">
                {paymentPayload}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="secondary"
            onClick={copyPaymentRequest}
          >
            {copied ? (
              <>
                <CheckCircle2 size={18} />

                <span className="ml-2">
                  Request Copied
                </span>
              </>
            ) : (
              <>
                <Copy size={18} />

                <span className="ml-2">
                  Copy Payment Request
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}