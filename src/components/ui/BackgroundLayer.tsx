"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * BackgroundLayer Component
 *
 * A fixed background layer at z-index: -1 that handles smooth
 * color transitions between sections using GSAP ScrollTrigger.
 *
 * Phase 6 Enhancement:
 * - Transitions from cream (#fdfbf7) to darkroom (#1a1a1a) when
 *   entering the gallery section
 * - Uses power1.inOut easing for smooth transitions
 */
export function BackgroundLayer() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!backgroundRef.current) return;

    // Set initial background color
    gsap.set(backgroundRef.current, {
      backgroundColor: "#fdfbf7",
    });

    // The main scroll-triggered transitions are handled by the GallerySection
    // This component provides the base layer and could handle additional
    // global transitions if needed

    // Create a refresh handler to ensure ScrollTrigger positions are correct
    // after all content loads
    ScrollTrigger.refresh();
  });

  return (
    <div
      ref={backgroundRef}
      id="background-layer"
      className="background-layer"
      aria-hidden="true"
    />
  );
}
