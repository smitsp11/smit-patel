"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TimelineCard } from "@/components/ui/TimelineCard";
import { EducationCard } from "@/components/ui/EducationCard";
import { ApertureIcon } from "@/components/ui/ApertureIcon";
import { Job, Education } from "@/types";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Sample job data
const jobs: Job[] = [
  {
    id: "1",
    company: "Stealth",
    role: "Software Engineer Intern",
    location: "Ottawa, ON",
    startDate: "2026",
    endDate: "Present",
    description:
    "Fintech consulting firm to help examining investment opporunities and facilitating financing.",
  },
  
  {
    id: "2",
    company: "UofT Formula Racing Team",
    role: "Software Developer",
    location: "Toronto, ON",
    startDate: "2025",
    endDate: "2026",
    description:
      "Built the 'brain' that allows a formula race car to see the track and drive itself.",
  },

  {
    id: "3",
    company: "TailorMate Startup",
    role: "Founder",
    location: "Toronto, ON",
    startDate: "2025",
    endDate: "2026",
    description:
      "Engineered the AI infrastructure and recommendation algorithms behind a personalized fashion marketplace for over 1,000 products.",
  },
  
  {
    id: "4",
    company: "Stupid Ideas Hackathon",
    role: "Co-Founder",
    location: "Toronto, ON",
    startDate: "2015",
    endDate: "Present",
    description:
      "Building a global community of builders by removing the pressure of competition and reintroducing passion in creation.",
  },
];

// Education data
const education: Education = {
  id: "1",
  institution: "University of Toronto",
  degree: "Computer Engineering",
  field: "",
  startDate: "2025",
  endDate: "2029",
  gpa: "",
  highlights: [
    "Faculty of Applied Science & Engineering Award ($10,000)",
    "",
    "",
  ],
};

/**
 * ExperienceSection Component
 *
 * Phase 5 implementation featuring:
 * - Vertical timeline with central line that grows on scroll
 * - Alternating left/right job entries
 * - Aperture icon markers on the center line
 * - Film exposure styled content cards
 * - Education block at the bottom
 */
export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markerRefs = useRef<(SVGSVGElement | null)[]>([]);
  const educationRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !timelineLineRef.current) return;

      // Header fade-in animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              end: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Timeline line grows from 0% to 100% height as user scrolls
      gsap.fromTo(
        timelineLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 0.5,
          },
        }
      );

      // Animate each timeline card
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const isLeft = index % 2 === 0;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isLeft ? -60 : 60,
            y: 30,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Animate aperture markers
      markerRefs.current.forEach((marker, index) => {
        if (!marker) return;

        gsap.fromTo(
          marker,
          {
            scale: 0,
            rotation: -180,
            opacity: 0,
          },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: cardRefs.current[index] || marker,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Education card animation
      if (educationRef.current) {
        gsap.fromTo(
          educationRef.current,
          {
            opacity: 0,
            y: 60,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: educationRef.current,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-20 md:py-32 bg-vintage-cream overflow-hidden"
    >
      {/* Section Header */}
      <div ref={headerRef} className="section-container text-center mb-16 md:mb-24">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-vintage-dark-brown mb-4">
          Experience
        </h2>

      </div>

      {/* Timeline Container */}
      <div ref={timelineRef} className="relative section-container">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block">
          {/* Background line (faded) */}
          <div className="absolute inset-0 bg-vintage-sepia/20" />
          {/* Animated growing line */}
          <div
            ref={timelineLineRef}
            className="absolute inset-0 bg-gradient-to-b from-vintage-sepia via-vintage-rust to-vintage-dark-brown origin-top"
          />
        </div>

        {/* Mobile Timeline Line (left-aligned) */}
        <div className="absolute left-8 top-0 bottom-0 w-px md:hidden">
          <div className="absolute inset-0 bg-vintage-sepia/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-vintage-sepia via-vintage-rust to-vintage-dark-brown origin-top timeline-line-mobile" />
        </div>

        {/* Timeline Entries */}
        <div className="relative space-y-16 md:space-y-24">
          {jobs.map((job, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={job.id}
                className={`
                  relative
                  flex flex-col md:flex-row items-start
                  ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}
                  gap-8 md:gap-16
                `}
              >
                {/* Card side - takes up half on desktop */}
                <div className={`
                  w-full md:w-1/2
                  ${isLeft ? "md:pr-8" : "md:pl-8"}
                  pl-16 md:pl-0
                `}>
                  <TimelineCard
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    job={job}
                    position={isLeft ? "left" : "right"}
                  />
                </div>

                {/* Center marker - desktop only */}
                <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 z-10">
                  <div className="relative">
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-vintage-sepia/20 rounded-full blur-md scale-150" />
                    {/* Icon container */}
                    <div className="relative bg-vintage-cream p-2 rounded-full border-2 border-vintage-sepia shadow-lg">
                      <ApertureIcon
                        ref={(el) => {
                          markerRefs.current[index] = el;
                        }}
                        size={28}
                        className="text-vintage-rust"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile marker - left aligned */}
                <div className="md:hidden absolute left-4 top-6 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-vintage-sepia/20 rounded-full blur-sm scale-150" />
                    <div className="relative bg-vintage-cream p-1.5 rounded-full border-2 border-vintage-sepia shadow-md">
                      <ApertureIcon
                        ref={(el) => {
                          if (!markerRefs.current[index]) {
                            markerRefs.current[index] = el;
                          }
                        }}
                        size={20}
                        className="text-vintage-rust"
                      />
                    </div>
                  </div>
                </div>

                {/* Empty space for other side - desktop only */}
                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </div>

        {/* Timeline End Cap */}
        <div className="hidden md:flex justify-center mt-16">
          <div className="w-4 h-4 bg-vintage-dark-brown rounded-full shadow-lg" />
        </div>
      </div>

      {/* Education Section */}
      <div className="section-container mt-20 md:mt-32">
        <EducationCard ref={educationRef} education={education} />
        
        {/* Resume Link Box */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://drive.google.com/file/d/1tYTzsVRaghabD1o-9qSqyDoylij1ZIIY/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="
              relative
              inline-block
              px-6 py-3
              bg-white/95
              rounded-lg
              shadow-lg
              border border-vintage-sepia/20
              hover:shadow-xl
              hover:border-vintage-sepia/40
              transition-all duration-300
              group
            "
          >
            {/* Film grain texture overlay */}
            <div 
              className="absolute inset-0 rounded-lg opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
            
            <div className="relative flex items-center gap-2">
              <span className="font-body text-vintage-dark-brown group-hover:text-vintage-rust transition-colors">
                View Resume
              </span>
              <svg
                className="w-4 h-4 text-vintage-sepia group-hover:text-vintage-rust transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
