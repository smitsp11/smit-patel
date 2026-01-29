"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, PresentationControls } from "@react-three/drei";
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
 * Supports mouse drag interaction before scrolling via PresentationControls
 */
export function CameraModel() {
  const scrollGroupRef = useRef<Group>(null);
  const floatGroupRef = useRef<Group>(null);
  const { scrollProgress, cameraOpacity, setIsModelLoaded } = useHero();

  // Load the GLB model
  const { scene } = useGLTF("/models/camera-ready.glb") as GLTFResult;

  // Mark model as loaded once the scene is available
  useEffect(() => {
    if (scene) {
      setIsModelLoaded(true);
    }
  }, [scene, setIsModelLoaded]);

  // Animation loop for floating movement and scroll-based rotation
  useFrame((state) => {
    if (!scrollGroupRef.current || !floatGroupRef.current) return;

    const time = state.clock.elapsedTime;

    // Subtle floating animation on the float group
    floatGroupRef.current.position.y = Math.sin(time * 0.5) * 0.05;

    // Scroll-based rotation (0% to 50% scroll) on the scroll group
    const rotationProgress = Math.min(scrollProgress * 2, 1);
    scrollGroupRef.current.rotation.y = -0.3 + rotationProgress * 0.6;
    scrollGroupRef.current.rotation.x = 0.1 - rotationProgress * 0.2;

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

  // Check if user interaction should be enabled
  const isInteractionEnabled = scrollProgress < 0.1;

  return (
    <group ref={floatGroupRef} position={[0, -0.5, 0]}>
      {/* PresentationControls: User drag interaction (outer layer) */}
      <PresentationControls
        enabled={isInteractionEnabled}
        global={true}
        cursor={isInteractionEnabled}
        snap={true}
        speed={1.5}
        zoom={1}
        rotation={[0, 0, 0]}
        polar={[-0.4, 0.4]}
        azimuth={[-0.8, 0.8]}
        config={{ mass: 1, tension: 170, friction: 26 }}
      >
        {/* Scroll-controlled rotation group (inner layer) */}
        <group ref={scrollGroupRef} rotation={[0.1, -0.3, 0]}>
          <primitive 
            object={scene} 
            scale={0.8}
            position={[0, 0, 0]}
          />
        </group>
      </PresentationControls>
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload("/models/camera-ready.glb");
