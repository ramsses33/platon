"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect } from "react";

export default function OrbitRings() {
  const reducedMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 35,
    damping: 18,
    mass: 0.8,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 35,
    damping: 18,
    mass: 0.8,
  });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    if (reducedMotion || !finePointer.matches) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      const normalizedX = event.clientX / window.innerWidth - 0.5;
      const normalizedY = event.clientY / window.innerHeight - 0.5;

      pointerX.set(normalizedX * 24);
      pointerY.set(normalizedY * 16);
    }

    function resetPointer() {
      pointerX.set(0);
      pointerY.set(0);
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    window.addEventListener("blur", resetPointer);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPointer);
    };
  }, [pointerX, pointerY, reducedMotion]);

  return (
    <div className="pointer-events-none absolute inset-[-28%] flex items-center justify-center overflow-visible">
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="relative flex h-full w-full items-center justify-center"
      >
        <motion.div
          animate={
            reducedMotion
              ? {
                  opacity: 0.2,
                  scale: 1,
                }
              : {
                  opacity: [0.16, 0.3, 0.16],
                  scale: [0.96, 1.05, 0.96],
                }
          }
          transition={{
            duration: 4.5,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="absolute h-[58%] w-[58%] rounded-full bg-yellow-400/[0.08] blur-[55px]"
        />

        <motion.div
          animate={
            reducedMotion
              ? {
                  scale: 1,
                  opacity: 0.14,
                }
              : {
                  scale: [0.72, 1.3],
                  opacity: [0.22, 0],
                }
          }
          transition={{
            duration: 3.8,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "easeOut",
          }}
          className="absolute h-[72%] w-[72%] rounded-full border border-yellow-300/20"
        />

        <motion.div
          animate={
            reducedMotion
              ? {
                  scale: 1,
                  opacity: 0.1,
                }
              : {
                  scale: [0.78, 1.42],
                  opacity: [0.18, 0],
                }
          }
          transition={{
            duration: 4.8,
            delay: 1.4,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "easeOut",
          }}
          className="absolute h-[78%] w-[78%] rounded-full border border-emerald-300/15"
        />

        <motion.div
          animate={{
            rotate: reducedMotion ? 0 : 360,
          }}
          transition={{
            duration: 26,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute h-[82%] w-[82%] rounded-full border border-yellow-300/20 shadow-[0_0_35px_rgba(250,204,21,0.08),inset_0_0_30px_rgba(250,204,21,0.04)]"
        >
          <span className="absolute left-1/2 top-[-4px] h-2 w-2 -translate-x-1/2 rounded-full bg-yellow-200 shadow-[0_0_8px_rgba(254,240,138,1),0_0_22px_rgba(250,204,21,0.9)]" />

          <span className="absolute bottom-[12%] right-[5%] h-1.5 w-1.5 rounded-full bg-yellow-400/80 shadow-[0_0_14px_rgba(250,204,21,0.8)]" />
        </motion.div>

        <motion.div
          animate={{
            rotate: reducedMotion ? 18 : -342,
          }}
          transition={{
            duration: 34,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute h-[62%] w-[112%] rounded-[50%] border border-cyan-300/20 shadow-[0_0_34px_rgba(34,211,238,0.06)]"
        >
          <span className="absolute left-[12%] top-[4%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(165,243,252,1),0_0_24px_rgba(34,211,238,0.9)]" />

          <span className="absolute bottom-[5%] right-[17%] h-1.5 w-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
        </motion.div>

        <motion.div
          animate={{
            rotate: reducedMotion ? -28 : 332,
          }}
          transition={{
            duration: 30,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute h-[112%] w-[64%] rounded-[50%] border border-emerald-300/20 shadow-[0_0_35px_rgba(52,211,153,0.06)]"
        >
          <span className="absolute right-[5%] top-[22%] h-2 w-2 rounded-full bg-emerald-200 shadow-[0_0_8px_rgba(167,243,208,1),0_0_24px_rgba(52,211,153,0.9)]" />
        </motion.div>

        <motion.div
          animate={{
            rotate: reducedMotion ? 0 : 360,
          }}
          transition={{
            duration: 44,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute h-[132%] w-[132%] rounded-full opacity-70"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(34,211,238,0.55) 16deg, transparent 42deg, transparent 112deg, rgba(250,204,21,0.45) 132deg, transparent 162deg, transparent 235deg, rgba(52,211,153,0.45) 252deg, transparent 282deg)",
            WebkitMaskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 1px))",
            maskImage:
              "radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 1px))",
          }}
        />

        <motion.div
          animate={{
            rotate: reducedMotion ? 0 : -360,
          }}
          transition={{
            duration: 58,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute h-[150%] w-[150%] rounded-full border border-dashed border-white/[0.07]"
        >
          <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/70 shadow-[0_0_14px_rgba(255,255,255,0.7)]" />
        </motion.div>

        <motion.div
          animate={
            reducedMotion
              ? {
                  rotate: 0,
                }
              : {
                  rotate: [0, 360],
                }
          }
          transition={{
            duration: 18,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute h-[96%] w-[96%]"
        >
          <div className="absolute left-1/2 top-0 h-8 w-[2px] -translate-x-1/2 bg-gradient-to-b from-cyan-200 via-cyan-400/70 to-transparent blur-[1px]" />
        </motion.div>

        <motion.div
          animate={
            reducedMotion
              ? {
                  rotate: 0,
                }
              : {
                  rotate: [0, -360],
                }
          }
          transition={{
            duration: 23,
            repeat: reducedMotion ? 0 : Infinity,
            ease: "linear",
          }}
          className="absolute h-[116%] w-[116%]"
        >
          <div className="absolute bottom-0 left-1/2 h-10 w-[2px] -translate-x-1/2 bg-gradient-to-t from-yellow-200 via-yellow-400/70 to-transparent blur-[1px]" />
        </motion.div>

        <div className="absolute h-[46%] w-[46%] rounded-full border border-yellow-200/10 shadow-[0_0_55px_rgba(212,175,55,0.08),inset_0_0_35px_rgba(212,175,55,0.06)]" />
      </motion.div>
    </div>
  );
}