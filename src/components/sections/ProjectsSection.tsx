"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FilmFrame } from "@/components/ui/FilmFrame";
import { Project } from "@/types";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Sample project data
const projects: Project[] = [
  {
    id: "1",
    title: "BehavAced",
    description:
      "An AI-powered behavioral interview that helps improve your communication during interviews.",
    techStack: ["Python", "Supabase", "AI", "Next.js"],
    imageUrl: "/images/behavaced.png",
    githubUrl: "https://github.com/smitsp11/BehavAced",
    featured: true,
    year: 2025,
  },
  {
    id: "2",
    title: "Sonna",
    description:
      "Inspired by Suit's Donna: A voice AI assistant with conversation, memory, and reminder scheduling.",
    techStack: ["Python", "FastAPI", "PostgreSQL", "Celery"],
    imageUrl: "/images/sonna.png",
    githubUrl: "https://github.com/smitsp11/sonna",
    featured: true,
    year: 2025,
  },
  {
    id: "3",
    title: "Viva",
    description:
      "A classroom-aligned platform, voice-first learning assistant that helps students think out loud and learn asyc",
    techStack: ["TypeScript", "FastAPI", "MongoDB", "Auth"],
    imageUrl: "/images/viva.png",
    githubUrl: "https://github.com/VictorWong123/nexHacks2026",
    featured: true,
    year: 2026,
  },
  {
    id: "4",
    title: "readMax",
    description:
      "    A web app that lets you paste text and then flashes one word at a time, at a chosen WPM to increase reading speed.",
    techStack: ["HTML", "RSVP", "JavaScript", "ORP"],
    imageUrl: "/images/readmax.png",
    githubUrl: "https://github.com/smitsp11/readMax",
    featured: true,
    year: 2026,
  },
  {
    id: "5",
    title: "Finder",
    description:
      "Shazam for items, take a picture of the item and be able to check it out in a matter of seconds.",
    techStack: ["", "", "", ""],
    imageUrl: "/images/vox.png",
    featured: true,
    year: 2026,
  },
  {
    id: "6",
    title: "Vox",
    description:
      "Elevate your public speaking with real-time feedback on fluency and articulation to ensure your voice is always heard.",
    techStack: ["", "", "", ""],
    imageUrl: "/images/vox.png",
    featured: true,
    year: 2026,
  },
];

/**
 * ProjectsSection Component
 *
 * Phase 4 implementation featuring:
 * - Horizontal film strip controlled by vertical scrolling
 * - GSAP ScrollTrigger for parallax effect
 * - Film strip visual with sprocket holes
 * - Hover interactions on each project frame
 */
export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const filmStripRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !filmStripRef.current || !containerRef.current) return;

      const filmStrip = filmStripRef.current;
      const container = containerRef.current;

      // Calculate the total scroll distance needed
      // Film strip width minus the visible container width
      const totalScrollDistance = filmStrip.scrollWidth - container.offsetWidth;

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
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Main parallax animation - scroll Y drives translateX
      gsap.to(filmStrip, {
        x: -totalScrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrub with 1 second lag
          pin: containerRef.current,
          pinSpacing: false,
          invalidateOnRefresh: true, // Recalculate on resize
        },
      });

      // Staggered fade-in for film frames
      const frames = filmStrip.querySelectorAll(".film-frame-container");
      gsap.fromTo(
        frames,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-vintage-cream"
      style={{ height: "200vh" }} // Tall section for parallax movement
    >
      {/* Section Header - Fixed during scroll */}
      <div
        ref={headerRef}
        className="absolute top-0 left-0 right-0 pt-16 pb-8 z-10 pointer-events-none"
      >
        <div className="section-container text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-vintage-dark-brown mb-4">
            Projects
          </h2>
        </div>
      </div>

      {/* Film Strip Container - Fixed viewport during scroll */}
      <div
        ref={containerRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
      >
        {/* Film edge decoration - top with grain texture */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-vintage-darkroom z-20">
          <div className="film-sprocket-strip" />
          {/* Grain texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Film Strip */}
        <div
          ref={filmStripRef}
          className="flex items-center gap-8 md:gap-12 pl-[10vw] pr-[50vw] will-change-transform"
        >
          {projects.map((project, index) => (
            <FilmFrame key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Film edge decoration - bottom with grain texture */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-vintage-darkroom z-20">
          <div className="film-sprocket-strip" />
          {/* Grain texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-vintage-dark-brown/60 z-30">
          <span className="font-body text-sm">Scroll to explore</span>
          <div className="w-px h-8 bg-vintage-dark-brown/30 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
