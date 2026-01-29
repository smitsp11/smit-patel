"use client";

import { forwardRef } from "react";
import { Education } from "@/types";

interface EducationCardProps {
  education: Education;
  className?: string;
}

/**
 * EducationCard Component
 * 
 * Displays education information in a distinct container
 * at the bottom of the timeline with:
 * - Degree
 * - University/Institution
 * - Year
 * - Optional GPA and highlights
 */
export const EducationCard = forwardRef<HTMLDivElement, EducationCardProps>(
  function EducationCard({ education, className = "" }, ref) {
    return (
      <div
        ref={ref}
        className={`
          education-card
          relative
          w-full max-w-2xl mx-auto
          p-8 md:p-10
          bg-gradient-to-br from-vintage-dark-brown to-vintage-darkroom
          rounded-xl
          shadow-2xl
          border border-vintage-sepia/30
          text-center
          overflow-hidden
          ${className}
        `}
      >
        {/* Film grain texture overlay */}
        <div 
          className="absolute inset-0 rounded-xl opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative film sprocket pattern on sides */}
        <div className="absolute left-0 top-0 bottom-0 w-4 opacity-20">
          <div className="h-full w-full bg-repeat-y" 
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 8px, var(--color-cream) 8px, var(--color-cream) 12px, transparent 12px, transparent 20px)`,
            }}
          />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-4 opacity-20">
          <div className="h-full w-full bg-repeat-y"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 8px, var(--color-cream) 8px, var(--color-cream) 12px, transparent 12px, transparent 20px)`,
            }}
          />
        </div>

        {/* Label */}
        <div className="inline-block px-4 py-1.5 mb-6 bg-vintage-brass/20 rounded-full border border-vintage-brass/30">
          <span className="font-handwritten text-lg text-vintage-brass">
            Education
          </span>
        </div>

        {/* Institution - Most prominent, high-contrast cream white */}
        <h3 className="font-display text-2xl md:text-3xl text-vintage-cream mb-3 tracking-wide">
          {education.institution}
        </h3>

        {/* Degree - Vintage Brass with increased font weight */}
        <p className="font-display text-xl md:text-2xl text-vintage-brass font-semibold mb-2">
          {education.degree}
        </p>

        {/* Field of study - Warm cream for visibility */}
        <p className="font-body text-lg text-vintage-warm-cream mb-4">
          {education.field}
        </p>

        {/* Years - Brighter cream for better visibility */}
        <p className="font-body text-vintage-cream/80 mb-4 tracking-wide">
          {education.startDate ? `${education.startDate} — ${education.endDate}` : education.endDate}
        </p>

        {/* GPA if available - Enhanced visibility */}
        {education.gpa && (
          <div className="inline-block px-4 py-1.5 bg-vintage-brass/15 rounded-full border border-vintage-brass/25 mb-4">
            <span className="font-body text-sm text-vintage-cream font-medium">
              GPA: {education.gpa}
            </span>
          </div>
        )}

        {/* Highlights/Awards - Brighter for better readability */}
        {education.highlights && education.highlights.length > 0 && (
          <div className="mt-6 pt-6 border-t border-vintage-brass/20">
            <ul className="space-y-2">
              {education.highlights.map((highlight, index) => (
                <li 
                  key={index}
                  className="font-body text-sm text-vintage-warm-cream leading-relaxed"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Decorative corners */}
        <div className="absolute top-3 left-6 w-4 h-4 border-t-2 border-l-2 border-vintage-sepia/40 rounded-tl" />
        <div className="absolute top-3 right-6 w-4 h-4 border-t-2 border-r-2 border-vintage-sepia/40 rounded-tr" />
        <div className="absolute bottom-3 left-6 w-4 h-4 border-b-2 border-l-2 border-vintage-sepia/40 rounded-bl" />
        <div className="absolute bottom-3 right-6 w-4 h-4 border-b-2 border-r-2 border-vintage-sepia/40 rounded-br" />
      </div>
    );
  }
);
