export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070A]">
      <div className="flex flex-col items-center">

        <div className="flex h-28 w-28 animate-spin items-center justify-center rounded-full border-[8px] border-yellow-500 border-t-transparent">
          <span className="text-5xl font-black text-yellow-400">
            π
          </span>
        </div>

        <p className="mt-8 text-xl font-bold text-white">
          Loading PLATON...
        </p>

      </div>
    </main>
  );
}