"use client";

import { RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type PointerPosition = {
  x: number;
  y: number;
};

type PiSymbolProps = {
  back?: boolean;
};

function PiSymbol({ back = false }: PiSymbolProps) {
  const z = back ? -0.255 : 0.255;

  return (
    <group
      position={[0, 0, z]}
      rotation={[0, back ? Math.PI : 0, 0]}
    >
      <RoundedBox
        args={[1.78, 0.24, 0.13]}
        radius={0.055}
        smoothness={5}
        position={[0, 0.52, 0]}
      >
        <meshPhysicalMaterial
          color="#7B551C"
          metalness={1}
          roughness={0.28}
          clearcoat={0.2}
          clearcoatRoughness={0.32}
          emissive="#1A1003"
          emissiveIntensity={0.025}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.27, 1.42, 0.13]}
        radius={0.055}
        smoothness={5}
        position={[-0.53, -0.14, 0]}
        rotation={[0, 0, -0.035]}
      >
        <meshPhysicalMaterial
          color="#7B551C"
          metalness={1}
          roughness={0.28}
          clearcoat={0.2}
          clearcoatRoughness={0.32}
          emissive="#1A1003"
          emissiveIntensity={0.025}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.27, 1.42, 0.13]}
        radius={0.055}
        smoothness={5}
        position={[0.53, -0.14, 0]}
        rotation={[0, 0, 0.035]}
      >
        <meshPhysicalMaterial
          color="#7B551C"
          metalness={1}
          roughness={0.28}
          clearcoat={0.2}
          clearcoatRoughness={0.32}
          emissive="#1A1003"
          emissiveIntensity={0.025}
        />
      </RoundedBox>
    </group>
  );
}

function CoinModel() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.44, 128, 5]} />

        <meshPhysicalMaterial
          color="#AE7D28"
          metalness={1}
          roughness={0.3}
          clearcoat={0.18}
          clearcoatRoughness={0.36}
          emissive="#160D02"
          emissiveIntensity={0.025}
        />
      </mesh>

      <mesh
        position={[0, 0, 0.226]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[1.91, 1.91, 0.05, 128]} />

        <meshPhysicalMaterial
          color="#D2A747"
          metalness={1}
          roughness={0.24}
          clearcoat={0.28}
          clearcoatRoughness={0.3}
          emissive="#1F1404"
          emissiveIntensity={0.025}
        />
      </mesh>

      <mesh
        position={[0, 0, -0.226]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[1.91, 1.91, 0.05, 128]} />

        <meshPhysicalMaterial
          color="#B5842E"
          metalness={1}
          roughness={0.28}
          clearcoat={0.2}
          clearcoatRoughness={0.34}
          emissive="#170E02"
          emissiveIntensity={0.02}
        />
      </mesh>

      <mesh position={[0, 0, 0.258]}>
        <torusGeometry args={[1.94, 0.072, 20, 160]} />

        <meshPhysicalMaterial
          color="#E9CB72"
          metalness={1}
          roughness={0.18}
          clearcoat={0.38}
          clearcoatRoughness={0.24}
          emissive="#211503"
          emissiveIntensity={0.025}
        />
      </mesh>

      <mesh position={[0, 0, -0.258]}>
        <torusGeometry args={[1.94, 0.072, 20, 160]} />

        <meshPhysicalMaterial
          color="#C69A3D"
          metalness={1}
          roughness={0.23}
          clearcoat={0.24}
          clearcoatRoughness={0.3}
          emissive="#190F02"
          emissiveIntensity={0.02}
        />
      </mesh>

      <mesh position={[0, 0, 0.268]}>
        <torusGeometry args={[1.56, 0.024, 14, 140]} />

        <meshPhysicalMaterial
          color="#F2DA8A"
          metalness={1}
          roughness={0.16}
          clearcoat={0.35}
          clearcoatRoughness={0.22}
        />
      </mesh>

      <mesh position={[0, 0, -0.268]}>
        <torusGeometry args={[1.56, 0.024, 14, 140]} />

        <meshPhysicalMaterial
          color="#B9872D"
          metalness={1}
          roughness={0.24}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      <mesh position={[0, 0, 0.272]}>
        <ringGeometry args={[1.18, 1.24, 128]} />

        <meshPhysicalMaterial
          color="#8B6020"
          metalness={1}
          roughness={0.34}
          clearcoat={0.12}
          clearcoatRoughness={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh
        position={[0, 0, -0.272]}
        rotation={[0, Math.PI, 0]}
      >
        <ringGeometry args={[1.18, 1.24, 128]} />

        <meshPhysicalMaterial
          color="#74501B"
          metalness={1}
          roughness={0.36}
          clearcoat={0.1}
          clearcoatRoughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      <PiSymbol />
      <PiSymbol back />
    </group>
  );
}

