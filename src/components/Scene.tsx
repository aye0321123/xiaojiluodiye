"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import * as THREE from "three";
import ParticleField from "./ParticleField";

function CameraDolly({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const smoothRef = useRef(0);

  useFrame(() => {
    smoothRef.current += (progressRef.current - smoothRef.current) * 0.06;
    const p = smoothRef.current;

    const startZ = 22;
    const formedZ = 8;
    const throughZ = 2.5;

    let z: number;
    if (p < 0.6) {
      const t = p / 0.6;
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      z = startZ + (formedZ - startZ) * eased;
    } else if (p < 0.85) {
      z = formedZ;
    } else {
      const t = (p - 0.85) / 0.15;
      z = formedZ + (throughZ - formedZ) * t;
    }

    camera.position.z = z;

    const orbitAmt = Math.max(0, Math.min(1, (p - 0.6) / 0.25));
    const angle = orbitAmt * 0.35;
    camera.position.x = Math.sin(angle) * 1.5 * orbitAmt;
    camera.lookAt(0, 0, 0);

    const targetFov = p < 0.6 ? 65 - p * 8 : p < 0.85 ? 57 : 57 + (p - 0.85) * 60;
    if ("fov" in camera) {
      const persp = camera as THREE.PerspectiveCamera;
      persp.fov = targetFov;
      persp.updateProjectionMatrix();
    }
  });

  return null;
}

function Effects() {
  const [PostProcessing, setPostProcessing] = useState<{
    EffectComposer: React.ComponentType<{ children: React.ReactNode }>;
    Bloom: React.ComponentType<Record<string, unknown>>;
    Vignette: React.ComponentType<Record<string, unknown>>;
    Noise: React.ComponentType<Record<string, unknown>>;
  } | null>(null);

  useEffect(() => {
    import("@react-three/postprocessing").then((mod) => {
      setPostProcessing({
        EffectComposer: mod.EffectComposer as unknown as React.ComponentType<{ children: React.ReactNode }>,
        Bloom: mod.Bloom as unknown as React.ComponentType<Record<string, unknown>>,
        Vignette: mod.Vignette as unknown as React.ComponentType<Record<string, unknown>>,
        Noise: mod.Noise as unknown as React.ComponentType<Record<string, unknown>>,
      });
    });
  }, []);

  if (!PostProcessing) return null;

  return (
    <PostProcessing.EffectComposer>
      <PostProcessing.Bloom
        intensity={1.6}
        luminanceThreshold={0.12}
        luminanceSmoothing={0.9}
        mipmapBlur={true}
      />
      <PostProcessing.Vignette eskil={false} offset={0.15} darkness={0.85} />
      <PostProcessing.Noise opacity={0.04} />
    </PostProcessing.EffectComposer>
  );
}

export default function Scene() {
  const [mounted, setMounted] = useState(false);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const heroEl = document.getElementById("hero");
      const heroHeight = heroEl?.offsetHeight ?? window.innerHeight * 3;
      const progress = Math.max(0, Math.min(1, window.scrollY / heroHeight));
      scrollProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 22], fov: 65 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 8, 40]} />
        <ambientLight intensity={0.5} />
        <CameraDolly progressRef={scrollProgressRef} />
        <Suspense fallback={null}>
          <ParticleField scrollProgress={scrollProgressRef} />
        </Suspense>
        <Effects />
      </Canvas>
    </div>
  );
}
