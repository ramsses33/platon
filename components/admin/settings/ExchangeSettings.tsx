"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function ExchangeSettings() {
  const [loading, setLoading] = useState(false);

  const [exchangeName, setExchangeName] =
    useState("PLATON");

  const [tokenSymbol, setTokenSymbol] =
    useState("π");

  const [tradingEnabled, setTradingEnabled] =
    useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("exchange_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!data) return;

    setExchangeName(data.exchange_name);
    setTokenSymbol(data.token_symbol);
    setTradingEnabled(data.trading_enabled);
  }

  async function save() {
    setLoading(true);

    const { error } = await supabase
      .from("exchange_settings")
      .update({
        exchange_name: exchangeName,
        token_symbol: tokenSymbol,
        trading_enabled: tradingEnabled,
      })
      .eq("id", 1);

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Settings saved.");
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-2xl">
      <h2 className="text-3xl font-black">
        Exchange Settings
      </h2>

      <div className="mt-8 space-y-6">

        <div>
          <p className="mb-2">Exchange Name</p>

          <input
            value={exchangeName}
            onChange={(e)=>setExchangeName(e.target.value)}
            className="w-full rounded-xl bg-black/30 px-4 py-3"
          />
        </div>

        <div>
          <p className="mb-2">Token Symbol</p>

          <input
            value={tokenSymbol}
            onChange={(e)=>setTokenSymbol(e.target.value)}
            className="w-full rounded-xl bg-black/30 px-4 py-3"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={tradingEnabled}
            onChange={(e)=>
              setTradingEnabled(e.target.checked)
            }
          />

          Trading Enabled
        </label>

        <Button
          onClick={save}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save"}
        </Button>

      </div>
    </div>
  );
}