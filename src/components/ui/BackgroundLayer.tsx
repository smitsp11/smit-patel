"use client";

import { useEffect, useRef } from "react";

export function BackgroundLayer() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The background layer is ready for GSAP ScrollTrigger integration
    // Color transitions will be handled in Phase 6 (Gallery section)
    // For now, it maintains the base cream color
  }, []);

  return (
    <div
      ref={backgroundRef}
      id="background-layer"
      className="background-layer"
      aria-hidden="true"
    />
  );
}
