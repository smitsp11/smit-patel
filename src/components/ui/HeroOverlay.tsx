"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useHero } from "@/contexts/HeroContext";

/**
 * HeroOverlay Component
 * Absolute-positioned text overlay for the hero section
 * Displays name and role with animated entrance
 */
export function HeroOverlay() {
  const { isModelLoaded, cameraOpacity } = useHero();
  const overlayRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModelLoaded || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      // Animate text entrance after model loads
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        nameRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          roleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        );
    }, overlayRef);

    return () => ctx.revert();
  }, [isModelLoaded]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex flex-col items-center justify-end pb-24 z-10 pointer-events-none"
      style={{
        opacity: cameraOpacity,
        transition: "opacity 0.1s ease-out",
      }}
    >
      {/* Name and Title Container */}
      <div className="text-center mb-8">
        <h1
          ref={nameRef}
          className="font-display text-5xl md:text-7xl lg:text-8xl text-vintage-dark-brown mb-3 opacity-0"
          style={{
            textShadow: "2px 2px 4px rgba(253, 251, 247, 0.8)",
          }}
        >
          Smit Patel
        </h1>
        <p
          ref={roleRef}
          className="font-body text-lg md:text-xl lg:text-2xl text-vintage-sepia opacity-0"
        >
          Software Engineer & Photographer
        </p>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="flex flex-col items-center opacity-0"
      >
        <span className="font-handwritten text-sm text-vintage-rust mb-2">
          Scroll to explore
        </span>
        <div className="w-6 h-10 border-2 border-vintage-rust rounded-full flex justify-center p-1">
          <div className="w-1.5 h-3 bg-vintage-rust rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
