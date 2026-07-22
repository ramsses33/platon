const tokenomics = [
  ["40%", "Community"],
  ["20%", "Ecosystem"],
  ["15%", "Development"],
  ["10%", "Treasury"],
  ["10%", "Marketing"],
  ["5%", "Reserve"],
];

const roadmap = [
  [
    "2026",
    "Genesis Launch",
    "Website, wallet, official market",
  ],
  [
    "2027",
    "Network Expansion",
    "Staking, explorer, governance",
  ],
  [
    "2028",
    "Global Adoption",
    "AI, payments, merchant tools",
  ],
];

export default function TokenomicsRoadmap() {
  return (
    <section className="w-full overflow-hidden bg-[#05070A] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div
          id="tokenomics"
          className="min-w-0 scroll-mt-28 rounded-[24px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl sm:scroll-mt-32 sm:rounded-[30px] sm:p-7 lg:rounded-[36px] lg:p-8"
        >
          <p className="text-xs uppercase leading-5 tracking-[3px] text-emerald-400 sm:text-sm sm:tracking-[5px]">
            Tokenomics
          </p>

          <h2 className="mt-4 break-words text-3xl font-black leading-tight sm:text-4xl">
            PLATON π Distribution
          </h2>

          <div className="mt-8 space-y-5 sm:mt-10">
            {tokenomics.map(
              ([percent, label]) => (
                <div
                  key={label}
                  className="min-w-0"
                >
                  <div className="mb-2 flex min-w-0 items-center justify-between gap-4">
                    <span className="min-w-0 break-words text-sm sm:text-base">
                      {label}
                    </span>

                    <span className="shrink-0 text-sm font-bold text-emerald-400 sm:text-base">
                      {percent}
                    </span>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 sm:h-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      style={{
                        width: percent,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div
          id="roadmap"
          className="min-w-0 scroll-mt-28 rounded-[24px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl sm:scroll-mt-32 sm:rounded-[30px] sm:p-7 lg:rounded-[36px] lg:p-8"
        >
          <p className="text-xs uppercase leading-5 tracking-[3px] text-yellow-400 sm:text-sm sm:tracking-[5px]">
            Roadmap
          </p>

          <h2 className="mt-4 break-words text-3xl font-black leading-tight sm:text-4xl">
            The Road to PLATON Network
          </h2>

          <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
            {roadmap.map(
              ([year, title, text]) => (
                <div
                  key={year}
                  className="min-w-0 rounded-2xl bg-black/30 p-4 sm:p-5"
                >
                  <p className="text-sm font-bold text-emerald-400 sm:text-base">
                    {year}
                  </p>

                  <h3 className="mt-2 break-words text-xl font-bold leading-tight sm:text-2xl">
                    {title}
                  </h3>

                  <p className="mt-2 break-words text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">
                    {text}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
