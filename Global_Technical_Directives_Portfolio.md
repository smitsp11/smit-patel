# Global Technical Directives & Development Plan

## Photography-Themed Portfolio Website

------------------------------------------------------------------------

## Global Technical Directives

-   **Framework:** React (Next.js App Router recommended for Vercel
    deployment)
-   **Language:** TypeScript (Strict mode enabled)
-   **Styling:** Tailwind CSS (layout) + CSS Modules (complex
    vintage-specific styles)
-   **State Management:** React Context (global cursor state and theme
    switching)
-   **Animation Engine:** GSAP (ScrollTrigger is mandatory) + React
    Three Fiber (R3F)
-   **Asset Strategy:** All static assets (GLB models, images) must be
    placed in `/public`

------------------------------------------------------------------------

## Phase 1: Foundation & Architecture Setup

### Goal

Create a type-safe, performant skeleton with smooth scrolling enabled.

### Project Initialization

-   Initialize Next.js with TypeScript and Tailwind CSS
-   Configure `tsconfig.json` for absolute imports:
    -   `@/components`
    -   `@/assets`

### Dependency Installation

**Core** - `three` - `@react-three/fiber` - `@react-three/drei`

**Animation** - `gsap` - `@gsap/react` (safe hook only)

**Smooth Scroll** - `lenis` (React wrapper preferred over Locomotive for
Next.js/Vercel compatibility)

**Utility** - `clsx` - `tailwind-merge`

### Global Styles & Theme Configuration

-   Define CSS variables for the vintage palette:
    -   Cream
    -   Sepia
    -   Rust
    -   Dark Brown
-   Create a fixed background `<div>` with `z-index: -1` to handle
    smooth color transitions:
    -   Cream → Darkroom Black

### Component Structure

-   Create `Layout.tsx` wrapping the app with the `<Lenis>` provider

### Action Item

-   Immediately create `types/index.ts` defining interfaces for:
    -   `Project`
    -   `Job`
    -   `Photo`

### 🛑 Potential Pitfall

Installing GSAP without properly configuring `useGSAP` in React 18+ can
cause double-firing animations.\
**Directive:** Strict usage of `@gsap/react` only.

------------------------------------------------------------------------

## Phase 2: Hero Section (The 3D Scene)

### Goal

Render the 3D camera and implement the cursor handoff logic.

### 3D Setup (R3F)

-   Create `<SceneCanvas />` component:
    -   Fixed position
    -   Full viewport (`h-screen`)
-   Implement loader using `drei/useProgress` to ensure the model is
    ready before fade-in

### The Model

-   Load Canon camera GLTF/GLB from `/public`
-   Optimization:
    -   Use `gltfjsx` CLI to convert model into a declarative React
        component
    -   Ensure proper TypeScript typing

### Lighting

-   Standard 3-point lighting
-   Emphasize vintage metal textures

### Interaction Logic (The Handoff)

-   **State:** `isHeroVisible` (boolean)
-   **ScrollTrigger:** Attached to Hero container

**Animation Timeline** - Scroll 0%: Camera fits screen - Scroll
10--50%: - Slight rotation - Opacity transitions from `1 → 0` - Scroll
50%: - Trigger global state enabling the Custom Lens Cursor

### Overlay

-   Absolute-positioned text (Name / Role) over canvas
-   `z-index: 10`
-   `pointer-events: none` to avoid blocking interaction

### 🛑 Potential Pitfall

Heavy 3D models can block the main thread.\
**Directive:** Compress GLB files under 2MB using Draco compression if
possible.

------------------------------------------------------------------------

## Phase 3: Custom Cursor & About Section

### Goal

Implement the Lens cursor and Polaroid animations.

### The Lens Cursor

-   Global `<Cursor />` component
-   Fixed position, `pointer-events: none`

**Visuals** - Circular div - Vintage gold/silver border -
`backdrop-filter: contrast(1.1)` to simulate glass lens

**Logic** - Track mouse X/Y using `useEffect` - Apply lerp interpolation
so cursor slightly lags behind mouse

**Visibility** - Hidden initially - Fades in only when
`isHeroVisible === false`

### About Section Layout

