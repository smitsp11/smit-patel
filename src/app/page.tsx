"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section - Phase 2 */}
      <HeroSection />

      {/* About Section - Phase 3 */}
      <AboutSection />

      {/* Projects Section - Phase 4 */}
      <section
        id="projects"
        className="section-full flex items-center bg-vintage-cream"
      >
        <div className="section-container">
          <h2 className="font-display text-4xl md:text-5xl text-vintage-dark-brown mb-8">
            Projects
          </h2>
          <p className="font-body text-lg text-vintage-dark-brown/80">
            Coming in Phase 4...
          </p>
        </div>
      </section>

      {/* Experience Section - Phase 5 */}
      <section
        id="experience"
        className="section-full flex items-center bg-vintage-cream"
      >
        <div className="section-container">
          <h2 className="font-display text-4xl md:text-5xl text-vintage-dark-brown mb-8">
            Experience
          </h2>
          <p className="font-body text-lg text-vintage-dark-brown/80">
            Coming in Phase 5...
          </p>
        </div>
      </section>

      {/* Gallery Section - Phase 6 */}
      <section
        id="gallery"
        className="section-full flex items-center bg-vintage-darkroom"
      >
        <div className="section-container">
          <h2 className="font-display text-4xl md:text-5xl text-vintage-cream mb-8">
            Gallery
          </h2>
          <p className="font-body text-lg text-vintage-cream/80">
            Coming in Phase 6...
          </p>
        </div>
      </section>

      {/* Contact Section - Phase 7 */}
      <section id="contact" className="py-16 bg-vintage-dark-brown">
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
