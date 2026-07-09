"use client";

import { useEffect, useState } from "react";

const INTERVAL = 13 * 60;

export default function PricePulse() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 3000);
    }, INTERVAL * 1000);

    return () => clearInterval(timer);
  }, []);

  if (!pulse) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute h-[420px] w-[420px] animate-ping rounded-full border border-yellow-400/60" />

      <div className="rounded-3xl border border-yellow-400/30 bg-black/70 px-8 py-5 text-center backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[4px] text-yellow-300">
          Official PLATON Network
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">
          Price Updated
        </h2>
      </div>
    </div>
  );
}