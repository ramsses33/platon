

const columns = [
  ["Platform", ["Market", "Wallet", "Explorer", "Dashboard"]],
  ["Network", ["Staking", "Tokenomics", "Roadmap", "Whitepaper"]],
  ["Community", ["Academy", "Telegram", "Discord", "GitHub"]],
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030405] px-8 py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 text-2xl font-black text-black">
              π
            </div>

            <div>
              <h3 className="text-2xl font-black">PLATON</h3>
              <p className="text-xs uppercase tracking-[3px] text-gray-500">
                Official Network
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-md text-gray-400">
            The official ecosystem for buying, storing, staking and tracking
            PLATON π.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {columns.map(([title, items]) => (
            <div key={title as string}>
              <h4 className="font-bold">{title}</h4>

              <div className="mt-5 space-y-3 text-gray-400">
                {(items as string[]).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-6 text-sm text-gray-500">
        © 2026 PLATON Network. All rights reserved.
      </div>
    </footer>
  );
}