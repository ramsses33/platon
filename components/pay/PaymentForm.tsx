"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowUpRight,
  CheckCircle2,
  LoaderCircle,
  QrCode,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import PaymentConfirmationModal from "@/components/pay/PaymentConfirmationModal";

import { supabase } from "@/lib/supabase";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

type PaymentQrData = {
  address: string;
  amount?: string;
  note?: string;
};

type PaymentQrEvent = CustomEvent<{
  value?: string;
}>;

type PaymentResponse = {
  success?: boolean;
  error?: string;
};

function parsePaymentQr(
  rawValue: string
): PaymentQrData | null {
  const value = rawValue.trim();

  if (!value) {
    return null;
  }

  if (value.startsWith("{")) {
    try {
      const parsed = JSON.parse(value) as {
        address?: unknown;
        wallet?: unknown;
        receiverAddress?: unknown;
        recipient?: unknown;
        amount?: unknown;
        note?: unknown;
        description?: unknown;
      };

      const addressValue =
        parsed.address ??
        parsed.wallet ??
        parsed.receiverAddress ??
        parsed.recipient;

      if (
        typeof addressValue !== "string" ||
        !addressValue
          .trim()
          .startsWith("platon_")
      ) {
        return null;
      }

      const amountValue =
        parsed.amount !== undefined
          ? String(parsed.amount)
          : undefined;

      const noteValue =
        typeof parsed.note === "string"
          ? parsed.note
          : typeof parsed.description === "string"
            ? parsed.description
            : undefined;

      return {
        address: addressValue.trim(),
        amount: amountValue,
        note: noteValue,
      };
    } catch {
      return null;
    }
  }

  if (value.startsWith("platon_")) {
    return {
      address: value,
    };
  }

  if (
    value
      .toLowerCase()
      .startsWith("platon:")
  ) {
    try {
      const payload = value.slice(
        "platon:".length
      );

      let address = "";

      let amount:
        | string
        | undefined;

      let note:
        | string
        | undefined;

      if (
        payload.startsWith("//")
      ) {
        const url = new URL(value);

        address =
          url.searchParams.get(
            "address"
          ) ??
          url.searchParams.get(
            "recipient"
          ) ??
          url.searchParams.get(
            "receiver"
          ) ??
          "";

        if (!address) {
          const pathAddress =
            url.pathname.replace(
              /^\/+/,
              ""
            );

          if (
            pathAddress.startsWith(
              "platon_"
            )
          ) {
            address =
              pathAddress;
          }
        }

        if (
          !address &&
          url.hostname.startsWith(
            "platon_"
          )
        ) {
          address =
            url.hostname;
        }

        amount =
          url.searchParams.get(
            "amount"
          ) ?? undefined;

        note =
          url.searchParams.get(
            "note"
          ) ??
          url.searchParams.get(
            "description"
          ) ??
          undefined;
      } else {
        const [
          addressPart,
          queryString,
        ] = payload.split("?");

        address =
          decodeURIComponent(
            addressPart.replace(
              /^\/+/,
              ""
            )
          );

        const parameters =
          new URLSearchParams(
            queryString ?? ""
          );

        amount =
          parameters.get(
            "amount"
          ) ?? undefined;

        note =
          parameters.get(
            "note"
          ) ??
          parameters.get(
            "description"
          ) ??
          undefined;
      }

      if (
        !address.startsWith(
          "platon_"
        )
      ) {
        return null;
      }

      return {
        address,
        amount,
        note,
      };
    } catch {
      return null;
    }
  }

  return null;
}

