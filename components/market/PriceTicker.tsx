"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MarketPriceRow = {
  price: number;
};

const REFRESH_INTERVAL_MS = 5000;

export default function PriceTicker() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPrice() {
      const { data, error } = await supabase
        .from("market_price")
        .select("price")
        .eq("id", 1)
        .single();

      if (!active) {
        return;
      }

      if (error || !data) {
        console.error(
          "Unable to load PLATON price:",
          error,
        );
        return;
      }

      const nextPrice = Number(data.price);

      if (Number.isFinite(nextPrice)) {
        setPrice(nextPrice);
      }
    }

    loadPrice();

    const refreshTimer = window.setInterval(
      loadPrice,
      REFRESH_INTERVAL_MS,
    );

    const channel = supabase
      .channel("home-market-price")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "market_price",
          filter: "id=eq.1",
        },
        (payload) => {
          const updatedRow =
            payload.new as MarketPriceRow;

          const nextPrice = Number(
            updatedRow.price,
          );

          if (Number.isFinite(nextPrice)) {
            setPrice(nextPrice);
          }
        },
      )
      .subscribe();

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <h3 className="mt-2 text-4xl font-bold">
      {price === null
        ? "$—"
        : `$${price.toFixed(5)}`}
    </h3>
  );
}
