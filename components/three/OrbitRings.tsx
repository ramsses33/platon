"use client";

export default function OrbitRings() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="absolute h-[620px] w-[620px] animate-pulse rounded-full border border-cyan-400/15" />
      <div className="absolute h-[500px] w-[500px] rounded-full border border-yellow-400/15" />
      <div className="absolute h-[720px] w-[720px] rounded-full border border-emerald-400/10" />
    </div>
  );
}