"use client";

import {
  AlertTriangle,
  Check,
  Copy,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import { supabase } from "@/lib/supabase";

type DepositNetwork =
  | "SHASTA"
  | "MAINNET";

type DepositAddressResponse = {
  success: boolean;

  created: boolean;

  network: DepositNetwork;

  token: "USDT";

  standard: "TRC20";

  address: string;

  createdAt: string;
};

export default function UsdtDepositCard() {
  const [
    depositData,
    setDepositData,
  ] =
    useState<DepositAddressResponse | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    copied,
    setCopied,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const loadDepositAddress =
    useCallback(
      async () => {
        setLoading(
          true
        );

        setError("");

        try {
          const {
            data:
              sessionData,

            error:
              sessionError,
          } =
            await supabase.auth.getSession();

          if (
            sessionError
          ) {
            throw sessionError;
          }

          const accessToken =
            sessionData.session
              ?.access_token;

          if (
            !accessToken
          ) {
            setDepositData(
              null
            );

            setError(
              "Your session has expired. Please log in again."
            );

            return;
          }

          const response =
            await fetch(
              "/api/wallet/usdt/deposit-address",
              {
                method:
                  "POST",

                headers: {
                  Authorization:
                    `Bearer ${accessToken}`,
                },

                cache:
                  "no-store",
              }
            );

          const result =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              result.error ||
                "Unable to load deposit address."
            );
          }

          setDepositData(
            result as DepositAddressResponse
          );
        } catch (
          requestError
        ) {
          console.error(
            "USDT deposit address error:",
            requestError
          );

          const message =
            requestError instanceof
            Error
              ? requestError.message
              : "Unable to load deposit address.";

          setDepositData(
            null
          );

          setError(
            message
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(
    () => {
      void loadDepositAddress();
    },
    [
      loadDepositAddress,
    ]
  );

  async function copyAddress() {
    if (
      !depositData
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        depositData.address
      );

      setCopied(
        true
      );

      toast.success(
        "TRC20 address copied."
      );

      window.setTimeout(
        () => {
          setCopied(
            false
          );
        },
        1800
      );
    } catch (
      copyError
    ) {
      console.error(
        "Unable to copy address:",
        copyError
      );

      toast.error(
        "Unable to copy address."
      );
    }
  }

  const isTestnet =
    depositData?.network ===
    "SHASTA";

  return (
    <Card className="relative h-full overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/[0.08] blur-[110px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[3px] text-emerald-400">
              USDT Deposit
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Deposit USDT
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Send USDT through
              the TRON network to
              your personal
              PLATON deposit
              address.
            </p>
          </div>

          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <WalletCards
              size={24}
            />
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <NetworkItem
            label="Asset"
            value="USDT"
          />

          <NetworkItem
            label="Network"
            value="TRON"
          />

          <NetworkItem
            label="Standard"
            value="TRC20"
          />
        </div>

        {loading ? (
          <div className="mt-7 flex min-h-[260px] items-center justify-center rounded-[26px] border border-white/[0.08] bg-black/20">
            <div className="text-center">
              <LoaderCircle
                size={34}
                className="mx-auto animate-spin text-emerald-400"
              />

              <p className="mt-4 text-sm font-semibold text-white/40">
                Preparing your
                personal TRC20
                address...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-7 rounded-[26px] border border-red-400/20 bg-red-400/[0.07] p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle
                size={23}
                className="mt-0.5 shrink-0 text-red-300"
              />

              <div>
                <p className="font-black text-red-200">
                  Deposit address
                  unavailable
                </p>

                <p className="mt-2 text-sm leading-6 text-red-200/60">
                  {error}
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                void loadDepositAddress();
              }}
              className="mt-5 w-full"
            >
              <RefreshCw
                size={17}
              />

              Try Again
            </Button>
          </div>
        ) : depositData ? (
          <>
            <div className="mt-7 rounded-[26px] border border-white/[0.08] bg-black/25 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[2px] text-white/25">
                    Your Personal
                    Deposit Address
                  </p>

                  <p className="mt-2 text-xs font-semibold text-emerald-300">
                    {
                      depositData.network
                    }{" "}
                    · USDT TRC20
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                  <ShieldCheck
                    size={19}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                <p className="break-all font-mono text-sm font-bold leading-7 text-white sm:text-base">
                  {
                    depositData.address
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  void copyAddress();
                }}
                className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 text-sm font-black text-emerald-300 transition hover:border-emerald-400/35 hover:bg-emerald-400/15"
              >
                {copied ? (
                  <>
                    <Check
                      size={18}
                    />

                    Address Copied
                  </>
                ) : (
                  <>
                    <Copy
                      size={18}
                    />

                    Copy TRC20
                    Address
                  </>
                )}
              </button>
            </div>

            {isTestnet ? (
              <div className="mt-5 rounded-[22px] border border-yellow-400/20 bg-yellow-400/[0.08] p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={20}
                    className="mt-0.5 shrink-0 text-yellow-300"
                  />

                  <div>
                    <p className="text-sm font-black text-yellow-200">
                      SHASTA
                      Test Network
                    </p>

                    <p className="mt-2 text-sm leading-6 text-yellow-200/60">
                      This address
                      is currently
                      for testing
                      only. Do not
                      send real USDT
                      until PLATON
                      switches to
                      TRON Mainnet.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[22px] border border-emerald-400/20 bg-emerald-400/[0.07] p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />

                  <div>
                    <p className="text-sm font-black text-emerald-200">
                      TRON Mainnet
                    </p>

                    <p className="mt-2 text-sm leading-6 text-emerald-200/60">
                      Send only USDT
                      using the
                      TRC20 network.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 space-y-3 rounded-[22px] border border-white/[0.07] bg-white/[0.025] p-5">
              <DepositRule
                number="01"
                text="Send only USDT TRC20 to this address."
              />

              <DepositRule
                number="02"
                text="Do not send TRX or tokens from another network."
              />

              <DepositRule
                number="03"
                text="Your deposit will be detected and credited automatically."
              />
            </div>
          </>
        ) : null}
      </div>
    </Card>
  );
}

type NetworkItemProps = {
  label: string;
  value: string;
};

function NetworkItem({
  label,
  value,
}: NetworkItemProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-4">
      <p className="text-[10px] font-black uppercase tracking-[1.5px] text-white/25">
        {label}
      </p>

      <p className="mt-2 font-black text-white">
        {value}
      </p>
    </div>
  );
}

type DepositRuleProps = {
  number: string;
  text: string;
};

function DepositRule({
  number,
  text,
}: DepositRuleProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-[10px] font-black text-white/40">
        {number}
      </span>

      <p className="pt-1 text-sm leading-5 text-white/40">
        {text}
      </p>
    </div>
  );
}