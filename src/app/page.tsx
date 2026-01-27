"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { GallerySection } from "@/components/sections/GallerySection";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section - Phase 2 */}
      <HeroSection />

      {/* About Section - Phase 3 */}
      <AboutSection />

      {/* Projects Section - Phase 4 */}
      <ProjectsSection />

      {/* Experience Section - Phase 5 */}
      <ExperienceSection />

      {/* Gallery Section - Phase 6 */}
      <GallerySection />

      {/* Contact Section - Phase 7 */}
      <section id="contact" className="relative py-16 bg-vintage-darkroom z-40">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl md:text-4xl text-vintage-cream mb-6">
            Get In Touch
          </h2>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="text-vintage-cream hover:text-vintage-sepia transition-colors"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-vintage-cream hover:text-vintage-sepia transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-vintage-cream hover:text-vintage-sepia transition-colors"
              aria-label="Email"
            >
              Email
            </a>
          </div>
          <p className="mt-8 text-vintage-cream/60 text-sm">
            © {new Date().getFullYear()} Smit Patel. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
