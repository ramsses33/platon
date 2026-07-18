"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";

export default function TreasuryControl() {
  const [loading, setLoading] = useState(false);

  const [platon, setPlaton] = useState(0);
  const [usdt, setUsdt] = useState(0);

  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("treasury_wallet")
      .select("*")
      .eq("id", 1)
      .single();

    if (!data) return;

    setPlaton(Number(data.platon_balance));
    setUsdt(Number(data.usdt_balance));
    setEnabled(data.is_enabled);
  }

  async function toggleTreasury() {
    setLoading(true);

    const { error } = await supabase
      .from("treasury_wallet")
      .update({
        is_enabled: !enabled,
      })
      .eq("id", 1);

    if (!error) {
      setEnabled(!enabled);
    }

    setLoading(false);
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-2xl">

      <h2 className="text-3xl font-black">
        Treasury Control
      </h2>

      <div className="mt-8 space-y-6">

        <div>
          <p className="text-gray-400">
            PLATON Reserve
          </p>

          <h2 className="mt-2 text-4xl font-black text-yellow-400">
            {platon.toLocaleString()} π
          </h2>
        </div>

        <div>
          <p className="text-gray-400">
            USDT Reserve
          </p>

          <h2 className="mt-2 text-4xl font-black text-emerald-400">
            ${usdt.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl bg-black/30 p-5">

          <p className="text-gray-400">
            Treasury Status
          </p>

          <h2
            className={`mt-2 text-2xl font-black ${
              enabled
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {enabled ? "ACTIVE" : "DISABLED"}
          </h2>

        </div>

        <Button
          onClick={toggleTreasury}
          disabled={loading}
          className="w-full"
        >
          {enabled
            ? "Disable Treasury"
            : "Enable Treasury"}
        </Button>

      </div>

    </div>
  );
}