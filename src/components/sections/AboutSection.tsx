"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Polaroid } from "@/components/ui/Polaroid";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Polaroid data for the about section
const polaroids = [
  {
    id: 1,
    src: "/images/weekend.png",
    alt: "Coding setup",
    caption: ".",
    rotation: -8,
  },
  {
    id: 2,
    src: "/images/creativity.jpg",
    alt: "Mountain landscape",
    caption: ".",
    rotation: 5,
  },
  {
    id: 3,
    src: "/images/images.jpeg",
    alt: "Coffee and keyboard",
    caption: ".",
    rotation: -3,
  },
];

/**
 * AboutSection Component
 * 
 * Phase 3 implementation featuring:
 * - Two-column grid layout (bio left, polaroids right)
 * - Bio text with fade-in animation
 * - Polaroids with staggered fly-in animation via ScrollTrigger
 */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const polaroidRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Bio text animation - fade in from left
      if (bioRef.current) {
        gsap.fromTo(
          bioRef.current,
          {
            opacity: 0,
            x: -60,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bioRef.current,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Polaroids staggered animation - fly in from right
      const validPolaroids = polaroidRefs.current.filter(Boolean);
      if (validPolaroids.length > 0) {
        validPolaroids.forEach((polaroid, index) => {
          if (!polaroid) return;
          
          // Random initial rotation between -15 and 15 degrees
          const initialRotation = (Math.random() - 0.5) * 30;
          const finalRotation = polaroids[index]?.rotation || 0;

          gsap.fromTo(
            polaroid,
            {
              opacity: 0,
              x: 100,
              rotation: initialRotation,
              scale: 0.8,
            },
            {
              opacity: 1,
              x: 0,
              rotation: finalRotation,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 60%",
                end: "top 30%",
                toggleActions: "play none none reverse",
              },
              delay: index * 0.15, // Stagger effect
            }
          );
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-full py-20 md:py-32 bg-vintage-cream"
    >
      <div className="section-container">
        {/* Section Header */}
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-vintage-dark-brown mb-16 text-center">
          About Me
        </h2>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Bio */}
          <div ref={bioRef} className="space-y-6">
            <h3 className="font-display text-2xl md:text-3xl text-vintage-rust">
              Hello, I&apos;m Smit.
            </h3>
            
            {/* Primary body text - Deep Iron Gall for solid visual anchor */}
            <div className="space-y-4 font-body text-lg text-vintage-iron-gall leading-relaxed">
              <p className="text-vintage-rust font-medium">
                Software Engineer. Photographer. Builder.
              </p>
              
              <p>
                <span className="font-semibold text-vintage-iron-gall">The Craft:</span> Writing code that turns ideas into products.
              </p>
              
              <p>
                <span className="font-semibold text-vintage-iron-gall">The Aesthetic:</span> Inspired by photography, late-night drives, and storytelling.
              </p>

              <p>
                <span className="font-semibold text-vintage-iron-gall">The Fuel:</span> Weight lifting, Drake albums, and adrenaline from Formula 1.
              </p>

              <p>
                <span className="font-semibold text-vintage-iron-gall">The Community:</span> Love hosting events for connections and amazing vibes.
              </p>
            </div>

            {/* Skills/Interests tags */}
            <div className="pt-4">
              {/* Secondary label - Muted Umber for clear visibility */}
              <p className="font-handwritten text-xl text-vintage-muted-umber mb-3">
                Things I love working with:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Python",
                  "Node.js",
                  "LLMs",
                  "FastAPI",
                  "PostgreSQL",
                  "AWS",
                  "Canon Camera",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="
                      px-3 py-1.5
                      bg-vintage-muted-umber/10
                      border border-vintage-muted-umber/40
                      rounded-full
                      font-body text-sm font-medium
                      text-vintage-iron-gall
                      transition-colors duration-200
                      hover:bg-vintage-muted-umber/15
                      hover:border-vintage-muted-umber/50
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Polaroids */}
          <div className="relative flex justify-center items-center min-h-[400px] lg:min-h-[500px]">
            {/* Polaroid stack with overlapping layout */}
            <div className="relative w-full max-w-md">
              {polaroids.map((polaroid, index) => (
                <div
                  key={polaroid.id}
                  className={`
                    ${index === 0 ? "relative" : "absolute"}
                    ${index === 1 ? "top-8 -right-4 md:top-12 md:-right-8" : ""}
                    ${index === 2 ? "top-32 left-8 md:top-40 md:left-12" : ""}
                  `}
                  style={{ zIndex: polaroids.length - index }}
                >
                  <Polaroid
                    ref={(el) => {
                      polaroidRefs.current[index] = el;
                    }}
                    src={polaroid.src}
                    alt={polaroid.alt}
                    caption={polaroid.caption}
                    rotation={polaroid.rotation}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
