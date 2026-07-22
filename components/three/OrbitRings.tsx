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
    stiffness: 28,
    damping: 24,
    mass: 1,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 28,
    damping: 24,
    mass: 1,
  });

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(pointer: fine)",
    );

    if (
      reducedMotion ||
      !finePointer.matches
    ) {
      return;
    }

    function handlePointerMove(
      event: PointerEvent,
    ) {
      const normalizedX =
        event.clientX /
          window.innerWidth -
        0.5;

      const normalizedY =
        event.clientY /
          window.innerHeight -
        0.5;

      pointerX.set(normalizedX * 7);
      pointerY.set(normalizedY * 5);
    }

    function resetPointer() {
      pointerX.set(0);
      pointerY.set(0);
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "blur",
      resetPointer,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      window.removeEventListener(
        "blur",
        resetPointer,
      );
    };
  }, [
    pointerX,
    pointerY,
    reducedMotion,
  ]);

  return (
    <div className="pointer-events-none absolute inset-[-18%] flex items-center justify-center overflow-visible">
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="relative flex h-full w-full items-center justify-center"
      >
        <div className="absolute h-[48%] w-[48%] rounded-full bg-[#C9A85A]/[0.035] blur-[65px]" />

        <div className="absolute h-[53%] w-[53%] rounded-full border border-[#D8BE76]/[0.055]" />

        <motion.div
          animate={{
            rotate: reducedMotion
              ? -10
              : 350,
          }}
          transition={{
            duration: 42,
            repeat: reducedMotion
              ? 0
              : Infinity,
            ease: "linear",
          }}
          className="absolute h-[65%] w-[112%] rounded-[50%] border border-[#D9BE72]/20"
        >
          <span className="absolute left-[8%] top-[19%] h-1.5 w-1.5 rounded-full bg-[#F0DC9A]/80 shadow-[0_0_8px_rgba(240,220,154,0.38)]" />

          <span className="absolute bottom-[12%] right-[17%] h-1 w-1 rounded-full bg-[#C9A75B]/65" />

          <span className="absolute right-[4%] top-[44%] h-[3px] w-[3px] rounded-full bg-white/35" />

          <span className="absolute left-[46%] top-[-1px] h-[2px] w-12 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#F3DEA0]/45 to-transparent blur-[0.5px]" />
        </motion.div>

        <motion.div
          animate={
            reducedMotion
              ? {
                  opacity: 0.07,
                  scale: 1,
                }
              : {
                  opacity: [
                    0.035,
                    0.085,
                    0.035,
                  ],
                  scale: [
                    0.98,
                    1.015,
                    0.98,
                  ],
                }
          }
          transition={{
            duration: 7,
            repeat: reducedMotion
              ? 0
              : Infinity,
            ease: "easeInOut",
          }}
          className="absolute h-[73%] w-[73%] rounded-full border border-[#D9BE72]/10"
        />

        <div className="absolute h-[42%] w-[42%] rounded-full shadow-[0_0_55px_rgba(201,168,90,0.055),inset_0_0_35px_rgba(201,168,90,0.025)]" />
      </motion.div>
    </div>
  );
}