"use client";

import { useEffect, useState } from "react";
import { useHero } from "@/contexts/HeroContext";

/**
 * LoadingScreen Component
 * Displays a vintage-themed loading indicator while 3D assets load
 */
export function LoadingScreen() {
  const { isModelLoaded } = useHero();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isModelLoaded) {
      // Start fade out animation
      setIsFading(true);

      // Remove from DOM after fade completes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isModelLoaded]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-vintage-cream transition-opacity duration-700 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center">
        {/* Aperture Loading Animation */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full animate-spin"
            style={{ animationDuration: "3s" }}
          >
            {/* Aperture Blades */}
            {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
              <path
                key={index}
                d="M50 15 L65 35 L50 50 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-vintage-rust"
                transform={`rotate(${rotation} 50 50)`}
                style={{
                  animation: `pulse 1.5s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
            {/* Center Circle */}
            <circle
              cx="50"
              cy="50"
              r="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-vintage-dark-brown"
            />
          </svg>
        </div>

        {/* Loading Text */}
        <p className="font-display text-xl text-vintage-dark-brown animate-pulse">
          Loading...
        </p>
        <p className="font-body text-sm text-vintage-sepia mt-2">
          Preparing your vintage experience
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
