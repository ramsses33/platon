export type MarketOrder = {
  id: string;
  user_id: string;
  wallet_address: string;
  order_type: "BUY" | "SELL";
  price: number;
  amount: number;
  remaining: number;
  status: "OPEN" | "PARTIAL" | "FILLED" | "CANCELLED";
  created_at: string;
};

export type OrderMatch = {
  buyOrder: MarketOrder;
  sellOrder: MarketOrder;
  executionPrice: number;
  executionAmount: number;
};

export function findBestMatch(
  incomingOrder: MarketOrder,
  openOrders: MarketOrder[]
): OrderMatch | null {
  const candidates = openOrders.filter((order) => {
    if (order.id === incomingOrder.id) return false;
    if (order.user_id === incomingOrder.user_id) return false;

    if (!["OPEN", "PARTIAL"].includes(order.status)) {
      return false;
    }

    if (incomingOrder.order_type === "BUY") {
      return (
        order.order_type === "SELL" &&
        Number(order.price) <= Number(incomingOrder.price)
      );
    }

    return (
      order.order_type === "BUY" &&
      Number(order.price) >= Number(incomingOrder.price)
    );
  });

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => {
    if (incomingOrder.order_type === "BUY") {
      const priceDifference = Number(a.price) - Number(b.price);

      if (priceDifference !== 0) {
        return priceDifference;
      }
    } else {
      const priceDifference = Number(b.price) - Number(a.price);

      if (priceDifference !== 0) {
        return priceDifference;
      }
    }

    return (
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
    );
  });

  const matchedOrder = candidates[0];

  const buyOrder =
    incomingOrder.order_type === "BUY"
      ? incomingOrder
      : matchedOrder;

  const sellOrder =
    incomingOrder.order_type === "SELL"
      ? incomingOrder
      : matchedOrder;

  const executionAmount = Math.min(
    Number(buyOrder.remaining),
    Number(sellOrder.remaining)
  );

  const executionPrice = Number(matchedOrder.price);

  return {
    buyOrder,
    sellOrder,
    executionPrice,
    executionAmount,
  };
}