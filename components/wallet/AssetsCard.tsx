"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

type Stats = {
  balance: number;
  transactions: number;
  received: number;
  sent: number;
};

export default function AssetsCard() {
  const [stats, setStats] = useState<Stats>({
    balance: 0,
    transactions: 0,
    received: 0,
    sent: 0,
  });

  const refreshKey = useWalletRefresh((s) => s.refreshKey);

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  async function loadStats() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: wallet } = await supabase
      .from("wallets")
      .select("wallet_address, balance")
      .eq("user_id", userData.user.id)
      .single();

    if (!wallet) return;

    const { data: transactions } = await supabase
      .from("transactions")
      .select("*");

    const txs = transactions || [];

    const received = txs
      .filter((tx) => tx.receiver_wallet === wallet.wallet_address)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const sent = txs
      .filter((tx) => tx.sender_wallet === wallet.wallet_address)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    setStats({
      balance: Number(wallet.balance),
      transactions: txs.length,
      received,
      sent,
    });
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <h2 className="mb-6 text-2xl font-black">Wallet Statistics</h2>

      <div className="grid gap-4">
        <div className="rounded-2xl bg-black/30 p-4">
          <p className="text-sm text-gray-500">Balance</p>
          <h3 className="mt-2 text-2xl font-black text-yellow-400">
            {stats.balance} π
          </h3>
        </div>

        <div className="rounded-2xl bg-black/30 p-4">
          <p className="text-sm text-gray-500">Transactions</p>
          <h3 className="mt-2 text-2xl font-black text-white">
            {stats.transactions}
          </h3>
        </div>

        <div className="rounded-2xl bg-black/30 p-4">
          <p className="text-sm text-gray-500">Received</p>
          <h3 className="mt-2 text-2xl font-black text-emerald-400">
            +{stats.received} π
          </h3>
        </div>

        <div className="rounded-2xl bg-black/30 p-4">
          <p className="text-sm text-gray-500">Sent</p>
          <h3 className="mt-2 text-2xl font-black text-red-400">
            -{stats.sent} π
          </h3>
        </div>

        <div className="rounded-2xl bg-emerald-400/10 p-4">
          <p className="text-sm text-gray-500">Wallet Status</p>
          <h3 className="mt-2 text-xl font-black text-emerald-400">
            ● Active
          </h3>
        </div>
      </div>
    </div>
  );
}