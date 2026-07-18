"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

type Mode = "BUY" | "SELL";

type Wallet = {
  balance: number;
  usdt_balance: number;
  locked_platon: number;
  locked_usdt: number;
};

type MarketSettings = {
  buy_spread: number;
  sell_spread: number;
};

const percentageOptions = [
  25,
  50,
  75,
  100,
];

const balanceFormatter =
  new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    }
  );

const totalFormatter =
  new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }
  );

export default function BuySellPanel() {
  const [
    mode,
    setMode,
  ] =
    useState<Mode>(
      "BUY"
    );

  const [
    amount,
    setAmount,
  ] =
    useState("");

  const [
    officialPrice,
    setOfficialPrice,
  ] =
    useState(0);

  const [
    settings,
    setSettings,
  ] =
    useState<MarketSettings>({
      buy_spread: 1,
      sell_spread: 1,
    });

  const [
    settingsLoaded,
    setSettingsLoaded,
  ] =
    useState(false);

  const [
    wallet,
    setWallet,
  ] =
    useState<Wallet | null>(
      null
    );

  const [
    userId,
    setUserId,
  ] =
    useState<string | null>(
      null
    );

  const [
    selectedPercentage,
    setSelectedPercentage,
  ] =
    useState<
      number | null
    >(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    initializing,
    setInitializing,
  ] =
    useState(true);

  const numericAmount =
    Number(
      amount || 0
    );

  const availablePlaton =
    useMemo(
      () => {
        if (!wallet) {
          return 0;
        }

        return Math.max(
          0,
          Number(
            wallet.balance
          ) -
            Number(
              wallet.locked_platon
            )
        );
      },
      [
        wallet,
      ]
    );

  const availableUsdt =
    useMemo(
      () => {
        if (!wallet) {
          return 0;
        }

        return Math.max(
          0,
          Number(
            wallet.usdt_balance
          ) -
            Number(
              wallet.locked_usdt
            )
        );
      },
      [
        wallet,
      ]
    );

  const limitPrice =
    useMemo(
      () => {
        if (
          !settingsLoaded ||
          !officialPrice ||
          officialPrice <= 0
        ) {
          return 0;
        }

        const calculatedPrice =
          mode === "BUY"
            ? officialPrice *
              (
                1 +
                settings.sell_spread /
                  100
              )
            : officialPrice *
              (
                1 -
                settings.buy_spread /
                  100
              );

        return Number(
          calculatedPrice.toFixed(
            8
          )
        );
      },
      [
        mode,
        officialPrice,
        settings,
        settingsLoaded,
      ]
    );

  const total =
    useMemo(
      () => {
        if (
          !Number.isFinite(
            numericAmount
          ) ||
          numericAmount <= 0
        ) {
          return 0;
        }

        return Number(
          (
            numericAmount *
            limitPrice
          ).toFixed(
            8
          )
        );
      },
      [
        numericAmount,
        limitPrice,
      ]
    );

  const loadData =
    useCallback(
      async (
        showInitializing =
          true
      ) => {
        if (
          showInitializing
        ) {
          setInitializing(
            true
          );
        }

        try {
          const {
            data:
              userData,

            error:
              userError,
          } =
            await supabase.auth.getUser();

          if (
            userError ||
            !userData.user
          ) {
            setUserId(
              null
            );

            setWallet(
              null
            );

            return;
          }

          setUserId(
            userData.user.id
          );

          const [
            {
              data:
                priceData,

              error:
                priceError,
            },

            {
              data:
                settingsData,

              error:
                settingsError,
            },

            {
              data:
                walletData,

              error:
                walletError,
            },
          ] =
            await Promise.all(
              [
                supabase
                  .from(
                    "market_price"
                  )
                  .select(
                    "price"
                  )
                  .eq(
                    "id",
                    1
                  )
                  .single(),

                supabase.rpc(
                  "get_market_settings"
                ),

                supabase
                  .from(
                    "wallets"
                  )
                  .select(
                    `
                      balance,
                      usdt_balance,
                      locked_platon,
                      locked_usdt
                    `
                  )
                  .eq(
                    "user_id",
                    userData.user.id
                  )
                  .single(),
              ]
            );

          if (
            priceError
          ) {
            console.error(
              "Unable to load market price:",
              priceError
            );
          } else if (
            priceData
          ) {
            setOfficialPrice(
              Number(
                priceData.price
              )
            );
          }

          if (
            settingsError
          ) {
            console.error(
              "Unable to load market settings:",
              settingsError
            );

            setSettingsLoaded(
              false
            );
          } else {
            const settingsRow =
              Array.isArray(
                settingsData
              )
                ? settingsData[0]
                : null;

            if (
              settingsRow
            ) {
              const buySpread =
                Number(
                  settingsRow.buy_spread
                );

              const sellSpread =
                Number(
                  settingsRow.sell_spread
                );

              if (
                Number.isFinite(
                  buySpread
                ) &&
                Number.isFinite(
                  sellSpread
                )
              ) {
                setSettings({
                  buy_spread:
                    buySpread,

                  sell_spread:
                    sellSpread,
                });

                setSettingsLoaded(
                  true
                );
              } else {
                setSettingsLoaded(
                  false
                );
              }
            } else {
              setSettingsLoaded(
                false
              );
            }
          }

          if (
            walletError
          ) {
            console.error(
              "Unable to load wallet:",
              walletError
            );

            setWallet(
              null
            );
          } else if (
            walletData
          ) {
            setWallet({
              balance:
                Number(
                  walletData.balance
                ),

              usdt_balance:
                Number(
                  walletData.usdt_balance
                ),

              locked_platon:
                Number(
                  walletData.locked_platon
                ),

              locked_usdt:
                Number(
                  walletData.locked_usdt
                ),
            });
          }
        } finally {
          if (
            showInitializing
          ) {
            setInitializing(
              false
            );
          }
        }
      },
      []
    );

  useEffect(
    () => {
      void loadData(
        true
      );

      const priceChannel =
        supabase
          .channel(
            "market-buy-sell-price"
          )
          .on(
            "postgres_changes",
            {
              event:
                "*",

              schema:
                "public",

              table:
                "market_price",
            },
            () => {
              void loadData(
                false
              );
            }
          )
          .subscribe();

      const walletsChannel =
        supabase
          .channel(
            "market-buy-sell-wallet"
          )
          .on(
            "postgres_changes",
            {
              event:
                "*",

              schema:
                "public",

              table:
                "wallets",
            },
            () => {
              void loadData(
                false
              );
            }
          )
          .subscribe();

      return () => {
        void supabase
          .removeChannel(
            priceChannel
          );

        void supabase
          .removeChannel(
            walletsChannel
          );
      };
    },
    [
      loadData,
    ]
  );

  function changeMode(
    nextMode: Mode
  ) {
    setMode(
      nextMode
    );

    setAmount("");

    setSelectedPercentage(
      null
    );
  }

  function setPercentage(
    percentage: number
  ) {
    if (
      !wallet ||
      limitPrice <= 0
    ) {
      toast.error(
        "Wallet or market price is unavailable."
      );

      return;
    }

    let calculatedAmount =
      0;

    if (
      mode === "BUY"
    ) {
      const selectedUsdt =
        availableUsdt *
        (
          percentage /
          100
        );

      calculatedAmount =
        selectedUsdt /
        limitPrice;
    } else {
      calculatedAmount =
        availablePlaton *
        (
          percentage /
          100
        );
    }

    const safeAmount =
      Math.max(
        0,
        Number(
          calculatedAmount.toFixed(
            8
          )
        )
      );

    setAmount(
      safeAmount > 0
        ? safeAmount.toString()
        : ""
    );

    setSelectedPercentage(
      percentage
    );
  }

  async function handlePlaceOrder() {
    if (
      !userId
    ) {
      toast.error(
        "You must be logged in."
      );

      return;
    }

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      toast.error(
        "Enter a valid amount."
      );

      return;
    }

    if (
      !settingsLoaded ||
      !Number.isFinite(
        limitPrice
      ) ||
      limitPrice <= 0
    ) {
      toast.error(
        "Market settings are unavailable."
      );

      return;
    }

    if (
      mode === "SELL" &&
      numericAmount >
        availablePlaton
    ) {
      toast.error(
        "Insufficient available PLATON balance."
      );

      return;
    }

    if (
      mode === "BUY" &&
      total >
        availableUsdt
    ) {
      toast.error(
        "Insufficient available USDT balance."
      );

      return;
    }

    setLoading(
      true
    );

    try {
      const {
        data:
          sessionData,
      } =
        await supabase.auth.getSession();

      const accessToken =
        sessionData.session
          ?.access_token;

      if (
        !accessToken
      ) {
        toast.error(
          "Your session has expired. Please log in again."
        );

        return;
      }

      const response =
        await fetch(
          "/api/market/orders",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${accessToken}`,
            },

            body:
              JSON.stringify({
                orderType:
                  mode,

                price:
                  limitPrice,

                amount:
                  numericAmount,
              }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok
      ) {
        toast.error(
          result.error ||
            "Order creation failed."
        );

        return;
      }

      if (
        result.executionSource ===
        "USER"
      ) {
        toast.success(
          "Order matched with another user!"
        );
      } else if (
        result.executionSource ===
        "TREASURY"
      ) {
        toast.success(
          "Order executed through PLATON Treasury!"
        );
      } else {
        toast.success(
          result.message ||
            "Order created."
        );
      }

      setAmount("");

      setSelectedPercentage(
        null
      );

      await loadData(
        false
      );

      window.dispatchEvent(
        new Event(
          "platon-orders-updated"
        )
      );
    } catch (
      error
    ) {
      console.error(
        "Order request failed:",
        error
      );

      toast.error(
        "Unable to connect to the trading server."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[3px] text-gray-500">
            Trading Panel
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Place Order
          </h2>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-gray-400">
          LIMIT
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 rounded-2xl bg-black/30 p-1.5">
        <button
          type="button"
          disabled={
            loading
          }
          onClick={() =>
            changeMode(
              "BUY"
            )
          }
          className={`rounded-xl px-5 py-3 text-sm font-black transition ${
            mode === "BUY"
              ? "bg-emerald-400 text-black shadow-[0_0_25px_rgba(52,211,153,0.2)]"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Buy π
        </button>

        <button
          type="button"
          disabled={
            loading
          }
          onClick={() =>
            changeMode(
              "SELL"
            )
          }
          className={`rounded-xl px-5 py-3 text-sm font-black transition ${
            mode === "SELL"
              ? "bg-red-400 text-black shadow-[0_0_25px_rgba(248,113,113,0.2)]"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Sell π
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-gray-500">
            Available
          </span>

          <span
            className={`text-sm font-black ${
              mode === "BUY"
                ? "text-emerald-300"
                : "text-yellow-300"
            }`}
          >
            {mode === "BUY"
              ? `$${balanceFormatter.format(
                  availableUsdt
                )}`
              : `${balanceFormatter.format(
                  availablePlaton
                )} π`}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <Field
          label="Official Price"
          value={
            initializing
              ? "Loading..."
              : `$${officialPrice.toFixed(
                  8
                )}`
          }
          suffix="USD"
        />

        <Field
          label="Execution Limit"
          value={
            initializing ||
            !settingsLoaded
              ? "Loading..."
              : `$${limitPrice.toFixed(
                  8
                )}`
          }
          suffix="USD"
          highlighted
        />

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="platon-order-amount"
              className="text-sm font-bold text-gray-400"
            >
              Amount
            </label>

            <span className="text-xs text-gray-600">
              PLATON
            </span>
          </div>

          <div
            className={`mt-2 flex items-center rounded-2xl border bg-black/30 px-5 py-4 transition focus-within:ring-1 ${
              mode === "BUY"
                ? "border-white/10 focus-within:border-emerald-400 focus-within:ring-emerald-400/30"
                : "border-white/10 focus-within:border-red-400 focus-within:ring-red-400/30"
            }`}
          >
            <input
              id="platon-order-amount"
              value={
                amount
              }
              onChange={(
                event
              ) => {
                setAmount(
                  event.target
                    .value
                );

                setSelectedPercentage(
                  null
                );
              }}
              placeholder="0.00000000"
              type="number"
              min="0"
              step="0.00000001"
              disabled={
                loading ||
                initializing ||
                !settingsLoaded
              }
              className="min-w-0 flex-1 bg-transparent text-xl font-black outline-none disabled:opacity-50"
            />

            <span className="ml-3 font-black text-yellow-400">
              π
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-gray-400">
            Use balance
          </p>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {percentageOptions.map(
              (
                percentage
              ) => (
                <button
                  key={
                    percentage
                  }
                  type="button"
                  disabled={
                    loading ||
                    initializing ||
                    !settingsLoaded ||
                    !wallet ||
                    limitPrice <=
                      0
                  }
                  onClick={() =>
                    setPercentage(
                      percentage
                    )
                  }
                  className={`rounded-xl border px-2 py-2.5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    selectedPercentage ===
                    percentage
                      ? mode ===
                        "BUY"
                        ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                        : "border-red-400/50 bg-red-400/15 text-red-300"
                      : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {
                    percentage
                  }
                  %
                </button>
              )
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Order Total
            </span>

            <span className="text-lg font-black text-white">
              $
              {totalFormatter.format(
                total
              )}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Treasury spread
            </span>

            <span className="text-sm font-bold text-gray-300">
              {mode ===
              "BUY"
                ? settings.sell_spread
                : settings.buy_spread}
              %
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Settlement
            </span>

            <span className="text-sm font-bold text-emerald-300">
              Automatic
            </span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />

            <p className="text-sm font-bold text-emerald-300">
              Creating and
              matching order...
            </p>
          </div>
        </div>
      )}

      {!initializing &&
        !settingsLoaded && (
          <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            Market settings
            are temporarily
            unavailable.
          </div>
        )}

      {!initializing &&
        !wallet && (
          <div className="mt-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm text-yellow-200">
            Log in to your
            account to place
            an order.
          </div>
        )}

      <div className="mt-6">
        <Button
          onClick={
            handlePlaceOrder
          }
          disabled={
            loading ||
            initializing ||
            !settingsLoaded ||
            !wallet ||
            numericAmount <=
              0
          }
          className="w-full"
          variant={
            mode === "BUY"
              ? "primary"
              : "danger"
          }
        >
          {loading
            ? "Processing..."
            : mode ===
                "BUY"
              ? "Buy PLATON"
              : "Sell PLATON"}
        </Button>
      </div>
    </Card>
  );
}

type FieldProps = {
  label: string;
  value: string;
  suffix: string;
  highlighted?: boolean;
};

function Field({
  label,
  value,
  suffix,
  highlighted = false,
}: FieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-400">
          {label}
        </p>

        <span className="text-xs text-gray-600">
          {suffix}
        </span>
      </div>

      <div
        className={`mt-2 flex items-center justify-between rounded-2xl border px-5 py-4 ${
          highlighted
            ? "border-yellow-400/20 bg-yellow-400/[0.07]"
            : "border-white/10 bg-black/30"
        }`}
      >
        <span
          className={`font-black ${
            highlighted
              ? "text-yellow-300"
              : "text-white"
          }`}
        >
          {value}
        </span>

        <span className="text-xs font-bold text-gray-600">
          {suffix}
        </span>
      </div>
    </div>
  );
}