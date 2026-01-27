"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ContactSection } from "@/components/sections/ContactSection";

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
      <ContactSection />
    </main>
  );
}
