"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MarketPriceRow = {
  price: number;
  updated_at: string;
};

export default function MarketPrice() {
  const [marketPrice, setMarketPrice] = useState<MarketPriceRow | null>(null);

  async function loadPrice() {
    const { data } = await supabase
      .from("market_price")
      .select("price, updated_at")
      .eq("id", 1)
      .single();

    if (data) {
      setMarketPrice({
        price: Number(data.price),
        updated_at: data.updated_at,
      });
    }
  }

  useEffect(() => {
    loadPrice();

    const interval = setInterval(() => {
      loadPrice();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-[32px] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-white/[0.04] to-emerald-500/10 p-8 backdrop-blur-2xl">
      <p className="text-sm uppercase tracking-[4px] text-yellow-400">
        Official PLATON Price
      </p>

      <h2 className="mt-4 text-6xl font-black">
        ${marketPrice?.price.toFixed(5) ?? "0.00000"}
      </h2>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
          ● Market Active
        </span>

        <span className="text-sm text-gray-400">
          Auto refresh every 15 seconds
        </span>

        {marketPrice && (
          <span className="text-sm text-gray-500">
            {new Date(marketPrice.updated_at).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}