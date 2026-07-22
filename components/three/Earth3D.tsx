"use client";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";
import {
  useEffect,
  useRef,
} from "react";
import * as THREE from "three";

type PointerPosition = {
  x: number;
  y: number;
};

function EarthModel() {
  const groupRef =
    useRef<THREE.Group>(null);

  const coreRef =
    useRef<THREE.Mesh>(null);

  const gridRef =
    useRef<THREE.Mesh>(null);

  const atmosphereRef =
    useRef<THREE.Mesh>(null);

  const outerGlowRef =
    useRef<THREE.Mesh>(null);

  const pointerRef =
    useRef<PointerPosition>({
      x: 0,
      y: 0,
    });

  const reducedMotionRef =
    useRef(false);

  const pointerStrengthRef =
    useRef(1);

  useEffect(() => {
    const reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    const coarsePointerQuery =
      window.matchMedia(
        "(pointer: coarse)",
      );

    function updatePreferences() {
      reducedMotionRef.current =
        reducedMotionQuery.matches;

      pointerStrengthRef.current =
        coarsePointerQuery.matches
          ? 0
          : 1;
    }

    function handlePointerMove(
      event: PointerEvent,
    ) {
      if (
        reducedMotionRef.current ||
        pointerStrengthRef.current === 0
      ) {
        return;
      }

      pointerRef.current = {
        x:
          (event.clientX /
            window.innerWidth) *
            2 -
          1,
        y:
          (event.clientY /
            window.innerHeight) *
            2 -
          1,
      };
    }

    updatePreferences();

    reducedMotionQuery.addEventListener(
      "change",
      updatePreferences,
    );

    coarsePointerQuery.addEventListener(
      "change",
      updatePreferences,
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      },
    );

    return () => {
      reducedMotionQuery.removeEventListener(
        "change",
        updatePreferences,
      );

      coarsePointerQuery.removeEventListener(
        "change",
        updatePreferences,
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const core = coreRef.current;
    const grid = gridRef.current;
    const atmosphere =
      atmosphereRef.current;
    const outerGlow =
      outerGlowRef.current;

    if (
      !group ||
      !core ||
      !grid ||
      !atmosphere ||
      !outerGlow
    ) {
      return;
    }

    const elapsed =
      clock.getElapsedTime();

    const reducedMotion =
      reducedMotionRef.current;

    const motionMultiplier =
      reducedMotion ? 0 : 1;

    core.rotation.y +=
      delta *
      0.025 *
      motionMultiplier;

    grid.rotation.y +=
      delta *
      0.045 *
      motionMultiplier;

    grid.rotation.x =
      Math.sin(elapsed * 0.22) *
      0.018 *
      motionMultiplier;

    const pointerX =
      pointerRef.current.x *
      pointerStrengthRef.current;

    const pointerY =
      pointerRef.current.y *
      pointerStrengthRef.current;

    const targetRotationX =
      reducedMotion
        ? 0
        : -pointerY * 0.07;

    const targetRotationY =
      reducedMotion
        ? 0
        : pointerX * 0.09;

    const targetPositionX =
      reducedMotion
        ? 0
        : pointerX * 0.08;

    const targetPositionY =
      reducedMotion
        ? 0
        : -pointerY * 0.055 +
          Math.sin(
            elapsed * 0.34,
          ) *
            0.04;

    const smoothing =
      1 -
      Math.exp(-delta * 2.4);

    group.rotation.x =
      THREE.MathUtils.lerp(
        group.rotation.x,
        targetRotationX,
        smoothing,
      );

    group.rotation.y =
      THREE.MathUtils.lerp(
        group.rotation.y,
        targetRotationY,
        smoothing,
      );

    group.position.x =
      THREE.MathUtils.lerp(
        group.position.x,
        targetPositionX,
        smoothing,
      );

    group.position.y =
      THREE.MathUtils.lerp(
        group.position.y,
        targetPositionY,
        smoothing,
      );

    const atmosphereScale =
      reducedMotion
        ? 1
        : 1 +
          Math.sin(
            elapsed * 0.62,
          ) *
            0.008;

    atmosphere.scale.setScalar(
      atmosphereScale,
    );

    const glowScale =
      reducedMotion
        ? 1
        : 1 +
          Math.sin(
            elapsed * 0.48,
          ) *
            0.018;

    outerGlow.scale.setScalar(
      glowScale,
    );
  });

  return (
    <group
      ref={groupRef}
      rotation={[
        -0.08,
        -0.28,
        0.04,
      ]}
    >
      <mesh ref={coreRef}>
        <sphereGeometry
          args={[
            3.05,
            72,
            72,
          ]}
        />

        <meshStandardMaterial
          color="#06151B"
          emissive="#004F5B"
          emissiveIntensity={0.38}
          metalness={0.58}
          roughness={0.44}
          transparent
          opacity={0.88}
        />
      </mesh>

      <mesh
        ref={gridRef}
        scale={1.012}
      >
        <sphereGeometry
          args={[
            3.07,
            42,
            42,
          ]}
        />

        <meshBasicMaterial
          color="#30E4E8"
          transparent
          opacity={0.16}
          wireframe
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={atmosphereRef}
        scale={1.045}
      >
        <sphereGeometry
          args={[
            3.08,
            64,
            64,
          ]}
        />

        <meshBasicMaterial
          color="#00D8E6"
          transparent
          opacity={0.065}
          side={THREE.BackSide}
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={outerGlowRef}
        scale={1.12}
      >
        <sphereGeometry
          args={[
            3.08,
            48,
            48,
          ]}
        />

        <meshBasicMaterial
          color="#00D6CE"
          transparent
          opacity={0.025}
          side={THREE.BackSide}
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
          toneMapped={false}
        />
      </mesh>

      <mesh
        position={[
          0,
          0,
          0.06,
        ]}
        scale={1.025}
      >
        <torusGeometry
          args={[
            3.08,
            0.018,
            10,
            180,
          ]}
        />

        <meshBasicMaterial
          color="#E1B842"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function Earth3D() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[58%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-45 sm:h-[750px] sm:w-[750px] sm:opacity-55 lg:left-[67%] lg:top-[51%] lg:h-[920px] lg:w-[920px] lg:opacity-70">
        <Canvas
          camera={{
            position: [
              0,
              0,
              7.8,
            ],
            fov: 44,
          }}
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference:
              "high-performance",
          }}
        >
          <ambientLight
            intensity={0.5}
          />

          <directionalLight
            position={[
              4,
              5,
              6,
            ]}
            intensity={2.2}
            color="#9BF4F3"
          />

          <directionalLight
            position={[
              -4,
              -1,
              4,
            ]}
            intensity={1.15}
            color="#D4AF37"
          />

          <pointLight
            position={[
              -4,
              2,
              5,
            ]}
            intensity={8}
            distance={15}
            color="#00D7CF"
          />

          <pointLight
            position={[
              5,
              -2,
              4,
            ]}
            intensity={5}
            distance={14}
            color="#E6BA45"
          />

          <EarthModel />
        </Canvas>
      </div>

      <div className="absolute left-1/2 top-[58%] h-[370px] w-[370px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.035] blur-[100px] sm:h-[545px] sm:w-[545px] lg:left-[67%] lg:top-[51%] lg:h-[670px] lg:w-[670px]" />
    </div>
  );
}