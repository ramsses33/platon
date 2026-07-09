const stats = [
  ["TPS", "2,184"],
  ["Validators", "128"],
  ["Block Time", "2 sec"],
  ["Network Status", "Online"],
];

export default function NetworkStats() {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-4">
      {stats.map(([title, value]) => (
        <div
          key={title}
          className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
        >
          <p className="text-sm text-gray-400">{title}</p>

          <h3 className="mt-3 text-3xl font-black text-emerald-400">
            {value}
          </h3>
        </div>
      ))}
    </div>
  );
}