export default function PaymentForm() {
  const [
    recipientAddress,
    setRecipientAddress,
  ] = useState("");

  const [amount, setAmount] =
    useState("");

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    confirmationOpen,
    setConfirmationOpen,
  ] = useState(false);

  const refreshWallet =
    useWalletRefresh(
      (state) =>
        state.refreshWallet
    );

  const amountNumber =
    Number(amount);

  const addressIsValid =
    useMemo(() => {
      return recipientAddress
        .trim()
        .startsWith(
          "platon_"
        );
    }, [
      recipientAddress,
    ]);

  const amountIsValid =
    useMemo(() => {
      return (
        Number.isFinite(
          amountNumber
        ) &&
        amountNumber > 0
      );
    }, [
      amountNumber,
    ]);

  const formIsValid =
    addressIsValid &&
    amountIsValid &&
    !loading;

  const closeConfirmation =
    useCallback(() => {
      if (loading) {
        return;
      }

      setConfirmationOpen(
        false
      );
    }, [loading]);

  useEffect(() => {
    function handleQrPayment(
      event: Event
    ) {
      const customEvent =
        event as PaymentQrEvent;

      const rawValue =
        customEvent.detail
          ?.value;

      if (!rawValue) {
        toast.error(
          "QR payment data is empty."
        );

        return;
      }

      const paymentData =
        parsePaymentQr(
          rawValue
        );

      if (!paymentData) {
        toast.error(
          "This is not a valid PLATON payment QR code."
        );

        return;
      }

      setRecipientAddress(
        paymentData.address
      );

      if (
        paymentData.amount
      ) {
        const parsedAmount =
          Number(
            paymentData.amount
          );

        if (
          Number.isFinite(
            parsedAmount
          ) &&
          parsedAmount > 0
        ) {
          setAmount(
            String(
              parsedAmount
            )
          );
        } else {
          setAmount("");
        }
      } else {
        setAmount("");
      }

      setNote(
        paymentData.note
          ?.slice(
            0,
            120
          ) ?? ""
      );

      toast.success(
        "Payment details loaded."
      );
    }

    window.addEventListener(
      "platon-payment-qr-scanned",
      handleQrPayment
    );

    return () => {
      window.removeEventListener(
        "platon-payment-qr-scanned",
        handleQrPayment
      );
    };
  }, []);

  function openConfirmation() {
    const normalizedAddress =
      recipientAddress.trim();

    if (
      !normalizedAddress ||
      !amount
    ) {
      toast.error(
        "Please enter recipient and amount."
      );

      return;
    }

    if (!addressIsValid) {
      toast.error(
        "Invalid PLATON wallet address."
      );

      return;
    }

    if (!amountIsValid) {
      toast.error(
        "Enter a valid payment amount."
      );

      return;
    }

    setConfirmationOpen(
      true
    );
  }

  async function confirmPayment() {
    const normalizedAddress =
      recipientAddress.trim();

    if (
      !normalizedAddress ||
      !addressIsValid ||
      !amountIsValid
    ) {
      setConfirmationOpen(
        false
      );

      toast.error(
        "Payment details are invalid."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data:
          sessionData,
      } =
        await supabase.auth.getSession();

      const accessToken =
        sessionData.session
          ?.access_token;

      if (!accessToken) {
        toast.error(
          "You are not logged in."
        );

        return;
      }

      const response =
        await fetch(
          "/api/wallet/send",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  receiverAddress:
                    normalizedAddress,

                  amount:
                    amountNumber,

                  accessToken,

                  transactionType:
                    "PAYMENT",

                  note:
                    note.trim(),
                }
              ),
          }
        );

      const result =
        (await response
          .json()
          .catch(() => {
            return {};
          })) as PaymentResponse;

      if (!response.ok) {
        toast.error(
          result.error ||
            "Payment failed."
        );

        return;
      }

      setConfirmationOpen(
        false
      );

      setRecipientAddress("");

      setAmount("");

      setNote("");

      refreshWallet();

      window.dispatchEvent(
        new CustomEvent(
          "platon-payment-completed"
        )
      );

      toast.success(
        "Payment completed successfully!"
      );
    } catch (error) {
      console.error(
        "PLATON payment failed:",
        error
      );

      toast.error(
        "Unable to complete payment."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-[100px]" />

        <div className="relative">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-400">
                Official Payment
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                Send PLATON Payment
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                Pay another wallet or
                merchant instantly
                through the official
                PLATON Network.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
              <ShieldCheck
                size={14}
                className="text-emerald-400"
              />

              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-400">
                Secure Payment
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/[0.08] bg-black/20 p-5 sm:p-6">
            <div>
              <label
                htmlFor="payment-recipient"
                className="text-xs font-black uppercase tracking-[0.16em] text-white/35"
              >
                Recipient Address
              </label>

              <div className="relative mt-3">
                <Wallet
                  size={18}
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  id="payment-recipient"
                  type="text"
                  value={
                    recipientAddress
                  }
                  onChange={(
                    event
                  ) =>
                    setRecipientAddress(
                      event
                        .target
                        .value
                    )
                  }
                  disabled={
                    loading
                  }
                  placeholder="platon_..."
                  autoComplete="off"
                  className="w-full rounded-2xl border border-white/10 bg-black/25 py-4 pl-14 pr-12 font-mono text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                />

                {recipientAddress && (
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
                  recipientAddress
                    ? addressIsValid
                      ? "text-emerald-400"
                      : "text-rose-400"
                    : "text-white/25"
                }`}
              >
                {recipientAddress
                  ? addressIsValid
                    ? "Valid PLATON wallet address"
                    : "Address must start with platon_"
                  : "Enter recipient wallet address"}
              </p>
            </div>

            <div className="mt-6">
              <label
                htmlFor="payment-amount"
                className="text-xs font-black uppercase tracking-[0.16em] text-white/35"
              >
                Payment Amount
              </label>

              <div className="relative mt-3">
                <input
                  id="payment-amount"
                  type="number"
                  min="0"
                  step="0.00000001"
                  value={amount}
                  onChange={(
                    event
                  ) =>
                    setAmount(
                      event
                        .target
                        .value
                    )
                  }
                  disabled={
                    loading
                  }
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 pr-16 text-xl font-black text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xl font-black text-yellow-300">
                  π
                </span>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="payment-note"
                className="text-xs font-black uppercase tracking-[0.16em] text-white/35"
              >
                Payment Note
              </label>

              <input
                id="payment-note"
                type="text"
                value={note}
                onChange={(
                  event
                ) =>
                  setNote(
                    event
                      .target
                      .value
                  )
                }
                disabled={
                  loading
                }
                maxLength={
                  120
                }
                placeholder="Optional payment description"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="mt-2 text-right text-xs text-white/20">
                {note.length}
                /120
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] px-4 py-3">
              <QrCode
                size={16}
                className="shrink-0 text-cyan-400"
              />

              <p className="text-xs leading-5 text-cyan-200/50">
                Scanned PLATON QR
                details will be loaded
                into this form
                automatically.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/[0.07] bg-black/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-white/35">
                Network
              </span>

              <span className="font-bold text-white">
                PLATON
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-sm text-white/35">
                Settlement
              </span>

              <span className="font-bold text-emerald-400">
                Instant
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-sm text-white/35">
                Payment fee
              </span>

              <span className="font-bold text-white">
                0 π
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={
                openConfirmation
              }
              disabled={
                !formIsValid
              }
            >
              <ArrowUpRight
                size={18}
              />

              <span className="ml-2">
                Review Payment
              </span>
            </Button>
          </div>
        </div>
      </section>

      <PaymentConfirmationModal
        open={
          confirmationOpen
        }
        recipientAddress={
          recipientAddress.trim()
        }
        amount={
          amountNumber
        }
        note={note}
        loading={
          loading
        }
        onClose={
          closeConfirmation
        }
        onConfirm={() => {
          void confirmPayment();
        }}
      />
    </>
  );
}