function CoinScene() {
  const coinRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const energyRingOneRef = useRef<THREE.Mesh>(null);
  const energyRingTwoRef = useRef<THREE.Mesh>(null);
  const highlightRef = useRef<THREE.PointLight>(null);

  const pointerRef = useRef<PointerPosition>({
    x: 0,
    y: 0,
  });

  const reducedMotionRef = useRef(false);
  const pointerStrengthRef = useRef(1);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    function updatePreferences() {
      reducedMotionRef.current = reducedMotionQuery.matches;
      pointerStrengthRef.current = coarsePointerQuery.matches ? 0 : 1;
    }

    function handlePointerMove(event: PointerEvent) {
      if (
        reducedMotionRef.current ||
        pointerStrengthRef.current === 0
      ) {
        return;
      }

      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    }

    updatePreferences();

    reducedMotionQuery.addEventListener("change", updatePreferences);
    coarsePointerQuery.addEventListener("change", updatePreferences);

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      reducedMotionQuery.removeEventListener("change", updatePreferences);
      coarsePointerQuery.removeEventListener("change", updatePreferences);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const coin = coinRef.current;
    const glow = glowRef.current;
    const energyRingOne = energyRingOneRef.current;
    const energyRingTwo = energyRingTwoRef.current;
    const highlight = highlightRef.current;

    if (
      !coin ||
      !glow ||
      !energyRingOne ||
      !energyRingTwo ||
      !highlight
    ) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    const reducedMotion = reducedMotionRef.current;
    const motionMultiplier = reducedMotion ? 0 : 1;

    coin.rotation.y += delta * 0.15 * motionMultiplier;

    const pointerX =
      pointerRef.current.x * pointerStrengthRef.current;

    const pointerY =
      pointerRef.current.y * pointerStrengthRef.current;

    const targetRotationX = reducedMotion
      ? -0.08
      : -0.08 - pointerY * 0.08;

    const targetRotationZ = reducedMotion
      ? -0.04
      : -0.04 - pointerX * 0.055;

    const targetPositionX = reducedMotion ? 0 : pointerX * 0.07;

    const targetPositionY = reducedMotion
      ? 0
      : -pointerY * 0.045 + Math.sin(elapsed * 0.68) * 0.07;

    const smoothing = 1 - Math.exp(-delta * 3);

    coin.rotation.x = THREE.MathUtils.lerp(
      coin.rotation.x,
      targetRotationX,
      smoothing,
    );

    coin.rotation.z = THREE.MathUtils.lerp(
      coin.rotation.z,
      targetRotationZ,
      smoothing,
    );

    coin.position.x = THREE.MathUtils.lerp(
      coin.position.x,
      targetPositionX,
      smoothing,
    );

    coin.position.y = THREE.MathUtils.lerp(
      coin.position.y,
      targetPositionY,
      smoothing,
    );

    const glowScale = reducedMotion
      ? 1
      : 1 + Math.sin(elapsed * 0.75) * 0.018;

    glow.scale.setScalar(glowScale);

    energyRingOne.rotation.z = elapsed * 0.23 * motionMultiplier;
    energyRingTwo.rotation.z = -elapsed * 0.17 * motionMultiplier;

    highlight.position.x = Math.sin(elapsed * 0.62) * 4.1;
    highlight.position.y = 2 + Math.cos(elapsed * 0.48) * 1.25;
    highlight.position.z = 5 + Math.cos(elapsed * 0.62) * 1.1;
  });

  return (
    <>
      <pointLight
        ref={highlightRef}
        position={[3.5, 3, 5]}
        intensity={17}
        distance={14}
        color="#FFF1C4"
      />

      <mesh ref={glowRef} position={[0, 0, -0.55]}>
        <ringGeometry args={[1.7, 2.75, 128]} />

        <meshBasicMaterial
          color="#CFAE58"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={energyRingOneRef}
        rotation={[1.08, 0.32, 0]}
      >
        <torusGeometry args={[2.32, 0.014, 8, 150]} />

        <meshBasicMaterial
          color="#E8CF82"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={energyRingTwoRef}
        rotation={[0.25, 0.86, 0.4]}
      >
        <torusGeometry args={[2.58, 0.01, 8, 150]} />

        <meshBasicMaterial
          color="#6EC9C0"
          transparent
          opacity={0.13}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <group
        ref={coinRef}
        scale={0.9}
        rotation={[-0.08, 0.28, -0.04]}
      >
        <CoinModel />
      </group>
    </>
  );
}

export default function Coin3D() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{
          position: [0, 0, 6.8],
          fov: 44,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <ambientLight intensity={0.34} />

        <directionalLight
          position={[5, 6, 7]}
          intensity={3.4}
          color="#FFF2CA"
        />

        <directionalLight
          position={[-4, 1, 4]}
          intensity={1.15}
          color="#D4B56A"
        />

        <pointLight
          position={[-4, -2, 4]}
          intensity={3.2}
          distance={12}
          color="#8CCFC8"
        />

        <pointLight
          position={[3, -3, 5]}
          intensity={7}
          distance={12}
          color="#E4C36C"
        />

        <CoinScene />
      </Canvas>
    </div>
  );
}