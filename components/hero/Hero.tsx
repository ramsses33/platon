"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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
  const reducedMotion =
    useReducedMotion();

  const entrance = (
    delay: number,
  ) => ({
    initial: reducedMotion
      ? {
          opacity: 1,
          y: 0,
        }
      : {
          opacity: 0,
          y: 28,
        },
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration: reducedMotion
        ? 0
        : 0.8,
      delay: reducedMotion
        ? 0
        : delay,
      ease: [
        0.22,
        1,
        0.36,
        1,
      ] as const,
    },
  });

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#040608] pt-24 sm:pt-28 lg:pt-32">
      <div className="absolute inset-0 z-0">
        <StarsBackground />
        <Earth3D />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_72%_38%,rgba(212,175,55,0.18),transparent_28%),radial-gradient(circle_at_66%_52%,rgba(0,231,194,0.12),transparent_36%),radial-gradient(circle_at_24%_45%,rgba(0,217,255,0.08),transparent_42%)]" />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(4,6,8,0.98)_0%,rgba(4,6,8,0.88)_34%,rgba(4,6,8,0.35)_66%,rgba(4,6,8,0.1)_100%)] lg:bg-[linear-gradient(90deg,rgba(4,6,8,0.98)_0%,rgba(4,6,8,0.9)_34%,rgba(4,6,8,0.28)_60%,rgba(4,6,8,0.04)_100%)]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-52 bg-gradient-to-b from-transparent via-[#05070A]/55 to-[#05070A]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-96px)] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:min-h-[calc(100svh-112px)] sm:gap-12 sm:px-6 sm:py-14 lg:min-h-[calc(100svh-128px)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-10 lg:px-8 lg:py-16">
        <div className="relative z-20 min-w-0">
          <motion.div
            {...entrance(0.05)}
            className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6"
          >
            <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.09] px-3 py-2 text-[10px] font-black uppercase leading-5 tracking-[0.18em] text-emerald-300 backdrop-blur-xl sm:px-4 sm:text-xs sm:tracking-[0.22em]">
              <ShieldCheck
                size={14}
                strokeWidth={2.4}
              />

              Official Network-Priced Currency
            </p>

            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/[0.08] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-yellow-300 backdrop-blur-xl">
              <Sparkles
                size={13}
                strokeWidth={2.4}
              />

              PLATON Network
            </span>
          </motion.div>

          <motion.h1
            {...entrance(0.12)}
            className="break-words text-5xl font-black leading-[0.9] tracking-[-0.06em] sm:text-6xl md:text-7xl xl:text-[92px]"
          >
            PLATON{" "}
            <span className="relative inline-block text-yellow-400">
              π

              <span className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-yellow-400/15 blur-2xl" />
            </span>
          </motion.h1>

          <motion.p
            {...entrance(0.2)}
            className="mt-5 max-w-xl text-lg font-medium leading-7 text-gray-100 sm:mt-6 sm:text-xl sm:leading-8 md:text-2xl"
          >
            One official ecosystem for buying,
            selling, storing, staking and using π.
          </motion.p>

          <motion.p
            {...entrance(0.28)}
            className="mt-4 max-w-xl text-sm leading-6 text-gray-400 sm:text-base sm:leading-7"
          >
            PLATON is available only through its
            official network. The network price
            updates automatically every 13 minutes.
          </motion.p>

          <motion.div
            {...entrance(0.36)}
            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
          >
            <Link
              href="/market"
              className="w-full sm:w-auto"
            >
              <Button variant="gold">
                Buy π Now
              </Button>
            </Link>

            <Link
              href="#ecosystem"
              className="w-full sm:w-auto"
            >
              <Button>
                Explore the Ecosystem
              </Button>
            </Link>

            <Link
              href="/whitepaper"
              className="w-full sm:w-auto"
            >
              <Button variant="secondary">
                Whitepaper
              </Button>
            </Link>
          </motion.div>

          <motion.div
            {...entrance(0.44)}
            className="mt-9 grid min-w-0 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5"
          >
            <Card className="group relative min-w-0 overflow-hidden border-yellow-400/10 bg-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-yellow-400/25">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-yellow-400/[0.08] blur-[55px] transition duration-500 group-hover:scale-125" />

              <div className="relative">
                <p className="text-sm font-medium text-gray-400 sm:text-base">
                  Current Price
                </p>

                <PriceTicker />

                <p className="mt-2 flex items-center gap-2 text-xs text-emerald-400 sm:text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>

                  Official network price
                </p>
              </div>
            </Card>

            <Card className="group relative min-w-0 overflow-hidden border-cyan-400/10 bg-black/25 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/25">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/[0.08] blur-[55px] transition duration-500 group-hover:scale-125" />

              <div className="relative">
                <p className="text-sm font-medium text-gray-400 sm:text-base">
                  Next Price Update
                </p>

                <div className="mt-2">
                  <Countdown />
                </div>

                <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                  Updates every 13 minutes
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={
            reducedMotion
              ? {
                  opacity: 1,
                  scale: 1,
                }
              : {
                  opacity: 0,
                  scale: 0.88,
                }
          }
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: reducedMotion
              ? 0
              : 1.25,
            delay: reducedMotion
              ? 0
              : 0.18,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="relative z-10 flex min-h-[520px] min-w-0 items-center justify-center sm:min-h-[620px] lg:min-h-[680px]"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/[0.07] blur-[80px]" />

          <div className="relative flex h-[330px] w-[330px] max-w-full items-center justify-center sm:h-[460px] sm:w-[460px] lg:h-[590px] lg:w-[590px]">
            <OrbitRings />

            <div className="relative z-10 h-full w-full">
              <Coin3D />
            </div>
          </div>

          <motion.div
            animate={
              reducedMotion
                ? {
                    y: 0,
                  }
                : {
                    y: [
                      0,
                      -8,
                      0,
                    ],
                  }
            }
            transition={{
              duration: 5,
              repeat: reducedMotion
                ? 0
                : Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1 w-[calc(100%-20px)] max-w-[275px] -translate-x-1/2 sm:left-0 sm:top-12 sm:w-64 sm:translate-x-0"
          >
            <Card className="border-yellow-400/10 bg-black/30 backdrop-blur-2xl">
              <p className="text-xs font-medium text-gray-400 sm:text-sm">
                Circulating Supply
              </p>

              <h3 className="mt-2 text-xl font-black text-yellow-400 sm:text-2xl">
                1.2B π
              </h3>

              <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                Official network supply
              </p>
            </Card>
          </motion.div>

          <motion.div
            animate={
              reducedMotion
                ? {
                    y: 0,
                  }
                : {
                    y: [
                      0,
                      8,
                      0,
                    ],
                  }
            }
            transition={{
              duration: 5.8,
              delay: 0.6,
              repeat: reducedMotion
                ? 0
                : Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 right-1/2 w-[calc(100%-20px)] max-w-[280px] translate-x-1/2 sm:bottom-10 sm:right-0 sm:w-72 sm:translate-x-0"
          >
            <Card className="border-emerald-400/10 bg-black/30 backdrop-blur-2xl">
              <p className="text-xs font-medium text-gray-400 sm:text-sm">
                Official Market
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-65" />

                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                </span>

                <h3 className="text-xl font-black text-emerald-400 sm:text-2xl">
                  OPEN
                </h3>
              </div>

              <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                PLATON market is active
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 1,
          delay: reducedMotion
            ? 0
            : 1.2,
        }}
        className="relative z-20 mx-auto flex w-full max-w-7xl justify-center px-4 pb-6"
      >
        <Link
          href="#ecosystem"
          className="group inline-flex flex-col items-center gap-2 text-white/35 transition hover:text-white/70"
          aria-label="Explore the PLATON ecosystem"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.24em]">
            Explore
          </span>

          <motion.span
            animate={
              reducedMotion
                ? {
                    y: 0,
                  }
                : {
                    y: [
                      0,
                      6,
                      0,
                    ],
                  }
            }
            transition={{
              duration: 2,
              repeat: reducedMotion
                ? 0
                : Infinity,
              ease: "easeInOut",
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl"
          >
            <ArrowDown size={15} />
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
}