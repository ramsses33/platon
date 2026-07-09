"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Html, OrbitControls } from "@react-three/drei";


function Coin() {
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.35, 96]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={1}
          roughness={0.18}
          emissive="#7a5200"
          emissiveIntensity={0.25}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.05, 0.06, 16, 128]} />
        <meshStandardMaterial color="#FFE27A" metalness={1} roughness={0.12} />
      </mesh>

      <Html center transform position={[0, 0, 0.25]}>
        <div className="select-none text-[150px] font-black text-black drop-shadow-2xl">
          π
        </div>
      </Html>
    </Float>
  );
}

export default function Coin3D() {
  return (
    <div className="h-[520px] w-[520px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[4, 5, 6]} intensity={90} color="#FFD86B" />
        <pointLight position={[-5, -3, 4]} intensity={35} color="#00E0B8" />
        <Coin />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}