import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-8 text-white">
      <div className="max-w-xl text-center">

        <h1 className="text-[140px] font-black leading-none text-yellow-400">
          404
        </h1>

        <h2 className="mt-6 text-5xl font-black">
          Page Not Found
        </h2>

        <p className="mt-6 text-xl text-gray-400">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-12">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>

      </div>
    </main>
  );
}