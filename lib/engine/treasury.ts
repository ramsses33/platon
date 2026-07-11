import type { MarketOrder } from "@/lib/engine/matching";

export type TreasuryWallet = {
  id: number;
  wallet_address: string;
  platon_balance: number;
  usdt_balance: number;
  locked_platon: number;
  locked_usdt: number;
  is_enabled: boolean;
};

export type MarketSettings = {
  buy_spread: number;
  sell_spread: number;
  auto_market_maker: boolean;
  treasury_enabled: boolean;
  min_platon_reserve: number;
  min_usdt_reserve: number;
};

export type TreasuryMatch = {
  executionPrice: number;
  executionAmount: number;
  executionType: "TREASURY_BUY" | "TREASURY_SELL";
};

export function calculateTreasuryMatch(
  order: MarketOrder,
  treasury: TreasuryWallet,
  settings: MarketSettings
): TreasuryMatch | null {
  if (
    !treasury.is_enabled ||
    !settings.auto_market_maker ||
    !settings.treasury_enabled
  ) {
    return null;
  }

  const remaining = Number(order.remaining);

  if (!Number.isFinite(remaining) || remaining <= 0) {
    return null;
  }

  if (order.order_type === "BUY") {
    const availablePlaton =
      Number(treasury.platon_balance) -
      Number(treasury.locked_platon) -
      Number(settings.min_platon_reserve);

    if (availablePlaton <= 0) {
      return null;
    }

    const executionAmount = Math.min(remaining, availablePlaton);

    const executionPrice = Number(
      (
        Number(order.price) *
        (1 + Number(settings.sell_spread) / 100)
      ).toFixed(8)
    );

    return {
      executionPrice,
      executionAmount,
      executionType: "TREASURY_SELL",
    };
  }

  const availableUsdt =
    Number(treasury.usdt_balance) -
    Number(treasury.locked_usdt) -
    Number(settings.min_usdt_reserve);

  if (availableUsdt <= 0) {
    return null;
  }

  const executionPrice = Number(
    (
      Number(order.price) *
      (1 - Number(settings.buy_spread) / 100)
    ).toFixed(8)
  );

  if (executionPrice <= 0) {
    return null;
  }

  const maximumPlatonAmount = availableUsdt / executionPrice;
  const executionAmount = Math.min(remaining, maximumPlatonAmount);

  if (executionAmount <= 0) {
    return null;
  }

  return {
    executionPrice,
    executionAmount: Number(executionAmount.toFixed(8)),
    executionType: "TREASURY_BUY",
  };
}