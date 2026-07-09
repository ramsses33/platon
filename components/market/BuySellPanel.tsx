"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function BuySellPanel() {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");

  const price = 0.10345;
  const total = Number(amount || 0) * price;

  return (
    <Card className="mt-8">
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setMode("buy")}
          className={`flex-1 rounded-2xl px-5 py-3 font-bold ${
            mode === "buy"
              ? "bg-emerald-400 text-black"
              : "bg-white/5 text-white"
          }`}
        >
          Buy π
        </button>

        <button
          onClick={() => setMode("sell")}
          className={`flex-1 rounded-2xl px-5 py-3 font-bold ${
            mode === "sell"
              ? "bg-yellow-400 text-black"
              : "bg-white/5 text-white"
          }`}
        >
          Sell π
        </button>
      </div>

      <p className="text-sm text-gray-400">Amount</p>

      <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-transparent text-2xl font-bold outline-none"
        />
        <span className="text-yellow-400">π</span>
      </div>

      <div className="mt-5 rounded-2xl bg-white/5 p-5">
        <div className="flex justify-between text-gray-400">
          <span>Price</span>
          <span>$0.10345</span>
        </div>

        <div className="mt-3 flex justify-between text-gray-400">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6">
        <Button>{mode === "buy" ? "Buy π Now" : "Sell π Now"}</Button>
      </div>
    </Card>
  );
}