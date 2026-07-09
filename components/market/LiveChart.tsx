"use client";

export default function LiveChart() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">PLATON Price Chart</p>
          <h3 className="text-2xl font-bold">π / USD</h3>
        </div>

        <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
          Live
        </span>
      </div>

      <div className="h-64 w-full rounded-2xl bg-black/30 p-4">
        <svg viewBox="0 0 500 220" className="h-full w-full">
          <path
            d="M0 170 C40 130, 70 180, 110 120 S190 70, 230 110 S310 170, 360 90 S440 60, 500 80"
            fill="none"
            stroke="#34d399"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}