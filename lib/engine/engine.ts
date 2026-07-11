import {
  findBestMatch,
  type MarketOrder,
  type OrderMatch,
} from "@/lib/engine/matching";

import {
  calculateTreasuryMatch,
  type MarketSettings,
  type TreasuryMatch,
  type TreasuryWallet,
} from "@/lib/engine/treasury";

export type EngineMatchResult =
  | {
      source: "USER";
      match: OrderMatch;
    }
  | {
      source: "TREASURY";
      order: MarketOrder;
      match: TreasuryMatch;
    }
  | {
      source: "NONE";
      order: MarketOrder;
    };

export function findExecutionPath(
  incomingOrder: MarketOrder,
  openOrders: MarketOrder[],
  treasury: TreasuryWallet,
  settings: MarketSettings
): EngineMatchResult {
  const userMatch = findBestMatch(incomingOrder, openOrders);

  if (userMatch) {
    return {
      source: "USER",
      match: userMatch,
    };
  }

  const treasuryMatch = calculateTreasuryMatch(
    incomingOrder,
    treasury,
    settings
  );

  if (treasuryMatch) {
    return {
      source: "TREASURY",
      order: incomingOrder,
      match: treasuryMatch,
    };
  }

  return {
    source: "NONE",
    order: incomingOrder,
  };
}