"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";

export default function MarketControl() {
  const [loading, setLoading] = useState(false);

  const [price, setPrice] = useState(0);
  const [buySpread, setBuySpread] = useState(1);
  const [sellSpread, setSellSpread] = useState(1);
  const [interval, setInterval] = useState(13);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [{ data: market }, { data: settings }] =
      await Promise.all([
        supabase
          .from("market_price")
          .select("price")
          .eq("id", 1)
          .single(),

        supabase
          .from("market_settings")
          .select("*")
          .eq("id", 1)
          .single(),
      ]);

    if (market) {
      setPrice(Number(market.price));
    }

    if (settings) {
      setBuySpread(Number(settings.buy_spread));
      setSellSpread(Number(settings.sell_spread));
      setInterval(Number(settings.update_interval));
    }
  }

  async function save() {
    setLoading(true);

    const { error } = await supabase
      .from("market_settings")
      .update({
        buy_spread: buySpread,
        sell_spread: sellSpread,
        update_interval: interval,
      })
      .eq("id", 1);

    if (!error) {
      alert("Market settings saved.");
    } else {
      alert(error.message);
    }

    setLoading(false);
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-2xl">
      <h2 className="text-3xl font-black">
        Market Control
      </h2>

      <div className="mt-8 space-y-6">

        <div>
          <p className="text-gray-400">
            Official Price
          </p>

          <h2 className="mt-2 text-4xl font-black text-yellow-400">
            ${price.toFixed(8)}
          </h2>
        </div>

        <div>
          <p className="mb-2">Buy Spread (%)</p>

          <input
            type="number"
            value={buySpread}
            onChange={(e)=>setBuySpread(Number(e.target.value))}
            className="w-full rounded-xl bg-black/30 px-4 py-3"
          />
        </div>

        <div>
          <p className="mb-2">Sell Spread (%)</p>

          <input
            type="number"
            value={sellSpread}
            onChange={(e)=>setSellSpread(Number(e.target.value))}
            className="w-full rounded-xl bg-black/30 px-4 py-3"
          />
        </div>

        <div>
          <p className="mb-2">Price Update Interval (minutes)</p>

          <input
            type="number"
            value={interval}
            onChange={(e)=>setInterval(Number(e.target.value))}
            className="w-full rounded-xl bg-black/30 px-4 py-3"
          />
        </div>

        <Button
          onClick={save}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save Market Settings"}
        </Button>

      </div>
    </div>
  );
}