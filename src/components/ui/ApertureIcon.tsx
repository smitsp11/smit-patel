"use client";

import { forwardRef } from "react";

interface ApertureIconProps {
  size?: number;
  className?: string;
}

/**
 * ApertureIcon Component
 * 
 * Custom SVG aperture/camera diaphragm icon used as timeline markers.
 * Styled to match the vintage photography theme.
 */
export const ApertureIcon = forwardRef<SVGSVGElement, ApertureIconProps>(
  function ApertureIcon({ size = 24, className = "" }, ref) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Outer circle */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Aperture blades - creating the classic camera aperture pattern */}
        <path
          d="M12 2C12 2 14.5 6 14.5 12C14.5 18 12 22 12 22"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M12 2C12 2 9.5 6 9.5 12C9.5 18 12 22 12 22"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M2 12C2 12 6 9.5 12 9.5C18 9.5 22 12 22 12"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M2 12C2 12 6 14.5 12 14.5C18 14.5 22 12 22 12"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        
        {/* Diagonal blades */}
        <path
          d="M4.93 4.93C4.93 4.93 7.5 8 12 12C16.5 16 19.07 19.07 19.07 19.07"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M19.07 4.93C19.07 4.93 16.5 8 12 12C7.5 16 4.93 19.07 4.93 19.07"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        
        {/* Center dot */}
        <circle
          cx="12"
          cy="12"
          r="2.5"
          fill="currentColor"
          opacity="0.9"
        />
        
        {/* Inner ring */}
        <circle
          cx="12"
          cy="12"
          r="5"
          stroke="currentColor"
          strokeWidth="0.75"
          fill="none"
          opacity="0.5"
        />
      </svg>
    );
  }
);
