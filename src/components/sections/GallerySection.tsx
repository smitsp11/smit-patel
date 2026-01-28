"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Photo } from "@/types";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Gallery photo data
const galleryPhotos: Photo[] = [
  {
    id: "1",
    src: "/images/IMG_0121.jpg",
    alt: "Landscape photography - Mountain vista",
    caption: "Beach Sunset",
    location: "Port Burwell, Canada",
    width: 800,
    height: 600,
  },
  {
    id: "2",
    src: "/images/IMG_6976.jpg",
    alt: "Street photography - Urban scene",
    caption: "Santorini Stairs",
    location: "Santorini, Greece",
    width: 800,
    height: 600,
  },
  {
    id: "3",
    src: "/images/IMG_3958.png",
    alt: "Nature photography - Forest path",
    caption: "Chicago Skyline",
    location: "Chicago, USA",
    width: 800,
    height: 600,
  },
  {
    id: "4",
    src: "/images/IMG_8156.png",
    alt: "Golden hour photography",
    caption: "Rooftop",
    location: "Toronto, Canada",
    width: 800,
    height: 600,
  },
  {
    id: "5",
    src: "/images/IMG_8188.png",
    alt: "Portrait photography",
    caption: "Mykonos Alley",
    location: "Mykonos, Greece",
    width: 800,
    height: 600,
  },
  {
    id: "6",
    src: "/images/IMG_8507.png",
    alt: "Architecture photography",
    caption: "Toronto Ferry",
    location: "Toronto, Canada",
    width: 800,
    height: 600,
  },
];

/**
 * GallerySection Component
 *
 * Phase 6 implementation featuring:
 * - Darkroom atmosphere with background color transition
 * - Horizontal carousel of photos with spotlight effect
 * - Vignette overlay for gallery ambiance
 * - Smooth scroll-triggered animations
 */
export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselInnerRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const backgroundLayer = document.getElementById("background-layer");

      // Background color transition - Cream to Darkroom
      if (backgroundLayer) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            // Interpolate from cream (#fdfbf7) to darkroom (#1a1a1a)
            const r = Math.round(253 - progress * (253 - 26));
            const g = Math.round(251 - progress * (251 - 26));
            const b = Math.round(247 - progress * (247 - 26));
            backgroundLayer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          },
        });

        // Reverse transition when scrolling back up
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "bottom 80%",
          end: "bottom 20%",
          scrub: 1,
          onLeaveBack: () => {
            gsap.to(backgroundLayer, {
              backgroundColor: "#fdfbf7",
              duration: 0.6,
              ease: "power1.inOut",
            });
          },
        });
      }

      // Header animation
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

      // Stagger photo reveals
      photoRefs.current.forEach((photo, index) => {
        if (!photo) return;

        gsap.fromTo(
          photo,
          {
            opacity: 0,
            scale: 0.9,
            y: 30,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: carouselRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  // Carousel navigation
  const scrollToPhoto = (index: number) => {
    if (!carouselInnerRef.current) return;

    const photoWidth = 400 + 24; // photo width + gap
    const scrollPosition = index * photoWidth;

    carouselInnerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    if (!carouselInnerRef.current) return;

    const scrollLeft = carouselInnerRef.current.scrollLeft;
    const photoWidth = 400 + 24;
    const newIndex = Math.round(scrollLeft / photoWidth);
    setActiveIndex(Math.min(newIndex, galleryPhotos.length - 1));
  };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative min-h-screen py-20 md:py-32 overflow-hidden"
    >
      {/* Vignette Spotlight Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.7) 100%)",
        }}
      />

      {/* Film grain texture for darkroom feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Content Container */}
      <div className="relative z-30">
        {/* Section Header */}
        <div ref={headerRef} className="section-container text-center mb-12 md:mb-16 relative z-10">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-vintage-cream mb-4">
            Gallery
          </h2>
          <p className="font-body text-lg text-vintage-cream/70 max-w-2xl mx-auto">
            capturing my favourite moments
          </p>
        </div>

        {/* Carousel Container */}
        <div ref={carouselRef} className="relative z-50 mt-16 md:mt-24">
          {/* Gallery Track */}
          <div
            ref={carouselInnerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto hide-scrollbar px-8 md:px-16 pb-8 pt-8 snap-x snap-mandatory"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {galleryPhotos.map((photo, index) => (
              <div
                key={photo.id}
                ref={(el) => {
                  photoRefs.current[index] = el;
                }}
                className="gallery-photo-card relative z-40 flex-shrink-0 w-[320px] md:w-[400px] snap-center"
              >
                {/* Photo Frame */}
                <div className="relative group">
                  {/* Spotlight glow effect on hover */}
                  <div className="absolute -inset-4 bg-vintage-sepia/0 group-hover:bg-vintage-sepia/10 rounded-lg transition-all duration-500 blur-xl" />

                  {/* Photo Container */}
                  <div className="relative bg-vintage-darkroom border border-vintage-cream/10 rounded-lg overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                        sizes="(max-width: 768px) 320px, 400px"
                        loading="lazy"
                      />

                      {/* Subtle overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Caption Area */}
                    <div className="p-4 md:p-5 bg-gradient-to-t from-vintage-darkroom to-vintage-darkroom/90">
                      <p className="font-handwritten text-xl md:text-2xl text-vintage-cream mb-1">
                        {photo.caption}
                      </p>
                      {photo.location && (
                        <p className="font-body text-sm text-vintage-cream/50 flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {photo.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {galleryPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToPhoto(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-vintage-sepia w-6"
                    : "bg-vintage-cream/30 hover:bg-vintage-cream/50"
                }`}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows - Desktop Only */}
          <button
            onClick={() => scrollToPhoto(Math.max(0, activeIndex - 1))}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-vintage-cream/10 hover:bg-vintage-cream/20 text-vintage-cream transition-all duration-300 backdrop-blur-sm z-40"
            aria-label="Previous photo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollToPhoto(Math.min(galleryPhotos.length - 1, activeIndex + 1))}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-vintage-cream/10 hover:bg-vintage-cream/20 text-vintage-cream transition-all duration-300 backdrop-blur-sm z-40"
            aria-label="Next photo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Red Darkroom Light Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />
      </div>
    </section>
  );
}
