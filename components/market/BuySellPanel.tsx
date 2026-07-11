"use client";

import { useEffect, useState } from "react";
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

export default function BuySellPanel() {
  const [mode, setMode] = useState<Mode>("BUY");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const numericAmount = Number(amount || 0);
  const total = numericAmount * price;

  const availablePlaton = wallet
    ? wallet.balance - wallet.locked_platon
    : 0;

  const availableUsdt = wallet
    ? wallet.usdt_balance - wallet.locked_usdt
    : 0;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setInitializing(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setInitializing(false);
      return;
    }

    const [{ data: priceData }, { data: walletData }] = await Promise.all([
      supabase
        .from("market_price")
        .select("price")
        .eq("id", 1)
        .single(),

      supabase
        .from("wallets")
        .select(
          "balance, usdt_balance, locked_platon, locked_usdt"
        )
        .eq("user_id", userData.user.id)
        .single(),
    ]);

    if (priceData) {
      setPrice(Number(priceData.price));
    }

    if (walletData) {
      setWallet({
        balance: Number(walletData.balance),
        usdt_balance: Number(walletData.usdt_balance),
        locked_platon: Number(walletData.locked_platon),
        locked_usdt: Number(walletData.locked_usdt),
      });
    }

    setInitializing(false);
  }

  async function handlePlaceOrder() {
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    if (!price || price <= 0) {
      toast.error("Market price is unavailable.");
      return;
    }

    if (mode === "SELL" && numericAmount > availablePlaton) {
      toast.error("Insufficient available PLATON balance.");
      return;
    }

    if (mode === "BUY" && total > availableUsdt) {
      toast.error("Insufficient available USDT balance.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.rpc("place_order", {
      requested_type: mode,
      requested_price: price,
      requested_amount: numericAmount,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success(
      `${mode === "BUY" ? "Buy" : "Sell"} order created successfully!`
    );

    setAmount("");
    await loadData();

    window.dispatchEvent(new Event("platon-orders-updated"));

    setLoading(false);
  }

  return (
    <Card className="mt-8">
      <div className="mb-6 flex gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => setMode("BUY")}
          className={`flex-1 rounded-2xl px-5 py-3 font-bold transition ${
            mode === "BUY"
              ? "bg-emerald-400 text-black"
              : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          Buy π
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => setMode("SELL")}
          className={`flex-1 rounded-2xl px-5 py-3 font-bold transition ${
            mode === "SELL"
              ? "bg-red-400 text-black"
              : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          Sell π
        </button>
      </div>

      <p className="text-sm text-gray-400">Amount</p>

      <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-black/30 px-5 py-4 focus-within:border-emerald-400">
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
          type="number"
          min="0"
          step="0.00000001"
          disabled={loading || initializing}
          className="w-full bg-transparent text-2xl font-bold outline-none disabled:opacity-50"
        />

        <span className="text-yellow-400">π</span>
      </div>

      <div className="mt-5 rounded-2xl bg-white/5 p-5">
        <div className="flex justify-between gap-4 text-gray-400">
          <span>Official Price</span>
          <span className="font-bold text-white">
            {initializing ? "Loading..." : `$${price.toFixed(8)}`}
          </span>
        </div>

        <div className="mt-3 flex justify-between gap-4 text-gray-400">
          <span>Total</span>
          <span className="font-bold text-white">
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="mt-3 flex justify-between gap-4 text-gray-400">
          <span>Available PLATON</span>
          <span className="font-bold text-yellow-400">
            {availablePlaton.toLocaleString()} π
          </span>
        </div>

        <div className="mt-3 flex justify-between gap-4 text-gray-400">
          <span>Available USDT</span>
          <span className="font-bold text-emerald-400">
            ${availableUsdt.toLocaleString()}
          </span>
        </div>
      </div>

      {loading && (
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />

            <p className="font-bold text-emerald-300">
              Reserving funds and creating order...
            </p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Button
          onClick={handlePlaceOrder}
          disabled={loading || initializing}
          className="w-full"
          variant={mode === "BUY" ? "primary" : "danger"}
        >
          {loading
            ? "Processing..."
            : mode === "BUY"
              ? "Place Buy Order"
              : "Place Sell Order"}
        </Button>
      </div>
    </Card>
  );
}