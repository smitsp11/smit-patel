"use client";

import { forwardRef } from "react";
import { Job } from "@/types";

interface TimelineCardProps {
  job: Job;
  position: "left" | "right";
  className?: string;
}

/**
 * TimelineCard Component
 * 
 * Displays a job entry styled as a film exposure card with:
 * - Rounded corners
 * - Subtle grain texture overlay
 * - Vintage photography aesthetic
 */
export const TimelineCard = forwardRef<HTMLDivElement, TimelineCardProps>(
  function TimelineCard({ job, position, className = "" }, ref) {
    return (
      <div
        ref={ref}
        className={`
          timeline-card
          relative
          w-full max-w-md
          p-6 md:p-8
          bg-white/95
          rounded-lg
          shadow-lg
          border border-vintage-sepia/20
          ${position === "left" ? "mr-auto text-right" : "ml-auto text-left"}
          ${className}
        `}
      >
        {/* Film grain texture overlay */}
        <div 
          className="absolute inset-0 rounded-lg opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Date badge - styled like film frame number */}
        <div 
          className={`
            inline-block
            px-3 py-1
            mb-4
            bg-vintage-darkroom
            text-vintage-cream
            font-body text-xs tracking-wider
            rounded
          `}
        >
          {job.startDate} — {job.endDate}
        </div>

        {/* Company name */}
        <h3 className="font-display text-xl md:text-2xl text-vintage-dark-brown mb-1">
          {job.company}
        </h3>

        {/* Role */}
        <p className="font-body text-vintage-rust font-medium mb-2">
          {job.role}
        </p>

        {/* Location */}
        <p className="font-body text-sm text-vintage-dark-brown/60 mb-4">
          {job.location}
        </p>

        {/* Description */}
        <p className="font-body text-vintage-dark-brown/80 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Highlights */}
        {job.highlights && job.highlights.length > 0 && (
          <ul 
            className={`
              space-y-2
              ${position === "left" ? "text-right" : "text-left"}
            `}
          >
            {job.highlights.map((highlight, index) => (
              <li 
                key={index}
                className={`
                  font-body text-sm text-vintage-dark-brown/70
                  flex items-start gap-2
                  ${position === "left" ? "flex-row-reverse" : "flex-row"}
                `}
              >
                <span className="text-vintage-sepia mt-1">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Decorative corner accents - like photo corners */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-vintage-sepia/30 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-vintage-sepia/30 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-vintage-sepia/30 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-vintage-sepia/30 rounded-br" />
      </div>
    );
  }
);
