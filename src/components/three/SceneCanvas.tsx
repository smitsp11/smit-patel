"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { CameraModel } from "./CameraModel";
import { Lights } from "./Lights";
import { useHero } from "@/contexts/HeroContext";

/**
 * SceneCanvas Component
 * Fixed position R3F canvas for the hero section 3D scene
 */

function SceneContent() {
  const { setIsModelLoaded } = useHero();

  useEffect(() => {
    // Mark model as loaded after a brief delay to ensure rendering
    const timer = setTimeout(() => {
      setIsModelLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [setIsModelLoaded]);

  return (
    <>
      <Lights />
      <CameraModel />
    </>
  );
}

interface SceneCanvasProps {
  className?: string;
}

export function SceneCanvas({ className = "" }: SceneCanvasProps) {
  const { cameraOpacity } = useHero();

  return (
    <div
      className={`fixed inset-0 w-full h-screen ${className}`}
      style={{
        opacity: cameraOpacity,
        transition: "opacity 0.1s ease-out",
        pointerEvents: cameraOpacity > 0.1 ? "auto" : "none",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 6],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        {/* Performance optimizations */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Suspense fallback={null}>
          <SceneContent />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
