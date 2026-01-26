"use client";

import { forwardRef } from "react";
import Image from "next/image";

interface PolaroidProps {
  src: string;
  alt: string;
  caption?: string;
  rotation?: number;
  className?: string;
}

/**
 * Polaroid Component
 * 
 * A polaroid-style photo frame with:
 * - White container mimicking classic polaroid photos
 * - Image display area
 * - Handwritten-style caption using Caveat font
 * - Subtle shadow for depth
 * 
 * Animation is handled by parent via refs and GSAP
 */
export const Polaroid = forwardRef<HTMLDivElement, PolaroidProps>(
  function Polaroid({ src, alt, caption, rotation = 0, className = "" }, ref) {
    return (
      <div
        ref={ref}
        className={`
          polaroid
          inline-block
          bg-white
          p-3 pb-12
          shadow-[0_4px_15px_rgba(0,0,0,0.1),0_10px_40px_rgba(0,0,0,0.08)]
          will-change-transform
          gpu-accelerated
          ${className}
        `}
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Photo container */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 overflow-hidden bg-vintage-cream/50">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 192px, 224px"
          />
          
          {/* Slight sepia overlay for vintage effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-[#d4a574]/10 to-transparent mix-blend-multiply"
          />
        </div>

        {/* Caption area */}
        {caption && (
          <p 
            className="
              absolute bottom-3 left-0 right-0
              text-center
              font-handwritten
              text-lg md:text-xl
              text-vintage-dark-brown/80
              px-2
            "
          >
            {caption}
          </p>
        )}

        {/* Tape effect on top corners (optional decorative element) */}
        <div 
          className="
            absolute -top-2 left-1/2 -translate-x-1/2
            w-12 h-4
            bg-gradient-to-b from-[#e8d5a3]/60 to-[#c9a55c]/40
            rounded-sm
            opacity-70
            rotate-[-2deg]
          "
          style={{
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    );
  }
);
