"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { useHero } from "@/contexts/HeroContext";
import { GLTF } from "three-stdlib";

// Type for the GLTF result
type GLTFResult = GLTF & {
  nodes: Record<string, Mesh>;
  materials: Record<string, MeshStandardMaterial>;
};

/**
 * Vintage Camera 3D Model
 * Loads a GLB model and applies scroll-based animations
 */
export function CameraModel() {
  const groupRef = useRef<Group>(null);
  const { scrollProgress, cameraOpacity, setIsModelLoaded } = useHero();

  // Load the GLB model
  const { scene } = useGLTF("/models/camera-ready.glb") as GLTFResult;

  // Mark model as loaded once the scene is available
  useEffect(() => {
    if (scene) {
      setIsModelLoaded(true);
    }
  }, [scene, setIsModelLoaded]);

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

    // Update opacity on all meshes in the scene
    scene.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        const material = child.material as MeshStandardMaterial;
        if (material.transparent !== (cameraOpacity < 1)) {
          material.transparent = cameraOpacity < 1;
          material.needsUpdate = true;
        }
        material.opacity = cameraOpacity;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} rotation={[0.1, -0.3, 0]}>
      <primitive 
        object={scene} 
        scale={0.8}
        position={[0, 0, 0]}
      />
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload("/models/camera-ready.glb");
