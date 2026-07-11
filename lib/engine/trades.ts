export type TradeExecution = {
  buyOrderId: string;
  sellOrderId: string;

  buyerId: string | null;
  sellerId: string | null;

  buyerSource: "USER" | "TREASURY";
  sellerSource: "USER" | "TREASURY";

  price: number;
  amount: number;

  executionType:
    | "USER_MATCH"
    | "TREASURY_BUY"
    | "TREASURY_SELL";
};

export function createTradePayload(
  trade: TradeExecution
) {
  return {
    buy_order_id: trade.buyOrderId,
    sell_order_id: trade.sellOrderId,

    buyer_id: trade.buyerId,
    seller_id: trade.sellerId,

    buyer_source: trade.buyerSource,
    seller_source: trade.sellerSource,

    price: trade.price,
    amount: trade.amount,

    execution_type: trade.executionType,
  };
}