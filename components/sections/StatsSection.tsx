const stats = [
  ["$148.2M", "Market Cap"],
  ["184,921", "Holders"],
  ["1.2B π", "Circulating Supply"],
  ["2 sec", "Block Time"],
];

export default function StatsSection() {
  return (
    <section className="w-full overflow-hidden bg-[#05070A] px-4 py-14 text-white sm:px-6 sm:py-18 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl sm:rounded-[30px] sm:p-7 lg:rounded-[36px] lg:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div
              key={label}
              className="min-w-0 rounded-2xl bg-black/20 px-3 py-6 text-center sm:px-4 lg:bg-transparent lg:py-4"
            >
              <h3 className="break-words text-3xl font-black leading-tight text-emerald-400 sm:text-4xl lg:text-5xl">
                {value}
              </h3>

              <p className="mt-2 text-sm text-gray-400 sm:mt-3 sm:text-base">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
