"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

export default function SendPlatonForm() {
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshWallet = useWalletRefresh((s) => s.refreshWallet);

  async function handleSend() {
    if (!receiverAddress || !amount) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!receiverAddress.startsWith("platon_")) {
      toast.error("Invalid PLATON wallet address.");
      return;
    }

    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      toast.error("You are not logged in.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/wallet/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiverAddress,
        amount: Number(amount),
        accessToken,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error || "Transfer failed.");
      setLoading(false);
      return;
    }

    toast.success("Transfer completed successfully!");

    setReceiverAddress("");
    setAmount("");
    refreshWallet();
    setLoading(false);
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <h2 className="text-2xl font-black">Send π</h2>

      <p className="mt-2 text-gray-400">
        Send PLATON instantly to another wallet.
      </p>

      <div className="mt-6 space-y-4">
        <input
          placeholder="Receiver wallet address"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          disabled={loading}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-emerald-400 disabled:opacity-50"
        />

        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-emerald-400 disabled:opacity-50"
        />

        {loading && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              <p className="font-bold text-emerald-300">
                Processing transfer...
              </p>
            </div>
          </div>
        )}

        <Button onClick={handleSend} disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send π"}
        </Button>
      </div>
    </div>
  );
}