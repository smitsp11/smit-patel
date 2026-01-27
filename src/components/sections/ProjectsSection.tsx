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
    imageUrl: "/images/behavaced,png",
    githubUrl: "https://github.com/smitsp11/BehavAced",
    featured: true,
    year: 2025,
  },
  {
    id: "2",
    title: "Real-time Collaboration",
    description:
      "A collaborative workspace platform enabling teams to work together in real-time with seamless synchronization.",
    techStack: ["Next.js", "WebSocket", "PostgreSQL", "Redis"],
    imageUrl: "/images/polaroid-2.svg",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    featured: true,
    year: 2024,
  },
  {
    id: "3",
    title: "Photography Portfolio",
    description:
      "A beautiful, performant portfolio website with 3D elements and smooth scroll animations. You're looking at it!",
    techStack: ["Next.js", "Three.js", "GSAP", "Tailwind"],
    imageUrl: "/images/polaroid-3.svg",
    githubUrl: "https://github.com",
    featured: true,
    year: 2024,
  },
  {
    id: "4",
    title: "E-commerce Platform",
    description:
      "A modern e-commerce solution with headless CMS integration, Stripe payments, and inventory management.",
    techStack: ["React", "Node.js", "MongoDB", "Stripe"],
    imageUrl: "/images/polaroid-1.svg",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    featured: false,
    year: 2023,
  },
  {
    id: "5",
    title: "Weather Dashboard",
    description:
      "A comprehensive weather application with beautiful visualizations, forecasts, and location-based alerts.",
    techStack: ["Vue.js", "D3.js", "Express", "OpenWeather API"],
    imageUrl: "/images/polaroid-2.svg",
    githubUrl: "https://github.com",
    featured: false,
    year: 2023,
  },
  {
    id: "6",
    title: "Task Management App",
    description:
      "A productivity tool with kanban boards, time tracking, and team collaboration features.",
    techStack: ["React Native", "Firebase", "Redux", "TypeScript"],
    imageUrl: "/images/polaroid-3.svg",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    featured: false,
    year: 2023,
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
        {/* Film edge decoration - top */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-vintage-darkroom z-20">
          <div className="film-sprocket-strip" />
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

        {/* Film edge decoration - bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-vintage-darkroom z-20">
          <div className="film-sprocket-strip" />
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
