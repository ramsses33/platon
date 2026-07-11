export type UserWalletRow = {
  id: string;
  user_id: string;
  wallet_address: string;
  balance: number;
  usdt_balance: number;
  locked_platon: number;
  locked_usdt: number;
};

export type TreasuryWalletRow = {
  id: number;
  wallet_address: string;
  platon_balance: number;
  usdt_balance: number;
  locked_platon: number;
  locked_usdt: number;
  is_enabled: boolean;
};

export function getAvailablePlaton(wallet: UserWalletRow) {
  return Number(wallet.balance) - Number(wallet.locked_platon);
}

export function getAvailableUsdt(wallet: UserWalletRow) {
  return Number(wallet.usdt_balance) - Number(wallet.locked_usdt);
}

export function assertPositiveAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }
}

export function assertPositivePrice(price: number) {
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Price must be greater than zero.");
  }
}

export function calculateQuoteAmount(amount: number, price: number) {
  assertPositiveAmount(amount);
  assertPositivePrice(price);

  return Number((amount * price).toFixed(8));
}