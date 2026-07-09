"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Countdown from "@/components/market/Countdown";
import PriceTicker from "@/components/market/PriceTicker";
import Coin3D from "@/components/three/Coin3D";
import Earth3D from "@/components/three/Earth3D";
import StarsBackground from "@/components/three/StarsBackground";
import OrbitRings from "@/components/three/OrbitRings";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#040608] pt-32">
      <StarsBackground />
      <Earth3D />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(212,175,55,0.22),transparent_34%),radial-gradient(circle_at_28%_45%,rgba(0,231,194,0.18),transparent_42%)]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-128px)] max-w-7xl items-center gap-16 px-8 py-16 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm uppercase tracking-[4px] text-emerald-300">
            Official Network-Priced Digital Currency
          </p>

          <h1 className="text-6xl font-black leading-none md:text-8xl">
            PLATON <span className="text-yellow-400">π</span>
          </h1>

          <p className="mt-6 max-w-xl text-2xl text-gray-200">
            The first digital currency sold only through its official market.
          </p>

          <p className="mt-4 max-w-xl text-gray-400">
            Buy, sell, store and stake π inside the PLATON ecosystem. The
            official price updates automatically every 13 minutes.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/market">
              <Button variant="gold">Buy π Now</Button>
            </Link>

            <Button variant="secondary">Whitepaper</Button>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <Card>
              <p className="text-gray-400">Current Price</p>
              <PriceTicker />
              <p className="mt-2 text-sm text-emerald-400">
                Official network price
              </p>
            </Card>

            <Card>
              <p className="text-gray-400">Next Price Update</p>
              <div className="mt-2">
                <Countdown />
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Updates every 13 minutes
              </p>
            </Card>
          </div>
        </div>

        <div className="relative flex min-h-[640px] items-center justify-center">
          <OrbitRings />
          <Coin3D />

          <Card className="absolute bottom-10 right-0 w-72">
            <p className="text-sm text-gray-400">Official Market</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-400">OPEN</h3>
            <p className="mt-2 text-sm text-gray-400">
              PLATON market is active
            </p>
          </Card>

          <Card className="absolute left-0 top-12 w-64">
            <p className="text-sm text-gray-400">Circulating Supply</p>
            <h3 className="mt-2 text-2xl font-bold text-yellow-400">
              1.2B π
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Official network supply
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}