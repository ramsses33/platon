"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function EarthMesh() {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2.8, 64, 64]} />
      <meshStandardMaterial
        color="#00B5FF"
        transparent
        opacity={0.16}
        emissive="#00D9FF"
        emissiveIntensity={1.2}
        wireframe
      />
    </mesh>
  );
}

export default function Earth3D() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-[720px] w-[720px] opacity-60">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          <ambientLight intensity={1} />
          <pointLight position={[4, 4, 6]} intensity={25} />
          <EarthMesh />
        </Canvas>
      </div>
    </div>
  );
}