"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useHero } from "@/contexts/HeroContext";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * HeroSection Component
 * 
 * The main hero section featuring:
 * - 3D camera model (SceneCanvas)
 * - Name/role overlay (HeroOverlay)
 * - Loading screen (LoadingScreen)
 * - Scroll-triggered animations for camera fade-out
 * 
 * Animation Timeline:
 * - Scroll 0%: Camera at full opacity
 * - Scroll 10-50%: Camera fades out with slight rotation
 * - Scroll 50%: isHeroVisible becomes false (enables custom cursor in Phase 3)
 */
export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { setIsHeroVisible, setCameraOpacity, setScrollProgress } = useHero();

  useGSAP(
    () => {
      if (!heroRef.current) return;

      // Create ScrollTrigger for hero section
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);

          // Calculate camera opacity (fade out between 10% and 50% scroll)
          let opacity = 1;
          if (progress > 0.1) {
            opacity = Math.max(0, 1 - (progress - 0.1) / 0.4);
          }
          setCameraOpacity(opacity);

          // Update hero visibility state at 50% scroll
          setIsHeroVisible(progress < 0.5);
        },
        onLeave: () => {
          setIsHeroVisible(false);
          setCameraOpacity(0);
        },
        onEnterBack: () => {
          setIsHeroVisible(true);
        },
      });

      // Cleanup on unmount
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: heroRef }
  );

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen />

      {/* 3D Scene Canvas (fixed position) */}
      <SceneCanvas />

      {/* Hero Overlay (fixed position) */}
      <HeroOverlay />

      {/* Hero Section Container (for scroll measurement) */}
      <section
        ref={heroRef}
        id="hero"
        className="relative h-[150vh] w-full"
        aria-label="Hero section with 3D camera"
      >
        {/* This section is intentionally empty - it exists for scroll height */}
        {/* The actual content (3D scene + overlay) is fixed positioned */}
      </section>
    </>
  );
}
