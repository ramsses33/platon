"use client";

import {
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  Canvas,
  useFrame,
} from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";

type PointerPosition = {
  x: number;
  y: number;
};

type PiGlyphLayerProps = {
  shapes: THREE.Shape[];
  z: number;
  depth: number;
  color: string;
  roughness: number;
  clearcoat: number;
  envMapIntensity: number;
};

const EDGE_RIDGES = Array.from(
  { length: 64 },
  (_, index) =>
    (index / 64) * Math.PI * 2,
);

const FACE_MARKS = Array.from(
  { length: 32 },
  (_, index) =>
    (index / 32) * Math.PI * 2,
);

function PiGlyphLayer({
  shapes,
  z,
  depth,
  color,
  roughness,
  clearcoat,
  envMapIntensity,
}: PiGlyphLayerProps) {
  const extrudeSettings = useMemo(
    () => ({
      depth,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.022,
      curveSegments: 20,
    }),
    [depth],
  );

  return (
    <group position={[0, 0, z]}>
      {shapes.map((shape, index) => (
        <mesh key={index}>
          <extrudeGeometry
            args={[
              shape,
              extrudeSettings,
            ]}
          />

          <meshPhysicalMaterial
            color={color}
            metalness={1}
            roughness={roughness}
            clearcoat={clearcoat}
            clearcoatRoughness={0.28}
            envMapIntensity={
              envMapIntensity
            }
          />
        </mesh>
      ))}
    </group>
  );
}

function PiEmblem({
  back = false,
}: {
  back?: boolean;
}) {
  const shapes = useMemo(() => {
    const scale = 0.049;

    const x = (value: number) =>
      (value - 32) * scale;

    const y = (value: number) =>
      (32 - value) * scale;

    const topLeft =
      new THREE.Shape();

    topLeft.moveTo(
      x(10.5),
      y(15.5),
    );

    topLeft.lineTo(
      x(33),
      y(15.5),
    );

    topLeft.lineTo(
      x(29.3),
      y(21.5),
    );

    topLeft.lineTo(
      x(10.5),
      y(21.5),
    );

    topLeft.closePath();

    const topRight =
      new THREE.Shape();

    topRight.moveTo(
      x(37.2),
      y(15.5),
    );

    topRight.lineTo(
      x(53.5),
      y(15.5),
    );

    topRight.lineTo(
      x(52.3),
      y(21.5),
    );

    topRight.lineTo(
      x(32.7),
      y(21.5),
    );

    topRight.closePath();

    const leftStem =
      new THREE.Shape();

    leftStem.moveTo(
      x(17.5),
      y(24.5),
    );

    leftStem.lineTo(
      x(24.6),
      y(24.5),
    );

    leftStem.lineTo(
      x(24.6),
      y(47.3),
    );

    leftStem.bezierCurveTo(
      x(24.6),
      y(49.5),
      x(25.6),
      y(50.4),
      x(29.2),
      y(50.4),
    );

    leftStem.lineTo(
      x(29.2),
      y(52),
    );

    leftStem.lineTo(
      x(12.8),
      y(52),
    );

    leftStem.lineTo(
      x(12.8),
      y(50.4),
    );

    leftStem.bezierCurveTo(
      x(16.5),
      y(50.4),
      x(17.5),
      y(49.5),
      x(17.5),
      y(47.3),
    );

    leftStem.closePath();

    const rightStem =
      new THREE.Shape();

    rightStem.moveTo(
      x(39.3),
      y(24.5),
    );

    rightStem.lineTo(
      x(46.9),
      y(24.5),
    );

    rightStem.bezierCurveTo(
      x(43.8),
      y(29.3),
      x(42.5),
      y(34.8),
      x(43.6),
      y(39.7),
    );

    rightStem.bezierCurveTo(
      x(44.8),
      y(45),
      x(48.4),
      y(49),
      x(54.5),
      y(51.9),
    );

    rightStem.bezierCurveTo(
      x(48.8),
      y(51.4),
      x(44.1),
      y(48.8),
      x(40.8),
      y(44.6),
    );

    rightStem.bezierCurveTo(
      x(36.4),
      y(38.9),
      x(35.9),
      y(30.7),
      x(39.3),
      y(24.5),
    );

    rightStem.closePath();

    return [
      topLeft,
      topRight,
      leftStem,
      rightStem,
    ];
  }, []);

  return (
    <group
      position={[
        -0.03,
        0,
        back ? -0.286 : 0.286,
      ]}
      rotation={[
        0,
        back ? Math.PI : 0,
        0,
      ]}
      scale={0.82}
    >
      <PiGlyphLayer
        shapes={shapes}
        z={0}
        depth={0.065}
        color="#624115"
        roughness={0.38}
        clearcoat={0.1}
        envMapIntensity={0.85}
      />

      <PiGlyphLayer
        shapes={shapes}
        z={0.035}
        depth={0.085}
        color="#D0AB55"
        roughness={0.24}
        clearcoat={0.3}
        envMapIntensity={1.65}
      />
    </group>
  );
}

