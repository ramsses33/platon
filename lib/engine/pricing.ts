export type PriceUpdateInput = {
  currentPrice: number;
  executionPrice: number;
  executionAmount: number;
  buyVolume: number;
  sellVolume: number;
};

export type PriceUpdateResult = {
  newPrice: number;
  movementPercent: number;
};

export function calculateNextPrice({
  currentPrice,
  executionPrice,
  executionAmount,
  buyVolume,
  sellVolume,
}: PriceUpdateInput): PriceUpdateResult {
  if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
    throw new Error("Current price must be greater than zero.");
  }

  if (!Number.isFinite(executionPrice) || executionPrice <= 0) {
    throw new Error("Execution price must be greater than zero.");
  }

  if (!Number.isFinite(executionAmount) || executionAmount <= 0) {
    throw new Error("Execution amount must be greater than zero.");
  }

  const totalVolume = buyVolume + sellVolume;

  const demandPressure =
    totalVolume > 0
      ? (buyVolume - sellVolume) / totalVolume
      : 0;

  const executionDifference =
    (executionPrice - currentPrice) / currentPrice;

  const volumeWeight = Math.min(executionAmount / 100000, 1);

  const rawMovement =
    demandPressure * 0.003 +
    executionDifference * 0.4 +
    volumeWeight * 0.001;

  const limitedMovement = Math.max(
    -0.02,
    Math.min(0.02, rawMovement)
  );

  const newPrice = Number(
    Math.max(
      0.00000001,
      currentPrice * (1 + limitedMovement)
    ).toFixed(8)
  );

  return {
    newPrice,
    movementPercent: Number(
      (limitedMovement * 100).toFixed(4)
    ),
  };
}