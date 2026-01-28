"use client";

import { useEffect, useRef, useState } from "react";
import { useHero } from "@/contexts/HeroContext";

/**
 * LensCursor Component
 * 
 * A custom cursor styled as a camera lens that:
 * - Follows the mouse with smooth lerp interpolation
 * - Has a vintage gold/silver border
 * - Uses backdrop-filter to simulate glass lens effect
 * - Only visible when hero section is scrolled past (isHeroVisible === false)
 */
export function LensCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const { isHeroVisible } = useHero();
  
  // Mouse position state
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Lerp factor for smooth following (lower = smoother, higher = snappier)
  const lerpFactor = 0.15;

  useEffect(() => {
    // Only run on client and desktop devices
    if (typeof window === "undefined") return;
    
    // Check if device has fine pointer (mouse)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    let animationFrameId: number;

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    // Handle mouse enter/leave window
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Handle hover states on interactive elements
    const handleElementMouseEnter = () => setIsHovering(true);
    const handleElementMouseLeave = () => setIsHovering(false);

    // Animation loop for smooth cursor movement
    const animate = () => {
      // Apply lerp interpolation
      cursorPosition.current.x += 
        (mousePosition.current.x - cursorPosition.current.x) * lerpFactor;
      cursorPosition.current.y += 
        (mousePosition.current.y - cursorPosition.current.y) * lerpFactor;

      // Update cursor position
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPosition.current.x}px, ${cursorPosition.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementMouseEnter);
      el.addEventListener("mouseleave", handleElementMouseLeave);
    });

    // Start animation loop
    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementMouseEnter);
        el.removeEventListener("mouseleave", handleElementMouseLeave);
      });
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  // Hide cursor when hero is visible
  const shouldShow = !isHeroVisible && isVisible;

  return (
    <>
      {/* Outer cursor ring - the lens frame */}
      <div
        ref={cursorRef}
        className={`
          fixed top-0 left-0 pointer-events-none z-[9998]
          transition-opacity duration-300 ease-out
          ${shouldShow ? "opacity-100" : "opacity-0"}
        `}
        style={{
          willChange: "transform",
        }}
      >
        {/* Main lens body */}
        <div
          ref={cursorInnerRef}
          className={`
            relative -translate-x-1/2 -translate-y-1/2
            transition-transform duration-200 ease-out
            ${isHovering ? "scale-150" : "scale-100"}
          `}
        >
          {/* Outer lens ring - vintage gold/silver gradient */}
          <div
            className="
              w-12 h-12 rounded-full
              bg-gradient-to-br from-[#c9a55c] via-[#e8d5a3] to-[#8b7355]
              p-[2px]
              shadow-[0_0_15px_rgba(201,165,92,0.25)]
            "
          >
            {/* Inner lens glass - optimized for text legibility */}
            <div
              className="
                w-full h-full rounded-full
                safari-backdrop-fallback
              "
              style={{
                /* Minimal backdrop effect to preserve text contrast */
                backdropFilter: "saturate(1.1)",
                WebkitBackdropFilter: "saturate(1.1)",
                /* Very subtle tint that doesn't wash out text */
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 60%)",
              }}
            >
              {/* Lens reflection highlight - reduced opacity */}
              <div
                className="
                  absolute top-1 left-1 w-2.5 h-2.5 rounded-full
                  bg-gradient-to-br from-white/25 to-transparent
                "
              />
              
              {/* Center dot - more subtle */}
              <div
                className="
                  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-1 h-1 rounded-full
                  bg-gradient-to-br from-[#c9a55c] to-[#8b7355]
                  opacity-40
                "
              />
            </div>
          </div>

          {/* Decorative lens ring details - slightly more visible for definition */}
          <div
            className="
              absolute inset-0 rounded-full
              border border-[#c9a55c]/30
              scale-[1.12]
            "
          />
        </div>
      </div>

      {/* Hide default cursor when lens cursor is active */}
      <style jsx global>{`
        ${shouldShow ? `
          * {
            cursor: none !important;
          }
        ` : ""}
      `}</style>
    </>
  );
}
