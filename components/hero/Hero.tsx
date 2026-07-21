"use client";

import Link from "next/link";

import Countdown from "@/components/market/Countdown";
import PriceTicker from "@/components/market/PriceTicker";
import Coin3D from "@/components/three/Coin3D";
import Earth3D from "@/components/three/Earth3D";
import OrbitRings from "@/components/three/OrbitRings";
import StarsBackground from "@/components/three/StarsBackground";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#040608] pt-24 sm:pt-28 lg:pt-32">
      <StarsBackground />
      <Earth3D />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(212,175,55,0.22),transparent_34%),radial-gradient(circle_at_28%_45%,rgba(0,231,194,0.18),transparent_42%)]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-96px)] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:min-h-[calc(100svh-112px)] sm:gap-12 sm:px-6 sm:py-14 lg:min-h-[calc(100svh-128px)] lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-8 lg:py-16">
        <div className="min-w-0">
          <p className="mb-5 inline-flex max-w-full rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-[10px] font-medium uppercase leading-5 tracking-[2px] text-emerald-300 sm:mb-6 sm:px-4 sm:text-xs sm:tracking-[3px] md:text-sm md:tracking-[4px]">
            Official Network-Priced Digital Currency
          </p>

          <h1 className="break-words text-5xl font-black leading-[0.95] sm:text-6xl md:text-7xl xl:text-8xl">
            PLATON{" "}
            <span className="text-yellow-400">
              π
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-7 text-gray-200 sm:mt-6 sm:text-xl sm:leading-8 md:text-2xl">
            The first digital currency sold only
            through its official market.
          </p>

          <p className="mt-4 max-w-xl text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">
            Buy, sell, store and stake π inside the
            PLATON ecosystem. The official price
            updates automatically every 13 minutes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/market"
              className="w-full sm:w-auto"
            >
              <Button variant="gold">
                Buy π Now
              </Button>
            </Link>

            <Button variant="secondary">
              Whitepaper
            </Button>
          </div>

          <div className="mt-9 grid min-w-0 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
            <Card className="min-w-0">
              <p className="text-sm text-gray-400 sm:text-base">
                Current Price
              </p>

              <PriceTicker />

              <p className="mt-2 text-xs text-emerald-400 sm:text-sm">
                Official network price
              </p>
            </Card>

            <Card className="min-w-0">
              <p className="text-sm text-gray-400 sm:text-base">
                Next Price Update
              </p>

              <div className="mt-2">
                <Countdown />
              </div>

              <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                Updates every 13 minutes
              </p>
            </Card>
          </div>
        </div>

        <div className="relative flex min-h-[500px] min-w-0 items-center justify-center sm:min-h-[580px] lg:min-h-[640px]">
          <div className="relative flex h-[280px] w-[280px] max-w-full items-center justify-center sm:h-[420px] sm:w-[420px] lg:h-[560px] lg:w-[560px]">
            <OrbitRings />
            <Coin3D />
          </div>

          <Card className="absolute left-1/2 top-0 w-[calc(100%-16px)] max-w-[280px] -translate-x-1/2 sm:left-0 sm:top-12 sm:w-64 sm:translate-x-0">
            <p className="text-xs text-gray-400 sm:text-sm">
              Circulating Supply
            </p>

            <h3 className="mt-2 text-xl font-bold text-yellow-400 sm:text-2xl">
              1.2B π
            </h3>

            <p className="mt-2 text-xs text-gray-400 sm:text-sm">
              Official network supply
            </p>
          </Card>

          <Card className="absolute bottom-0 right-1/2 w-[calc(100%-16px)] max-w-[280px] translate-x-1/2 sm:bottom-10 sm:right-0 sm:w-72 sm:translate-x-0">
            <p className="text-xs text-gray-400 sm:text-sm">
              Official Market
            </p>

            <h3 className="mt-2 text-xl font-bold text-emerald-400 sm:text-2xl">
              OPEN
            </h3>

            <p className="mt-2 text-xs text-gray-400 sm:text-sm">
              PLATON market is active
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
