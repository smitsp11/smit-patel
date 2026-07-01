# "Shot on Smit" — Site Redesign Spec

**Date:** 2026-07-01
**Status:** Approved direction, pending implementation plan

## Concept

Evolve smitpatel.xyz from a film-*themed* portfolio into a film-*structured* experience.
Today the site is styled like analog photography; the redesign makes the camera the
interface. Narrative arc: **load the roll → shoot the site through the viewfinder →
develop what you shot in the darkroom.**

Signature mechanic: **the site records each visit as a roll of film.** Section
transitions and interactions "capture" frames; the finale develops the visitor's
personal contact sheet.

## Goals & Audience

- Primary audience: peers, design/dev community, Awwwards-style crowd. Experience-first.
- The site itself is the proof of craft. Shareability matters (the contact sheet is the
  screenshot-able artifact).
- This is an **evolution of the existing codebase** (Next.js, GSAP/ScrollTrigger, Lenis,
  React Three Fiber, Tailwind, vintage palette, Playfair/Inter/Caveat fonts) — not a rewrite.

## Structure (Acts)

### Act 0 — Load the Roll (loading screen)
- Film-leader countdown (8…7…6…) with scratch/flicker treatment while assets preload.
- Ends with a sprocket-feed animation: the roll loads into the camera.
- Replaces the current `LoadingScreen` component.

### Act 1 — The Camera (hero)
- Keep: 3D vintage camera GLB, drag-to-rotate (PresentationControls), name overlay.
- Change the exit: scroll **dives into the lens**. GSAP-scrubbed R3F camera path pushes
  into the front element, glass distortion ramps, brief black, then an iris wipe opens
  into Act 2. Visitor is now "inside the camera looking out."

### Act 2 — Shoot (About / Projects / Experience)
Content remains DOM-based (readable, SEO-safe; keeps existing GSAP/Lenis work) with a
viewfinder layer on top:

- **Viewfinder HUD** (DOM/SVG overlay): corner focus brackets, frame counter
  (`FRM 03/12`), live readouts — scroll velocity → shutter speed, current section →
  scene label.
- **Focus brackets snap to hovered elements** with a lens-breathing wobble before lock.
- **Rack focus**: non-active sections sit under a slight CSS blur that racks sharp on
  arrival (GSAP-driven `filter: blur()` — reads as depth of field without rendering DOM
  into WebGL).
- **Shutter transitions between sections**: iris-blade wipe + one-frame white flash +
  frame drops into a film-strip tray at the bottom edge (the roll recorder).
- **Projects**: keep horizontal film-strip layout. Hover develops each frame from
  negative (orange-base, inverted) to positive. Card back shows fake EXIF: year, tech
  stack as lens/ISO, GitHub link as location.
- About polaroids and Experience timeline keep current layouts, reskinned to sit inside
  the viewfinder frame.

### Act 3 — Develop (gallery / darkroom)
- Keep the existing cream→darkroom background transition.
- Gallery becomes a WebGL scene: prints hanging on a line under a red safelight.
- Each print starts as blank photo paper and **develops on hover** via shader —
  noise-driven reveal, sepia blooming to color. Handwritten captions + locations stay.

### Epilogue — Your Contact Sheet
- Develops the visitor's roll: grid of captured frames in visit order, handwritten
  darkroom annotations + timestamps (e.g. "frame 7 — lingered here").
- Doubles as a site map: each frame links back to its section.
- Contact info styled as darkroom notes. Canadian webring widget stays.
- **Download as PNG**: contact sheet renders to canvas for sharing.

## Cross-cutting: Atmosphere Layer

- Full-screen WebGL overlay canvas (pointer-events: none), persistent across acts:
  animated film grain, halation on highlights, light leaks that flare with scroll
  velocity.
- **Lens cursor rebuilt**: aperture ring that stops down (blades close) on click and
  rotates while "focusing" on hover targets. Desktop / fine-pointer only.
- **Audio** (mute by default, toggle in HUD): film advance, shutter click, darkroom
  drips. Plain WebAudio — no extra dependency.

## Roll-Recording Mechanic

- Simple client state (extend existing HeroContext or replace with Zustand):
  `captures: { frameId, thumbnailSrc, timestamp, sectionId }[]`.
- Capture points: entering each section (auto), clicking a project ("shooting" it),
  hovering a gallery print to full development, easter eggs (stretch).
- Thumbnails are **pre-made assets per capture point** — no runtime screenshotting.
- Contact sheet composes captures in order; PNG export via canvas draw of the same data.

## Technical Architecture

- Next.js App Router, single page (current structure).
- Three R3F contexts, lazy-loaded per act:
  1. Hero camera scene (exists; add lens-dive camera path + distortion pass)
  2. Persistent atmosphere overlay (grain/halation/light-leak post-processing —
     @react-three/postprocessing)
  3. Darkroom gallery scene (prints + develop shader + safelight)
- HUD is DOM/SVG, animated with GSAP; positioned by a scroll/section observer.
- Scroll orchestration stays on ScrollTrigger + Lenis; shutter transitions are
  ScrollTrigger callbacks at section boundaries.

## Performance & Fallbacks

- Device-tier check on load (GPU/memory heuristic):
  - **High tier**: everything.
  - **Low tier / mobile**: keep narrative, grain, HUD; skip heavy post-processing and
    darkroom WebGL (photos render as DOM with a CSS develop approximation).
- `prefers-reduced-motion`: no shutter flashes, no light leaks, no lens dive; clean
  scroll with content intact.
- No WebGL: static fallback — content sections render normally, hero shows a still of
  the camera.
- All acts lazy-load; target: hero interactive < 3s on mid-tier laptop, 60fps scroll on
  high tier.

## Error Handling

- GLB / texture load failure → skip to static hero fallback, never block the page.
- Audio unlock only on first user gesture (browser policy); missing audio is silent, not
  an error.

## Testing

- Playwright smoke: page renders, all sections reachable by scroll, contact sheet shows
  ≥ 5 frames after a full scroll-through (one per auto-capturing section), PNG export
  produces a non-empty blob.
- Manual matrix: Chrome/Safari/Firefox desktop, iOS Safari, Android Chrome;
  reduced-motion on/off; WebGL disabled.

## Out of Scope

- CMS / content management (data stays in typed constants).
- Blog, case-study pages, routing beyond the single page.
- Concept C ("navigable 3D darkroom world") — explicitly rejected.
- Runtime screenshot capture for frames (pre-made thumbnails only).

## Build Order (high level, for the implementation plan)

1. Atmosphere overlay + rebuilt lens cursor (visible payoff, low risk)
2. Viewfinder HUD + rack focus + shutter transitions
3. Roll-recording state + film-strip tray
4. Act 1 lens dive
5. Act 0 film-leader loader
6. Act 3 darkroom WebGL + develop shader
7. Epilogue contact sheet + PNG export
8. Perf tiers, fallbacks, audio, polish
