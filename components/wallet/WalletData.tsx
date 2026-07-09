"use client";

import { useEffect, useState } from "react";
import { Copy, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import { useWalletRefresh } from "@/hooks/useWalletRefresh";

type Wallet = {
  wallet_address: string;
  balance: number;
};

export default function WalletData() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [copied, setCopied] = useState(false);

  const refreshKey = useWalletRefresh((s) => s.refreshKey);

  useEffect(() => {
    loadWallet();
  }, [refreshKey]);

  async function loadWallet() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data } = await supabase
      .from("wallets")
      .select("wallet_address,balance")
      .eq("user_id", userData.user.id)
      .single();

    setWallet(data);
  }

  async function copyAddress() {
    if (!wallet) return;

    await navigator.clipboard.writeText(wallet.wallet_address);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  if (!wallet) {
    return (
      <div className="rounded-[36px] border border-white/10 bg-white/[0.05] p-10">
        Loading wallet...
      </div>
    );
  }

  return (
    <div className="rounded-[40px] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-white/[0.04] to-emerald-500/10 p-10 backdrop-blur-2xl">
      <p className="uppercase tracking-[5px] text-yellow-400 text-sm">
        PLATON Wallet
      </p>

      <h1 className="mt-5 text-7xl font-black">
        {Number(wallet.balance).toLocaleString()} π
      </h1>

      <p className="mt-4 text-3xl text-emerald-400">
        ≈ ${(Number(wallet.balance) * 0.121).toFixed(2)}
      </p>

      <div className="mt-8 rounded-3xl bg-black/30 p-6">
        <p className="text-gray-400">
          Wallet Address
        </p>

        <p className="mt-3 break-all font-mono text-emerald-300">
          {wallet.wallet_address}
        </p>

        <div className="mt-6">
          <Button
            onClick={copyAddress}
            variant="secondary"
          >
            {copied ? (
              <>
                <CheckCircle size={18} />
                <span className="ml-2">Copied</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span className="ml-2">Copy Address</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}