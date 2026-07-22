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

  const goldRimRef =
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
    const goldRim =
      goldRimRef.current;

    if (
      !group ||
      !core ||
      !grid ||
      !atmosphere ||
      !outerGlow ||
      !goldRim
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
      0.018 *
      motionMultiplier;

    grid.rotation.y +=
      delta *
      0.032 *
      motionMultiplier;

    grid.rotation.x =
      Math.sin(elapsed * 0.18) *
      0.012 *
      motionMultiplier;

    const pointerX =
      pointerRef.current.x *
      pointerStrengthRef.current;

    const pointerY =
      pointerRef.current.y *
      pointerStrengthRef.current;

    const targetRotationX =
      reducedMotion
        ? -0.05
        : -0.05 -
          pointerY * 0.035;

    const targetRotationY =
      reducedMotion
        ? -0.2
        : -0.2 +
          pointerX * 0.045;

    const targetPositionX =
      reducedMotion
        ? 0
        : pointerX * 0.035;

    const targetPositionY =
      reducedMotion
        ? 0
        : -pointerY * 0.025 +
          Math.sin(
            elapsed * 0.28,
          ) *
            0.022;

    const smoothing =
      1 -
      Math.exp(-delta * 2.2);

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
            elapsed * 0.5,
          ) *
            0.004;

    atmosphere.scale.setScalar(
      atmosphereScale,
    );

    const glowScale =
      reducedMotion
        ? 1
        : 1 +
          Math.sin(
            elapsed * 0.4,
          ) *
            0.008;

    outerGlow.scale.setScalar(
      glowScale,
    );

    goldRim.rotation.z =
      elapsed *
      0.012 *
      motionMultiplier;
  });

  return (
    <group
      ref={groupRef}
      rotation={[
        -0.05,
        -0.2,
        0.025,
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
          color="#030B0E"
          emissive="#00343A"
          emissiveIntensity={0.2}
          metalness={0.42}
          roughness={0.56}
          transparent
          opacity={0.76}
        />
      </mesh>

      <mesh
        ref={gridRef}
        scale={1.012}
      >
        <sphereGeometry
          args={[
            3.07,
            40,
            40,
          ]}
        />

        <meshBasicMaterial
          color="#52C7CA"
          transparent
          opacity={0.095}
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
        scale={1.04}
      >
        <sphereGeometry
          args={[
            3.08,
            64,
            64,
          ]}
        />

        <meshBasicMaterial
          color="#50C8C7"
          transparent
          opacity={0.035}
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
        scale={1.1}
      >
        <sphereGeometry
          args={[
            3.08,
            48,
            48,
          ]}
        />

        <meshBasicMaterial
          color="#6FBDB9"
          transparent
          opacity={0.014}
          side={THREE.BackSide}
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={goldRimRef}
        position={[
          -0.08,
          0,
          0.09,
        ]}
        scale={1.025}
      >
        <torusGeometry
          args={[
            3.08,
            0.015,
            10,
            180,
          ]}
        />

        <meshBasicMaterial
          color="#D5BB75"
          transparent
          opacity={0.1}
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
      <div className="absolute left-1/2 top-[59%] h-[535px] w-[535px] -translate-x-1/2 -translate-y-1/2 opacity-30 sm:h-[700px] sm:w-[700px] sm:opacity-38 lg:left-[69%] lg:top-[53%] lg:h-[850px] lg:w-[850px] lg:opacity-48">
        <Canvas
          camera={{
            position: [
              0,
              0,
              7.8,
            ],
            fov: 44,
          }}
          dpr={[1, 1.35]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference:
              "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.toneMapping =
              THREE.ACESFilmicToneMapping;

            gl.toneMappingExposure =
              0.92;

            gl.outputColorSpace =
              THREE.SRGBColorSpace;
          }}
        >
          <ambientLight
            intensity={0.2}
          />

          <directionalLight
            position={[
              5,
              5,
              7,
            ]}
            intensity={1.25}
            color="#A7D8D5"
          />

          <directionalLight
            position={[
              -4,
              1,
              5,
            ]}
            intensity={0.78}
            color="#D6BA72"
          />

          <pointLight
            position={[
              -3,
              1,
              5,
            ]}
            intensity={2.8}
            distance={14}
            color="#D5B96D"
          />

          <pointLight
            position={[
              5,
              -2,
              4,
            ]}
            intensity={2.2}
            distance={15}
            color="#6EC7C2"
          />

          <EarthModel />
        </Canvas>
      </div>

      <div className="absolute left-1/2 top-[59%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[0.018] blur-[110px] sm:h-[470px] sm:w-[470px] lg:left-[69%] lg:top-[53%] lg:h-[570px] lg:w-[570px]" />

      <div className="absolute left-1/2 top-[53%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/25 blur-[75px] sm:h-[420px] sm:w-[420px] lg:left-[69%] lg:h-[500px] lg:w-[500px]" />
    </div>
  );
}