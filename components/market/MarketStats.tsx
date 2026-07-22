const stats = [
  ["Market Cap", "$148.2M"],
  ["24H Volume", "$12.8M"],
  ["Circulating", "1.2B π"],
  ["Holders", "184,921"],
];

export default function MarketStats() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
      {stats.map(([title, value]) => (
        <div
          key={title}
          className="min-w-0 rounded-[22px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl sm:rounded-[28px] sm:p-6"
        >
          <p className="text-xs text-gray-400 sm:text-sm">
            {title}
          </p>

          <h3 className="mt-2 break-words text-2xl font-black leading-tight text-white sm:mt-3 sm:text-3xl">
            {value}
          </h3>
        </div>
      ))}
    </div>
  );
}
