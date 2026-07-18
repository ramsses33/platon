"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  LoaderCircle,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";

import { useEffect } from "react";

type PaymentConfirmationModalProps = {
  open: boolean;
  recipientAddress: string;
  amount: number;
  note: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function shortenAddress(
  address: string
) {
  if (address.length <= 28) {
    return address;
  }

  return `${address.slice(
    0,
    15
  )}...${address.slice(-9)}`;
}

function formatAmount(
  amount: number
) {
  if (
    !Number.isFinite(amount)
  ) {
    return "0";
  }

  return amount.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    }
  );
}

export default function PaymentConfirmationModal({
  open,
  recipientAddress,
  amount,
  note,
  loading,
  onClose,
  onConfirm,
}: PaymentConfirmationModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
          "Escape" &&
        !loading
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    loading,
    onClose,
    open,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style
      .overflow = "hidden";

    return () => {
      document.body.style
        .overflow =
        previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-confirmation-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!loading) {
            onClose();
          }
        }}
        aria-label="Close payment confirmation"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0D12] shadow-[0_35px_120px_rgba(0,0,0,0.75)]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/[0.08] blur-[100px]" />

        <div className="relative border-b border-white/[0.07] px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={15}
                  className="text-emerald-400"
                />

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                  Secure Confirmation
                </p>
              </div>

              <h2
                id="payment-confirmation-title"
                className="mt-3 text-2xl font-black tracking-[-0.04em] text-white"
              >
                Confirm Payment
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Review all payment
                details before
                sending PLATON.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/45 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="rounded-[26px] border border-white/[0.08] bg-black/25 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <Wallet size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-white/30">
                  Recipient
                </p>

                <p className="mt-2 break-all font-mono text-sm leading-6 text-white">
                  {shortenAddress(
                    recipientAddress
                  )}
                </p>
              </div>
            </div>

            <div className="my-5 h-px bg-white/[0.07]" />

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-white/30">
                  Payment Amount
                </p>

                <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-yellow-300">
                  {formatAmount(
                    amount
                  )}{" "}
                  π
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                <ArrowRight
                  size={20}
                />
              </div>
            </div>
          </div>

          {note.trim() && (
            <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-violet-400/15 bg-violet-400/[0.07] p-4">
              <FileText
                size={17}
                className="mt-0.5 shrink-0 text-violet-400"
              />

              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-300">
                  Payment Note
                </p>

                <p className="mt-2 break-words text-sm leading-6 text-white/55">
                  {note.trim()}
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-yellow-400/15 bg-yellow-400/[0.06] p-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-yellow-300"
            />

            <p className="text-xs leading-6 text-yellow-100/55">
              PLATON payments are
              processed immediately.
              Check the recipient
              address and amount
              carefully before
              confirming.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-black text-white transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 px-5 py-4 text-sm font-black text-[#05070A] shadow-[0_14px_45px_rgba(250,204,21,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />

                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2
                    size={18}
                  />

                  Confirm Payment
                </>
              )}
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            <ShieldCheck
              size={14}
              className="text-emerald-400"
            />

            <p className="text-xs font-semibold text-white/25">
              Protected by PLATON
              secure settlement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}