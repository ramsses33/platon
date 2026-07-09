const tokenomics = [
  ["40%", "Community"],
  ["20%", "Ecosystem"],
  ["15%", "Development"],
  ["10%", "Treasury"],
  ["10%", "Marketing"],
  ["5%", "Reserve"],
];

const roadmap = [
  ["2026", "Genesis Launch", "Website, wallet, official market"],
  ["2027", "Network Expansion", "Staking, explorer, governance"],
  ["2028", "Global Adoption", "AI, payments, merchant tools"],
];

export default function TokenomicsRoadmap() {
  return (
    <section className="bg-[#05070A] px-8 py-28 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div className="rounded-[36px] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[5px] text-emerald-400">
            Tokenomics
          </p>

          <h2 className="mt-4 text-4xl font-black">
            PLATON π Distribution
          </h2>

          <div className="mt-10 space-y-5">
            {tokenomics.map(([percent, label]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between">
                  <span>{label}</span>
                  <span className="text-emerald-400">{percent}</span>
                </div>

                <div className="h-3 rounded-full bg-white/10">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    style={{ width: percent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[5px] text-yellow-400">
            Roadmap
          </p>

          <h2 className="mt-4 text-4xl font-black">
            The Road to PLATON Network
          </h2>

          <div className="mt-10 space-y-5">
            {roadmap.map(([year, title, text]) => (
              <div key={year} className="rounded-2xl bg-black/30 p-5">
                <p className="text-emerald-400">{year}</p>
                <h3 className="mt-2 text-2xl font-bold">{title}</h3>
                <p className="mt-2 text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}