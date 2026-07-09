"use client";

import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

type Transaction = {
  id: string;
  sender_wallet: string | null;
  receiver_wallet: string;
  amount: number;
  type: string;
  status: string;
  created_at: string;
};

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [myAddress, setMyAddress] = useState("");

  const refreshKey = useWalletRefresh((s) => s.refreshKey);

  useEffect(() => {
    loadTransactions();
  }, [refreshKey]);

  async function loadTransactions() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data: wallet } = await supabase
      .from("wallets")
      .select("wallet_address")
      .eq("user_id", userData.user.id)
      .single();

    if (!wallet) return;

    setMyAddress(wallet.wallet_address);

    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    setTransactions(data || []);
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <h2 className="text-3xl font-black">Recent Transactions</h2>

      <div className="mt-6 space-y-4">
        {transactions.length === 0 && (
          <p className="text-gray-400">No transactions yet.</p>
        )}

        {transactions.map((tx) => {
          const incoming = tx.receiver_wallet === myAddress;

          return (
            <div key={tx.id} className="rounded-2xl bg-black/30 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      incoming
                        ? "bg-emerald-400/15 text-emerald-400"
                        : "bg-red-400/15 text-red-400"
                    }`}
                  >
                    {incoming ? (
                      <ArrowDownLeft size={24} />
                    ) : (
                      <ArrowUpRight size={24} />
                    )}
                  </div>

                  <div>
                    <p className="font-bold">
                      {incoming ? "Incoming" : "Outgoing"}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-[2px] text-gray-500">
                      {tx.status}
                    </p>
                  </div>
                </div>

                <p
                  className={`text-xl font-black ${
                    incoming ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {incoming ? "+" : "-"}
                  {tx.amount} π
                </p>
              </div>

              <div className="mt-5 rounded-2xl bg-white/5 p-4">
                <p className="break-all text-sm text-gray-400">
                  {incoming ? "From" : "To"}:{" "}
                  {incoming ? tx.sender_wallet : tx.receiver_wallet}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {new Date(tx.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}