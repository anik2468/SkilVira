import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Stars,
  OrbitControls,
} from "@react-three/drei";
import { useRef } from "react";

const GOLD = "#D4AF37";

const FloatingShape = () => {
  const mesh = useRef(null);

  useFrame((state) => {
    if (!mesh.current) return;

    const elapsed =
      state.clock.elapsedTime;

    mesh.current.rotation.x =
      elapsed * 0.18;

    mesh.current.rotation.y =
      elapsed * 0.28;

    mesh.current.rotation.z =
      Math.sin(elapsed * 0.4) *
      0.08;
  });

  return (
    <group>
      {/* Main gold shape */}
      <mesh ref={mesh}>
        <icosahedronGeometry
          args={[1.55, 2]}
        />

        <meshStandardMaterial
          color={GOLD}
          metalness={0.85}
          roughness={0.18}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Inner smaller shape */}
      <mesh rotation={[0.5, 0.3, 0.2]}>
        <icosahedronGeometry
          args={[0.9, 1]}
        />

        <meshStandardMaterial
          color="#F4D77A"
          metalness={0.7}
          roughness={0.25}
          transparent
          opacity={0.28}
          wireframe
        />
      </mesh>
    </group>
  );
};

const GoldParticles = () => {
  const particles = useRef(null);

  useFrame((state) => {
    if (!particles.current) return;

    particles.current.rotation.y =
      state.clock.elapsedTime *
      0.035;

    particles.current.rotation.x =
      Math.sin(
        state.clock.elapsedTime *
          0.12
      ) * 0.05;
  });

  return (
    <points ref={particles}>
      <sphereGeometry
        args={[4, 32, 32]}
      />

      <pointsMaterial
        color={GOLD}
        size={0.018}
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
};

const Hero3D = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0, 5.5],
          fov: 42,
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference:
            "high-performance",
        }}
      >
        {/* =====================================================
            LIGHTING
        ===================================================== */}

        <ambientLight intensity={1.2} />

        <hemisphereLight
          intensity={0.7}
          color="#ffffff"
          groundColor="#D4AF37"
        />

        <pointLight
          position={[4, 4, 5]}
          intensity={2.3}
          color="#F4D77A"
        />

        <pointLight
          position={[-4, -2, 3]}
          intensity={1.3}
          color="#ffffff"
        />

        {/* =====================================================
            MAIN FLOATING OBJECT
        ===================================================== */}

        <Float
          speed={1.5}
          rotationIntensity={0.7}
          floatIntensity={1.3}
        >
          <FloatingShape />
        </Float>

        {/* =====================================================
            PARTICLE FIELD
        ===================================================== */}

        <GoldParticles />

        <Stars
          radius={45}
          depth={28}
          count={650}
          factor={1.2}
          saturation={0}
          fade
          speed={0.25}
        />

        {/* =====================================================
            VERY SUBTLE CAMERA MOVEMENT
        ===================================================== */}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* =====================================================
          CSS GLOW OVERLAY
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_48%,rgba(212,175,55,0.10),transparent_24%),radial-gradient(circle_at_80%_30%,rgba(212,175,55,0.06),transparent_22%)]" />

      {/* Keep text readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent lg:via-white/35" />
    </div>
  );
};

export default Hero3D;