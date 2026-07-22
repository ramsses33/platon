"use client";

import PlatonGlyph from "@/components/brand/PlatonGlyph";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import Countdown from "@/components/market/Countdown";
import PriceTicker from "@/components/market/PriceTicker";
import Coin3D from "@/components/three/Coin3D";
import Earth3D from "@/components/three/Earth3D";
import OrbitRings from "@/components/three/OrbitRings";
import StarsBackground from "@/components/three/StarsBackground";
import Button from "@/components/ui/Button";

export default function Hero() {
  const reducedMotion = useReducedMotion();

  const entrance = (delay: number) => ({
    initial: reducedMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 24 },
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration: reducedMotion ? 0 : 0.8,
      delay: reducedMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#040608] pt-24 sm:pt-28 lg:pt-32">
      <div className="absolute inset-0 z-0">
        <StarsBackground />
        <Earth3D />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/[0.18]" />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_71%_43%,rgba(201,168,90,0.08),transparent_25%),radial-gradient(circle_at_69%_55%,rgba(80,180,175,0.035),transparent_35%)]" />

      <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(90deg,rgba(4,6,8,0.99)_0%,rgba(4,6,8,0.94)_34%,rgba(4,6,8,0.48)_63%,rgba(4,6,8,0.18)_100%)] lg:bg-[linear-gradient(90deg,rgba(4,6,8,0.99)_0%,rgba(4,6,8,0.94)_32%,rgba(4,6,8,0.35)_59%,rgba(4,6,8,0.12)_100%)]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-44 bg-gradient-to-b from-transparent via-[#05070A]/60 to-[#05070A]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-96px)] w-full max-w-7xl flex-col px-4 sm:min-h-[calc(100svh-112px)] sm:px-6 lg:min-h-[calc(100svh-128px)] lg:px-8">
        <div className="grid flex-1 items-center gap-8 py-10 sm:gap-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-8 lg:py-14">
          <div className="relative z-20 min-w-0">
            <motion.div
              {...entrance(0.05)}
              className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6"
            >
              <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.055] px-3 py-2 text-[10px] font-black uppercase leading-5 tracking-[0.18em] text-emerald-300/85 backdrop-blur-xl sm:px-4 sm:text-xs sm:tracking-[0.22em]">
                <ShieldCheck size={14} strokeWidth={2.2} />
                Official Network-Priced Currency
              </p>

              <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A858]/20 bg-[#C9A858]/[0.045] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#D9C17E]/80 backdrop-blur-xl">
                <Sparkles size={13} strokeWidth={2.2} />
                PLATON Network
              </span>
            </motion.div>

            <motion.h1
              {...entrance(0.12)}
              className="break-words text-5xl font-black leading-[0.9] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl xl:text-[84px]"
            >
              PLATON{" "}
              <span className="inline-flex h-[0.78em] w-[0.78em] translate-y-[0.08em] text-white">
                <PlatonGlyph className="h-full w-full" emeraldAccent />
              </span>
            </motion.h1>

            <motion.p
              {...entrance(0.2)}
              className="mt-5 max-w-xl text-lg font-medium leading-7 text-white/88 sm:mt-6 sm:text-xl sm:leading-8 md:text-2xl"
            >
              One official ecosystem for buying, selling, storing, staking and
              using π.
            </motion.p>

            <motion.p
              {...entrance(0.28)}
              className="mt-4 max-w-xl text-sm leading-6 text-white/38 sm:text-base sm:leading-7"
            >
              PLATON is available only through its official network. The
              network price updates automatically every 13 minutes.
            </motion.p>

            <motion.div
              {...entrance(0.36)}
              className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <Link href="/market" className="w-full sm:w-auto">
                <Button variant="gold">Buy π Now</Button>
              </Link>

              <Link href="#ecosystem" className="w-full sm:w-auto">
                <Button variant="secondary">Explore the Ecosystem</Button>
              </Link>

              <Link
                href="/whitepaper"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/[0.09] px-6 text-sm font-bold text-white/65 transition hover:border-[#C9A858]/25 hover:bg-[#C9A858]/[0.04] hover:text-white sm:w-auto"
              >
                Whitepaper
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={
              reducedMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.94 }
            }
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: reducedMotion ? 0 : 1.1,
              delay: reducedMotion ? 0 : 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 flex min-h-[390px] min-w-0 items-center justify-center sm:min-h-[470px] lg:min-h-[510px]"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A85A]/[0.035] blur-[95px]" />

            <div className="relative flex h-[300px] w-[300px] max-w-full items-center justify-center sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
              <OrbitRings />

              <div className="relative z-10 h-full w-full">
                <Coin3D />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          {...entrance(0.48)}
          className="relative z-20 pb-6 sm:pb-8"
        >
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090C0E]/85 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              <div className="min-w-0 border-b border-r border-white/[0.06] p-5 sm:p-6 lg:border-b-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Current Price
                </p>

                <div className="mt-2 min-w-0 overflow-hidden">
                  <PriceTicker />
                </div>

                <p className="mt-2 flex items-center gap-2 text-[10px] text-emerald-300/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/75" />
                  Official network price
                </p>
              </div>

              <div className="min-w-0 border-b border-white/[0.06] p-5 sm:p-6 lg:border-b-0 lg:border-r">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Next Price Update
                </p>

                <div className="mt-2 min-w-0 overflow-hidden">
                  <Countdown />
                </div>

                <p className="mt-2 text-[10px] text-white/28">
                  Updates every 13 minutes
                </p>
              </div>

              <div className="min-w-0 border-r border-white/[0.06] p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Circulating Supply
                </p>

                <p className="mt-2 text-2xl font-black tracking-tight text-[#D5BA72]">
                  1.2B π
                </p>

                <p className="mt-2 text-[10px] text-white/28">
                  Official network supply
                </p>
              </div>

              <div className="min-w-0 p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Official Market
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-300/75 shadow-[0_0_12px_rgba(110,231,183,0.28)]" />

                  <p className="text-2xl font-black tracking-tight text-white/85">
                    OPEN
                  </p>
                </div>

                <p className="mt-2 text-[10px] text-white/28">
                  PLATON market is active
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reducedMotion ? 0 : 1,
            delay: reducedMotion ? 0 : 1,
          }}
          className="relative z-20 flex justify-center pb-5"
        >
          <Link
            href="#ecosystem"
            className="group inline-flex flex-col items-center gap-2 text-white/22 transition hover:text-white/55"
            aria-label="Explore the PLATON ecosystem"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.24em]">
              Explore
            </span>

            <motion.span
              animate={
                reducedMotion
                  ? { y: 0 }
                  : {
                      y: [0, 5, 0],
                    }
              }
              transition={{
                duration: 2.2,
                repeat: reducedMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.02]"
            >
              <ArrowDown size={15} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}