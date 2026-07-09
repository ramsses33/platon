const blocks = [
  ["#4829184", "2 sec", "184 tx"],
  ["#4829183", "4 sec", "201 tx"],
  ["#4829182", "6 sec", "176 tx"],
  ["#4829181", "8 sec", "192 tx"],
  ["#4829180", "10 sec", "208 tx"],
];

export default function LatestBlocks() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl">
      <h2 className="mb-6 text-2xl font-black">
        Latest Blocks
      </h2>

      <div className="space-y-4">
        {blocks.map(([block, age, tx]) => (
          <div
            key={block}
            className="flex items-center justify-between rounded-2xl bg-black/30 p-4"
          >
            <div>
              <h3 className="font-bold text-emerald-400">
                {block}
              </h3>

              <p className="text-sm text-gray-500">
                {age}
              </p>
            </div>

            <span className="text-gray-300">
              {tx}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}