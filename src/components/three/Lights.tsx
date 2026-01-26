"use client";

/**
 * Three-point lighting setup for the 3D scene
 * Emphasizes vintage metal textures on the camera model
 */
export function Lights() {
  return (
    <>
      {/* Key Light - Main light source (warm tone for vintage feel) */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={2.5}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill Light - Softer light from opposite side */}
      <directionalLight
        position={[-5, 3, 2]}
        intensity={1.5}
        color="#e6f0ff"
      />

      {/* Back/Rim Light - Creates edge definition */}
      <directionalLight
        position={[0, 5, -5]}
        intensity={1.2}
        color="#fff8f0"
      />

      {/* Front Light - Illuminate the camera face */}
      <directionalLight
        position={[0, 2, 8]}
        intensity={1.8}
        color="#fdfbf7"
      />

      {/* Ambient Light - Base illumination */}
      <ambientLight intensity={0.8} color="#fdfbf7" />

      {/* Subtle point light for metal reflections */}
      <pointLight
        position={[2, 2, 4]}
        intensity={0.8}
        color="#d4a574"
        distance={15}
        decay={2}
      />

      {/* Additional point light from below for dramatic effect */}
      <pointLight
        position={[-2, -1, 3]}
        intensity={0.5}
        color="#b87333"
        distance={12}
        decay={2}
      />
    </>
  );
}
