const stats = [
  ["Market Cap", "$148.2M"],
  ["24H Volume", "$12.8M"],
  ["Circulating", "1.2B π"],
  ["Holders", "184,921"],
];

export default function MarketStats() {
  return (
    <div className="grid gap-5 md:grid-cols-4">
      {stats.map(([title, value]) => (
        <div
          key={title}
          className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
        >
          <p className="text-sm text-gray-400">{title}</p>

          <h3 className="mt-3 text-3xl font-black text-white">
            {value}
          </h3>
        </div>
      ))}
    </div>
  );
}