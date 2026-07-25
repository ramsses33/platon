import PlatonGlyph from "@/components/brand/PlatonGlyph";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070A]">
      <div className="flex flex-col items-center">

        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-[8px] border-[#C9A858] border-t-transparent" />

          <PlatonGlyph className="h-14 w-14" />
        </div>

        <p className="mt-8 text-xl font-bold text-white">
          Loading PLATON...
        </p>

      </div>
    </main>
  );
}