"use client";

import { forwardRef, useState } from "react";
import Image from "next/image";
import { Project } from "@/types";

interface FilmFrameProps {
  project: Project;
  index: number;
}

/**
 * FilmFrame Component
 * 
 * Renders a single project as a film frame with:
 * - Film aesthetic with sprocket holes
 * - Hover interaction: darkens image, slides up details overlay
 * - Tech stack and GitHub link display
 */
export const FilmFrame = forwardRef<HTMLDivElement, FilmFrameProps>(
  function FilmFrame({ project, index }, ref) {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        ref={ref}
        className="film-frame-container relative flex-shrink-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Film frame with sprocket holes */}
        <div className="relative bg-vintage-darkroom rounded-sm overflow-hidden">
          {/* Film grain texture overlay - mimics physical film material */}
          <div 
            className="absolute inset-0 opacity-[0.07] pointer-events-none z-[1]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Subtle matte texture for film material look */}
          <div 
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)',
            }}
          />

          {/* Sprocket holes - Top */}
          <div className="absolute top-0 left-0 right-0 h-6 flex justify-between px-2 z-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`top-${i}`}
                className="w-3 h-4 bg-vintage-darkroom rounded-b-sm mt-0 border-2 border-vintage-dark-brown/30"
              />
            ))}
          </div>

          {/* Sprocket holes - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-6 flex justify-between px-2 z-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`bottom-${i}`}
                className="w-3 h-4 bg-vintage-darkroom rounded-t-sm mb-0 border-2 border-vintage-dark-brown/30"
              />
            ))}
          </div>

          {/* Main frame content */}
          <div className="relative mx-4 my-8 overflow-hidden">
            {/* Project Image */}
            <div className="relative w-[320px] h-[240px] md:w-[400px] md:h-[300px] overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                unoptimized
                className={`
                  object-cover
                  transition-all duration-300 ease-out
                  ${isHovered ? "brightness-50 scale-105" : "brightness-100 scale-100"}
                `}
                sizes="(max-width: 768px) 320px, 400px"
              />
              
              {/* Film grain overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />

              {/* Details overlay - slides up on hover */}
              <div
                className={`
                  absolute inset-x-0 bottom-0
                  bg-gradient-to-t from-vintage-darkroom via-vintage-darkroom/90 to-transparent
                  p-4 pt-8
                  transform transition-transform duration-300 ease-out
                  ${isHovered ? "translate-y-0" : "translate-y-full"}
                `}
              >
                <h3 className="font-display text-lg md:text-xl text-vintage-cream mb-2">
                  {project.title}
                </h3>
                
                <p className="font-body text-sm text-vintage-cream mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs font-body bg-vintage-sepia/20 text-vintage-sepia rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex items-center gap-1.5
                        text-sm font-body text-vintage-cream
                        hover:text-vintage-sepia transition-colors
                      "
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex items-center gap-1.5
                        text-sm font-body text-vintage-cream
                        hover:text-vintage-sepia transition-colors
                      "
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-4 h-4"
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
                      Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
