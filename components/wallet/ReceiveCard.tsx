"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

type Wallet = {
  wallet_address: string;
};

export default function ReceiveCard() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadWallet() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      const { data } = await supabase
        .from("wallets")
        .select("wallet_address")
        .eq("user_id", userData.user.id)
        .single();

      setWallet(data);
    }

    loadWallet();
  }, []);

  async function copyAddress() {
    if (!wallet) return;

    await navigator.clipboard.writeText(wallet.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!wallet) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
        Loading wallet address...
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <h2 className="text-2xl font-black">Receive π</h2>

      <p className="mt-3 text-gray-400">
        Scan QR code or copy your official PLATON wallet address.
      </p>

      <div className="mt-6 flex justify-center rounded-3xl bg-white p-6">
        <QRCodeSVG value={wallet.wallet_address} size={190} includeMargin />
      </div>

      <div className="mt-6 rounded-2xl bg-black/30 p-5">
        <p className="break-all font-mono text-sm text-emerald-300">
          {wallet.wallet_address}
        </p>
      </div>

      <div className="mt-6">
        <Button onClick={copyAddress} variant="secondary" className="w-full">
          {copied ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle size={18} />
              Copied
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Copy size={18} />
              Copy Address
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}