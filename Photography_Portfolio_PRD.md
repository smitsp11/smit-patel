# Product Requirements Document (PRD)

## Personal Portfolio Website -- Photography Theme

------------------------------------------------------------------------

## 1. Project Overview

**Project Name:** Photography-Themed Portfolio Website\
**Owner:** \[Your Name\]\
**Target Audience:** Recruiters, potential employers, collaborators, and
visitors interested in software engineering work\
**Primary Goal:** Showcase software engineering projects, experience,
and personal interests through a photography/camera-themed interface
with heavy emphasis on smooth animations and vintage aesthetics.

------------------------------------------------------------------------

## 2. Design Philosophy & Aesthetic

### Visual Theme

-   **Style:** Vintage / analog photography aesthetic with warm tones\
-   **Color Palette:** Sepia, cream, brown, muted oranges, film-like
    color grading\
-   **Typography:** Vintage-inspired fonts reminiscent of classic camera
    manuals\
-   **Atmosphere:** Nostalgic, artistic, professional yet personal

### Animation Priority

-   Heavy use of scroll-based animations throughout the site\
-   Smooth, seamless transitions between sections\
-   Parallax, fade-ins, slide-ins, and motion-based storytelling\
-   Seamless background blending (no hard section breaks)\
-   References: Hack the North, TreeHacks

------------------------------------------------------------------------

## 3. Technical Stack

### Core Technologies

-   **Frontend Framework:** React\
-   **3D Graphics:** Three.js\
-   **Animation Libraries:**
    -   GSAP\
    -   ScrollTrigger\
    -   Framer Motion\
-   **3D Model Source:** Sketchfab (Canon camera model)\
-   **Backend:** Node.js (optional -- contact form / CMS)\
-   **Styling:** CSS Modules or Styled Components\
-   **Smooth Scroll:** Locomotive Scroll or Lenis

### Performance Considerations

-   Pre-render camera animations where possible\
-   Desktop-first (Chrome & Safari)\
-   Lazy loading for images and 3D assets\
-   Code splitting for optimal load times

------------------------------------------------------------------------

## 4. Page Structure & Navigation

### Single-Page Smooth Scroll Layout

1.  Hero -- 3D Camera Model\
2.  About -- Polaroids & Personal Intro\
3.  Projects -- Horizontal Film Strip\
4.  Experience -- Vertical Timeline\
5.  Gallery -- Photography Showcase\
6.  Contact -- Social Links Footer

### Navigation Mechanics

-   Primary: Vertical scroll\
-   Secondary: Camera cursor follows mouse\
-   Scroll indicator in hero section

------------------------------------------------------------------------

## 5. Detailed Section Specifications

### 5.1 Hero Section -- 3D Camera Model

**Purpose:** Immediate thematic impact

**Layout** - Full viewport (100vh)\
- 3D Canon camera centerpiece\
- Name & title overlay\
- Scroll indicator

**3D Camera Behavior** - Mouse parallax interaction\
- Scroll-triggered rotation\
- Transforms into camera cursor

**Technical Notes** - Optimized Three.js scene\
- LOD if necessary

**Open Question:**\
What should the camera cursor icon look like?

------------------------------------------------------------------------

### 5.2 About Section

**Purpose:** Personal storytelling

**Layout** - Left: Bio text\
- Right: Polaroid photos

**Animations** - Text fades in from left\
- Polaroids flip/rotate from right

**Open Question:**\
Should polaroids be static, hover-interactive, or auto-cycling?

------------------------------------------------------------------------

### 5.3 Projects Section -- Film Strip

**Purpose:** Showcase 5--6 key projects

**Design** - Horizontal film strip aesthetic\
- Sprocket holes, frame numbers, film texture

**Interaction** - Vertical scroll drives horizontal motion\
- Hover reveals project details

**Technical** - GSAP ScrollTrigger\
- 60fps target

------------------------------------------------------------------------

### 5.4 Experience Section -- Timeline

**Purpose:** Display work & education

**Design** - Vertical timeline styled as film strip or camera strap\
- Entries alternate sides

**Animations** - Timeline draws on scroll\
- Entries slide/fade in

**Open Question:**\
Should education be integrated or separated?

------------------------------------------------------------------------

### 5.5 Gallery Section -- Photography Showcase

**Purpose:** Highlight photography passion

**Atmosphere** - Darkroom / gallery lighting\
- Spotlight effects

**Layout** - Carousel of polaroid photos\
- Optional autoplay

**Scroll Effect** - Lights dim on entry\
- Photo illumination

------------------------------------------------------------------------

### 5.6 Contact Section

**Purpose:** Easy connection

**Design** - Compact footer\
- Icon-based links

**Links** - GitHub\
- LinkedIn\
- Twitter\
- Email

------------------------------------------------------------------------

## 6. Background & Global Animations

-   Seamless gradient transitions\
-   Film grain texture\
-   Parallax and staggered animations\
-   Custom camera cursor

------------------------------------------------------------------------

## 7. Performance Requirements

-   60fps animations\
-   \<3s load time\
-   GPU-accelerated transforms

------------------------------------------------------------------------

## 8. Content Requirements

-   Bio text\
-   Polaroid photos\
-   Project details\
-   Experience & education\
-   Photography gallery\
-   Social links

------------------------------------------------------------------------

## 9. Development Phases

1.  Foundation & Setup\
2.  Hero Section\
3.  About Section\
4.  Projects Section\
5.  Experience Section\
6.  Gallery Section\
7.  Contact & Polish\
8.  Final Review & Launch

------------------------------------------------------------------------

## 10. Success Metrics

-   Smooth performance\
-   Strong engagement\
-   Clear communication of skills & personality

------------------------------------------------------------------------

## 11. Open Questions

-   Camera cursor design\
-   Polaroid interactivity\
-   Education placement

------------------------------------------------------------------------

## 12. References & Inspiration

-   Hack the North\
-   TreeHacks\
-   Vintage camera UIs\
-   Film photography\
-   Old Wii interface

------------------------------------------------------------------------

**Document Status:** Ready for Development\
**Next Steps:** PM approval → Phase 1