function CoinEdge() {
  return (
    <group>
      {EDGE_RIDGES.map((angle) => {
        const radius = 2.015;

        return (
          <mesh
            key={angle}
            position={[
              Math.cos(angle) *
                radius,
              Math.sin(angle) *
                radius,
              0,
            ]}
            rotation={[
              0,
              0,
              angle,
            ]}
          >
            <boxGeometry
              args={[
                0.035,
                0.13,
                0.43,
              ]}
            />

            <meshPhysicalMaterial
              color="#B98A37"
              metalness={1}
              roughness={0.34}
              clearcoat={0.12}
              clearcoatRoughness={0.4}
              envMapIntensity={1.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function FaceEngraving({
  back = false,
}: {
  back?: boolean;
}) {
  const z = back
    ? -0.278
    : 0.278;

  return (
    <group
      rotation={[
        0,
        back ? Math.PI : 0,
        0,
      ]}
    >
      {FACE_MARKS.map((angle) => {
        const radius = 1.72;

        return (
          <mesh
            key={angle}
            position={[
              Math.cos(angle) *
                radius,
              Math.sin(angle) *
                radius,
              z,
            ]}
            rotation={[
              0,
              0,
              angle,
            ]}
          >
            <boxGeometry
              args={[
                0.018,
                0.095,
                0.018,
              ]}
            />

            <meshPhysicalMaterial
              color="#E3C873"
              metalness={1}
              roughness={0.25}
              clearcoat={0.18}
              clearcoatRoughness={0.32}
              envMapIntensity={1.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function CoinModel() {
  return (
    <group>
      <mesh
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            2,
            2,
            0.46,
            160,
            6,
          ]}
        />

        <meshPhysicalMaterial
          color="#A9792B"
          metalness={1}
          roughness={0.34}
          clearcoat={0.15}
          clearcoatRoughness={0.42}
          envMapIntensity={1.15}
        />
      </mesh>

      <CoinEdge />

      <mesh
        position={[0, 0, 0.242]}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            1.92,
            1.92,
            0.055,
            160,
          ]}
        />

        <meshPhysicalMaterial
          color="#D1AA50"
          metalness={1}
          roughness={0.29}
          clearcoat={0.26}
          clearcoatRoughness={0.32}
          envMapIntensity={1.45}
        />
      </mesh>

      <mesh
        position={[0, 0, -0.242]}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            1.92,
            1.92,
            0.055,
            160,
          ]}
        />

        <meshPhysicalMaterial
          color="#B68A36"
          metalness={1}
          roughness={0.32}
          clearcoat={0.2}
          clearcoatRoughness={0.36}
          envMapIntensity={1.25}
        />
      </mesh>

      <mesh
        position={[0, 0, 0.278]}
      >
        <torusGeometry
          args={[
            1.93,
            0.072,
            22,
            180,
          ]}
        />

        <meshPhysicalMaterial
          color="#E8CC79"
          metalness={1}
          roughness={0.21}
          clearcoat={0.34}
          clearcoatRoughness={0.25}
          envMapIntensity={1.7}
        />
      </mesh>

      <mesh
        position={[0, 0, -0.278]}
      >
        <torusGeometry
          args={[
            1.93,
            0.072,
            22,
            180,
          ]}
        />

        <meshPhysicalMaterial
          color="#C59A43"
          metalness={1}
          roughness={0.27}
          clearcoat={0.25}
          clearcoatRoughness={0.31}
          envMapIntensity={1.35}
        />
      </mesh>


      <mesh
        position={[0, 0, 0.288]}
      >
        <torusGeometry
          args={[
            1.49,
            0.026,
            14,
            150,
          ]}
        />

        <meshPhysicalMaterial
          color="#E6CF86"
          metalness={1}
          roughness={0.24}
          clearcoat={0.25}
          clearcoatRoughness={0.28}
          envMapIntensity={1.45}
        />
      </mesh>

      <mesh
        position={[0, 0, -0.288]}
      >
        <torusGeometry
          args={[
            1.49,
            0.026,
            14,
            150,
          ]}
        />

        <meshPhysicalMaterial
          color="#AA7B2D"
          metalness={1}
          roughness={0.31}
          envMapIntensity={1.15}
        />
      </mesh>

      <FaceEngraving />
      <FaceEngraving back />

      <PiEmblem />
      <PiEmblem back />
    </group>
  );
}

function CoinScene() {
  const coinRef =
    useRef<THREE.Group>(null);

  const keyLightRef =
    useRef<THREE.PointLight>(null);

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
    const coin = coinRef.current;
    const keyLight =
      keyLightRef.current;

    if (!coin || !keyLight) {
      return;
    }

    const elapsed =
      clock.getElapsedTime();

    const reducedMotion =
      reducedMotionRef.current;

    const motionMultiplier =
      reducedMotion ? 0 : 1;

    coin.rotation.y +=
      delta *
      0.12 *
      motionMultiplier;

    const pointerX =
      pointerRef.current.x *
      pointerStrengthRef.current;

    const pointerY =
      pointerRef.current.y *
      pointerStrengthRef.current;

    const targetRotationX =
      reducedMotion
        ? -0.07
        : -0.07 -
          pointerY * 0.065;

    const targetRotationZ =
      reducedMotion
        ? -0.035
        : -0.035 -
          pointerX * 0.045;

    const targetPositionX =
      reducedMotion
        ? 0
        : pointerX * 0.055;

    const targetPositionY =
      reducedMotion
        ? 0
        : -pointerY * 0.035 +
          Math.sin(
            elapsed * 0.55,
          ) *
            0.055;

    const smoothing =
      1 -
      Math.exp(-delta * 3);

    coin.rotation.x =
      THREE.MathUtils.lerp(
        coin.rotation.x,
        targetRotationX,
        smoothing,
      );

    coin.rotation.z =
      THREE.MathUtils.lerp(
        coin.rotation.z,
        targetRotationZ,
        smoothing,
      );

    coin.position.x =
      THREE.MathUtils.lerp(
        coin.position.x,
        targetPositionX,
        smoothing,
      );

    coin.position.y =
      THREE.MathUtils.lerp(
        coin.position.y,
        targetPositionY,
        smoothing,
      );

    keyLight.position.x =
      Math.sin(
        elapsed * 0.5,
      ) * 4.2;

    keyLight.position.y =
      2.5 +
      Math.cos(
        elapsed * 0.38,
      ) * 1.2;

    keyLight.position.z =
      4.8 +
      Math.cos(
        elapsed * 0.5,
      ) * 0.9;
  });

  return (
    <>
      <pointLight
        ref={keyLightRef}
        position={[3, 3, 5]}
        intensity={14}
        distance={13}
        color="#FFF1C8"
      />

      <group
        ref={coinRef}
        scale={0.88}
        rotation={[
          -0.07,
          0.3,
          -0.035,
        ]}
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
          powerPreference:
            "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping =
            THREE.ACESFilmicToneMapping;

          gl.toneMappingExposure =
            1.05;

          gl.outputColorSpace =
            THREE.SRGBColorSpace;
        }}
      >
        <ambientLight
          intensity={0.18}
        />

        <directionalLight
          position={[5, 6, 7]}
          intensity={2.6}
          color="#FFF4D6"
        />

        <directionalLight
          position={[-4, -1, 4]}
          intensity={0.8}
          color="#9ACEC8"
        />

        <Environment
          background={false}
          resolution={256}
        >
          <Lightformer
            form="rect"
            intensity={5}
            color="#FFF5D9"
            position={[0, 4, 6]}
            rotation={[
              Math.PI / 2,
              0,
              0,
            ]}
            scale={[7, 1.5, 1]}
          />

          <Lightformer
            form="rect"
            intensity={3}
            color="#D8B76A"
            position={[-4, 0, 4]}
            rotation={[
              0,
              Math.PI / 2,
              0,
            ]}
            scale={[5, 1, 1]}
          />

          <Lightformer
            form="rect"
            intensity={1.5}
            color="#79B8B3"
            position={[4, -1, 3]}
            rotation={[
              0,
              -Math.PI / 2,
              0,
            ]}
            scale={[4, 0.7, 1]}
          />

          <Lightformer
            form="rect"
            intensity={2}
            color="#FFFFFF"
            position={[0, -4, 2]}
            rotation={[
              -Math.PI / 2,
              0,
              0,
            ]}
            scale={[5, 0.5, 1]}
          />
        </Environment>

        <CoinScene />
      </Canvas>
    </div>
  );
}