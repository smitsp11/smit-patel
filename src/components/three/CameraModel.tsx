"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group, MeshStandardMaterial, Color } from "three";
import { useHero } from "@/contexts/HeroContext";

/**
 * Vintage Camera 3D Model
 * A procedurally generated camera model with vintage aesthetics
 * Designed to look like a classic Canon film camera
 */
export function CameraModel() {
  const groupRef = useRef<Group>(null);
  const { scrollProgress, cameraOpacity } = useHero();

  // Memoized materials for vintage metal look
  const materials = useMemo(
    () => ({
      body: new MeshStandardMaterial({
        color: new Color("#2d2d2d"),
        metalness: 0.4,
        roughness: 0.6,
      }),
      chrome: new MeshStandardMaterial({
        color: new Color("#d4d4d4"),
        metalness: 0.95,
        roughness: 0.15,
      }),
      lens: new MeshStandardMaterial({
        color: new Color("#1a1a1a"),
        metalness: 0.2,
        roughness: 0.4,
      }),
      lensGlass: new MeshStandardMaterial({
        color: new Color("#2a3a50"),
        metalness: 0.95,
        roughness: 0.05,
        transparent: true,
        opacity: 0.9,
      }),
      grip: new MeshStandardMaterial({
        color: new Color("#3a3a3a"),
        metalness: 0.15,
        roughness: 0.85,
      }),
      accent: new MeshStandardMaterial({
        color: new Color("#c9873a"), // Rust/copper accent
        metalness: 0.75,
        roughness: 0.25,
      }),
    }),
    []
  );

  // Animation loop for subtle idle movement and scroll-based rotation
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Subtle floating animation
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.05;

    // Scroll-based rotation (0% to 50% scroll)
    const rotationProgress = Math.min(scrollProgress * 2, 1);
    groupRef.current.rotation.y = -0.3 + rotationProgress * 0.6;
    groupRef.current.rotation.x = 0.1 - rotationProgress * 0.2;

    // Update opacity on all materials
    Object.values(materials).forEach((mat) => {
      if (mat.transparent !== (cameraOpacity < 1)) {
        mat.transparent = cameraOpacity < 1;
        mat.needsUpdate = true;
      }
      mat.opacity = cameraOpacity;
    });
  });

  return (
    <group ref={groupRef} scale={1.5} position={[0, 0, 0]} rotation={[0.1, -0.3, 0]}>
      {/* Main Camera Body */}
      <mesh position={[0, 0, 0]} material={materials.body} castShadow>
        <boxGeometry args={[2.4, 1.4, 1.2]} />
      </mesh>

      {/* Top Plate (Chrome) */}
      <mesh position={[0, 0.75, 0]} material={materials.chrome} castShadow>
        <boxGeometry args={[2.4, 0.1, 1.2]} />
      </mesh>

      {/* Pentaprism Housing */}
      <mesh position={[0, 1.0, 0]} material={materials.body} castShadow>
        <boxGeometry args={[1.0, 0.5, 0.8]} />
      </mesh>

      {/* Viewfinder */}
      <mesh position={[0, 1.0, -0.45]} material={materials.chrome}>
        <boxGeometry args={[0.4, 0.3, 0.15]} />
      </mesh>

      {/* Lens Mount Ring */}
      <mesh
        position={[0, 0, 0.65]}
        rotation={[Math.PI / 2, 0, 0]}
        material={materials.chrome}
        castShadow
      >
        <cylinderGeometry args={[0.65, 0.65, 0.1, 32]} />
      </mesh>

      {/* Main Lens Barrel */}
      <mesh
        position={[0, 0, 1.3]}
        rotation={[Math.PI / 2, 0, 0]}
        material={materials.lens}
        castShadow
      >
        <cylinderGeometry args={[0.55, 0.6, 1.2, 32]} />
      </mesh>

      {/* Lens Focus Ring */}
      <mesh
        position={[0, 0, 1.0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={materials.grip}
      >
        <cylinderGeometry args={[0.62, 0.62, 0.3, 32]} />
      </mesh>

      {/* Lens Front Element */}
      <mesh
        position={[0, 0, 1.95]}
        rotation={[Math.PI / 2, 0, 0]}
        material={materials.lensGlass}
      >
        <cylinderGeometry args={[0.45, 0.5, 0.1, 32]} />
      </mesh>

      {/* Lens Hood Hint */}
      <mesh
        position={[0, 0, 2.05]}
        rotation={[Math.PI / 2, 0, 0]}
        material={materials.body}
      >
        <cylinderGeometry args={[0.5, 0.45, 0.15, 32]} />
      </mesh>

      {/* Right Hand Grip */}
      <mesh position={[1.35, -0.1, 0]} material={materials.grip} castShadow>
        <boxGeometry args={[0.35, 1.2, 1.0]} />
      </mesh>

      {/* Shutter Button */}
      <mesh
        position={[1.0, 0.85, 0.3]}
        rotation={[0, 0, 0]}
        material={materials.chrome}
      >
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
      </mesh>

      {/* Mode Dial */}
      <mesh
        position={[-0.8, 0.85, 0]}
        rotation={[0, 0, 0]}
        material={materials.chrome}
      >
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
      </mesh>

      {/* Hot Shoe */}
      <mesh position={[0, 1.3, 0]} material={materials.chrome}>
        <boxGeometry args={[0.5, 0.05, 0.4]} />
      </mesh>

      {/* Brand Accent Stripe (vintage detail) */}
      <mesh position={[0, 0.5, -0.61]} material={materials.accent}>
        <boxGeometry args={[1.5, 0.08, 0.02]} />
      </mesh>

      {/* Film Advance Lever Base */}
      <mesh
        position={[1.0, 0.85, -0.2]}
        rotation={[0, 0, 0]}
        material={materials.chrome}
      >
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
      </mesh>

      {/* Film Advance Lever */}
      <mesh
        position={[1.15, 0.85, -0.35]}
        rotation={[0, 0.3, 0]}
        material={materials.chrome}
      >
        <boxGeometry args={[0.4, 0.04, 0.08]} />
      </mesh>

      {/* Rewind Knob */}
      <mesh
        position={[-1.0, 0.85, 0]}
        rotation={[0, 0, 0]}
        material={materials.chrome}
      >
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
      </mesh>

      {/* Strap Lugs */}
      <mesh position={[-1.25, 0.4, 0]} material={materials.chrome}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
      </mesh>
      <mesh position={[1.25, 0.4, -0.4]} material={materials.chrome}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
      </mesh>
    </group>
  );
}
