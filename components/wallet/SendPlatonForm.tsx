"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

export default function SendPlatonForm() {
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshWallet = useWalletRefresh(
    (state) => state.refreshWallet
  );

  const amountNumber = Number(amount);

  const addressIsValid = useMemo(() => {
    return receiverAddress.trim().startsWith("platon_");
  }, [receiverAddress]);

  const amountIsValid = useMemo(() => {
    return Number.isFinite(amountNumber) && amountNumber > 0;
  }, [amountNumber]);

  const formIsValid =
    addressIsValid &&
    amountIsValid &&
    !loading;

  async function handleSend() {
    const normalizedAddress = receiverAddress.trim();

    if (!normalizedAddress || !amount) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!normalizedAddress.startsWith("platon_")) {
      toast.error("Invalid PLATON wallet address.");
      return;
    }

    if (
      !Number.isFinite(amountNumber) ||
      amountNumber <= 0
    ) {
      toast.error("Enter a valid transfer amount.");
      return;
    }

    setLoading(true);

    try {
      const { data: sessionData } =
        await supabase.auth.getSession();

      const accessToken =
        sessionData.session?.access_token;

      if (!accessToken) {
        toast.error("You are not logged in.");
        return;
      }

      const response = await fetch(
        "/api/wallet/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverAddress: normalizedAddress,
            amount: amountNumber,
            accessToken,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.error || "Transfer failed."
        );
        return;
      }

      toast.success(
        "Transfer completed successfully!"
      );

      setReceiverAddress("");
      setAmount("");

      refreshWallet();
    } catch (error) {
      console.error(
        "PLATON transfer failed:",
        error
      );

      toast.error(
        "Unable to complete the transfer."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/[0.08] blur-[90px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
              <ArrowUpRight
                size={22}
                strokeWidth={2.3}
              />
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400">
                PLATON Transfer
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                Send π
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Send PLATON instantly to another
                network wallet.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 sm:flex">
            <ShieldCheck
              size={14}
              className="text-emerald-400"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
              Secure
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="receiver-wallet"
              className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-white/35"
            >
              Receiver Wallet
            </label>

            <div className="relative">
              <Wallet
                size={18}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                id="receiver-wallet"
                type="text"
                placeholder="platon_..."
                value={receiverAddress}
                onChange={(event) =>
                  setReceiverAddress(
                    event.target.value
                  )
                }
                disabled={loading}
                autoComplete="off"
                className="w-full rounded-2xl border border-white/10 bg-black/25 py-4 pl-13 pr-12 font-mono text-sm text-white outline-none transition placeholder:text-white/20 focus:border-emerald-400/50 focus:bg-black/35 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {receiverAddress && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  {addressIsValid ? (
                    <CheckCircle2
                      size={18}
                      className="text-emerald-400"
                    />
                  ) : (
                    <span className="block h-2.5 w-2.5 rounded-full bg-rose-400" />
                  )}
                </div>
              )}
            </div>

            <p
              className={`mt-2 text-xs font-medium ${
                receiverAddress
                  ? addressIsValid
                    ? "text-emerald-400/80"
                    : "text-rose-400"
                  : "text-white/25"
              }`}
            >
              {receiverAddress
                ? addressIsValid
                  ? "Valid PLATON wallet format"
                  : "Address must start with platon_"
                : "Enter the destination wallet address"}
            </p>
          </div>

          <div>
            <label
              htmlFor="transfer-amount"
              className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-white/35"
            >
              Transfer Amount
            </label>

            <div className="relative">
              <input
                id="transfer-amount"
                type="number"
                min="0"
                step="0.00000001"
                placeholder="0.00"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 pr-16 text-lg font-black text-white outline-none transition placeholder:text-white/20 focus:border-emerald-400/50 focus:bg-black/35 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-lg font-black text-yellow-300">
                π
              </span>
            </div>

            <p className="mt-2 text-xs font-medium text-white/25">
              Enter the amount of PLATON to send
            </p>
          </div>

          <div className="rounded-[22px] border border-white/[0.07] bg-black/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-white/35">
                Network
              </span>

              <span className="text-sm font-bold text-white">
                PLATON
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-white/35">
                Settlement
              </span>

              <span className="text-sm font-bold text-emerald-400">
                Instant
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-white/35">
                Transfer fee
              </span>

              <span className="text-sm font-bold text-white">
                0 π
              </span>
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="flex items-center gap-3">
                <LoaderCircle
                  size={18}
                  className="animate-spin text-emerald-400"
                />

                <div>
                  <p className="font-bold text-emerald-300">
                    Processing transfer
                  </p>

                  <p className="mt-1 text-xs text-emerald-300/60">
                    Please do not close this page.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSend}
            disabled={!formIsValid}
            className="w-full"
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />

                <span className="ml-2">
                  Sending...
                </span>
              </>
            ) : (
              <>
                <ArrowUpRight size={18} />

                <span className="ml-2">
                  Send PLATON
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}