-   Two-column grid:
    -   Left: Bio typography
    -   Right: Polaroids

### Polaroid Component

**Structure** - White container - Image - Handwritten caption font

**Animation** - Initial state: - `opacity: 0` -
`rotate: random(-15deg, 15deg)` - `x: 100` - ScrollTrigger: - Stagger
polaroids flying in

**Interaction** - No hover effects - Static once landed

------------------------------------------------------------------------

## Phase 4: Projects Section (The Parallax Film Strip)

### Goal

Horizontal film strip controlled by vertical scrolling.

### Film Strip Container

-   Physically taller than viewport (e.g., `h-[200vh]`)
-   Allows time for parallax movement

### Strip Behavior

-   Strip is fixed, sticky, or transform-managed
-   **Do NOT use `position: sticky` for movement**

### Visual Assets

-   Sprocket holes:
    -   CSS pattern or SVG strip
-   Frames:
    -   Each project is a film frame

### The Parallax Math (Critical)

-   Use GSAP to translate the strip on the X-axis based on vertical
    scroll
-   Formula:
    -   Scroll Y ↓ → `translateX` ←
-   Example:
    -   `x: -500px` (or strip width) over section height

**Directive** - Strip must be wide enough to remain visible - Movement
must be scrub-synced so it does not fly off-screen

### Project Data

-   Map through projects array

### Hover Interaction

-   Darken frame image
-   Slide up `.details-overlay`:
    -   Tech stack
    -   GitHub link

### 🛑 Potential Pitfall

Parallax moving too fast for content consumption.\
**Directive:** Tune GSAP `scrub` value carefully.

------------------------------------------------------------------------

## Phase 5: Experience Section (Timeline)

### Goal

Vertical timeline with static education block at the end.

### Central Line

-   Centered `div` with `w-1`
-   Animation:
    -   Height grows from `0% → 100%` based on scroll

### Timeline Nodes

-   Alternating left/right layout
-   Marker:
    -   Custom SVG aperture icon on center line

### Content Cards

-   Styled as film exposures:
    -   Rounded corners
    -   Subtle grain texture
-   Animation:
    -   Fade in
    -   Slide up as central line passes

### Education Block

-   Distinct container at bottom
-   Full-width or centered
-   Simple content:
    -   Degree
    -   University
    -   Year

------------------------------------------------------------------------

## Phase 6: Gallery (The Darkroom Transition)

### Goal

Complete atmospheric shift to a darkroom aesthetic.

### Background Transition (Complex Logic)

-   GSAP ScrollTrigger on Gallery container

**onEnter** - Animate global background color to `#1a1a1a`

**onLeaveBack** - Animate background back to `#fdfbf7`

**Easing** - `power1.inOut`

### Gallery Carousel

-   Horizontal overflow scroll OR click-based slider

### Spotlight Effect

-   CSS radial gradient overlay:

```{=html}
<!-- -->
```
    radial-gradient(circle, transparent 50%, rgba(0,0,0,0.8) 100%)

-   Creates vignette focus

### Images

-   Use `next/image`
-   High-resolution landscapes

### 🛑 Potential Pitfall

Z-index conflicts.\
**Directive:** Global background must remain at `z-index: -1`.

------------------------------------------------------------------------

## Phase 7: Optimization & Final Logic

### Goal

Ensure 60fps performance and error-free deployment.

### Asset Handling

-   Images: `/public/images`
-   3D models: `/public/models`

### Type Safety Audit

-   Run `tsc --noEmit`
-   No `any` types for critical props

### Performance

-   Lazy-load Gallery images
-   Confirm `drei/useGLTF` caching

### Mobile Check

-   Desktop-first but must not break on mobile
-   Timeline collapses to single column under `768px`

------------------------------------------------------------------------

## Phase 8: Deployment (Vercel)

### Environment

-   Set up Vercel project
-   Run `npm run build` locally before push

### Public Assets

-   Verify `/public` assets are served correctly

### Final Polish

-   Test Lens cursor on Safari
-   Provide fallback opacity if `backdrop-filter` causes performance
    issues

------------------------------------------------------------------------

**Document Status:** Implementation-Ready\
**Deployment Target:** Vercel
