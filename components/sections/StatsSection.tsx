const stats = [
  ["$148.2M", "Market Cap"],
  ["184,921", "Holders"],
  ["1.2B π", "Circulating Supply"],
  ["2 sec", "Block Time"],
];

export default function StatsSection() {
  return (
    <section className="bg-[#05070A] px-8 py-24 text-white">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl">
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="text-center">
              <h3 className="text-5xl font-black text-emerald-400">
                {value}
              </h3>
              <p className="mt-3 text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}