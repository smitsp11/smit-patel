# Minimal Portfolio Redesign — Design Spec

**Date:** 2026-07-08  
**Status:** Approved  
**Branch:** `redesign/minimal` (off `main`)

## Summary

Replace the "Shot on Smit" film-camera experience with a single-column, typography-first personal site. Same content, radically simpler presentation. Inspired by [Rajan Agarwal](https://www.rajan.sh/), [Tejas Thind](https://www.tejasthind.com/), [Austin Jian](https://www.austinjian.com/), and peers.

**One theme only:** warm beige light mode. No dark mode toggle.

## Goals

- Easy to read in under 60 seconds
- Fast load (no Three.js, GSAP scroll pinning, or Lenis)
- Professional for recruiters and peers
- Photography present but quiet — 3 inline images in the bio, no gallery section

## Non-Goals

- Film/camera metaphors (loader, HUD, shutter, contact sheet, darkroom)
- Scroll-driven animations or parallax
- Dark mode or theme switching
- Dedicated photography gallery page/section

## Layout

Single scrolling page, max content width **640px**, centered. Sticky top nav with anchor links.

```
┌─────────────────────────────────────────┐
│  smit patel          About · Work · ... │
├─────────────────────────────────────────┤
│  Smit Patel                             │
│  Software Engineer · Photographer       │
│  [bio prose]                            │
│  GitHub · LinkedIn · X · Email          │
│  [Chicago] [Sunset] [Toronto]  (3 imgs) │
├─────────────────────────────────────────┤
│  Experience (+ Education, Resume link)  │
├─────────────────────────────────────────┤
│  Projects (vertical list)               │
├─────────────────────────────────────────┤
│  Reach out + footer + Canadian webring  │
└─────────────────────────────────────────┘
```

### Navigation

- Sticky, `backdrop-blur` on beige background
- Text links: `About` `#about`, `Experience` `#experience`, `Projects` `#projects`, `Contact` `#contact`
- No hamburger on mobile — horizontal scroll or wrap

## Color System (warm beige, light only)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#F5F0E8` | Page background (warm beige) |
| `--bg-elevated` | `#FAF7F2` | Nav, subtle cards |
| `--text` | `#2C2419` | Primary body (warm near-black) |
| `--text-muted` | `#7A6F63` | Dates, locations, captions |
| `--border` | `#E5DDD3` | Dividers, subtle rules |
| `--link` | `#2C2419` | Links; underline on hover |

No sepia/rust/darkroom palette. Photography supplies color.

## Typography

| Role | Font | Size |
|------|------|------|
| Name (h1) | Playfair Display (existing) | 2.5rem / 3rem |
| Section headings (h2) | Playfair Display | 1.5rem |
| Body | Inter (existing) | 1rem, line-height 1.65 |
| Meta (dates, tech) | Inter | 0.875rem, muted |

Drop Caveat handwritten font.

## Content (preserved from current site)

### Hero / About (`#about`)

**Headline:** Smit Patel  
**Subline:** Software Engineer · Photographer

**Bio prose** (condensed from current Craft/Aesthetic/Fuel/Community blocks):

> Computer Engineering at the University of Toronto. I build full-stack products — from AI interview coaches to autonomous racing software. Outside code: photography, Formula 1, weight lifting, and hosting community events.

**Skills** (single muted line):  
Python · C++ · JavaScript · LLMs · FastAPI · PostgreSQL · AWS

**Social links** (inline text, `·` separated):  
GitHub · LinkedIn · X · Email — same URLs as current `ContactSection`

### Inline photography (3 images, no gallery section)

| Image | File | Caption |
|-------|------|---------|
| Chicago Skyline | `/images/IMG_3958.png` | Chicago |
| Beach Sunset | `/images/IMG_0121.JPG` | Port Burwell |
| Toronto Ferry | `/images/IMG_8507.png` | Toronto |

- Row of 3, equal width, ~120px tall, `object-cover`, `rounded-sm`
- Location captions below in `text-xs text-muted`
- Mobile: horizontal scroll with snap, or 2 visible + peek

### Experience (`#experience`)

Chronological list (no timeline line, no aperture markers):

1. **Stealth** — Software Engineer Intern · 2026 – Present · Ottawa  
   Engineering a full-stack engine for a consulting firm to examine investment opportunities.

2. **UofT Formula Racing Team** — Software Developer · 2025 – 2026 · Toronto  
   Built the brain that allows a formula race car to see the track and drive itself.

3. **Stupid Ideas Hackathon** — Co-Founder · 2025 – Present · Toronto  
   Building a global community of builders by removing the pressure of competition and reintroducing passion in creation.

4. **TailorMate Startup** — Founder · 2025 – 2026 · Toronto  
   Engineered the AI infrastructure and recommendation algorithms behind a personalized fashion marketplace for over 1,000 products.

**Education:**  
University of Toronto · Computer Engineering · Expected Graduation 2028  
Faculty of Applied Science & Engineering Award ($10,000)

**Resume:** text link (URL TBD — current site has empty `href`)

### Projects (`#projects`)

Vertical list, each entry:

- **Title** (year) — linked to GitHub where available
- One-line description
- Tech stack as muted inline tags

| Project | Year | Tech |
|---------|------|------|
| BehavAced | 2025 | Python, Supabase, AI, Next.js |
| Sonna | 2025 | Python, FastAPI, PostgreSQL, Celery |
| Viva | 2026 | TypeScript, FastAPI, MongoDB, Auth |
| readMax | 2026 | HTML, RSVP, JavaScript, ORP |

### Contact (`#contact`)

> Reach out — smitspatel11@gmail.com

Footer: © 2026 Smit Patel · Canadian webring widget (keep existing embed)

## Components (new)

| Component | Responsibility |
|-----------|----------------|
| `SiteNav` | Sticky nav, anchor links |
| `Section` | `id`, heading, consistent vertical rhythm |
| `ExperienceItem` | Company, role, dates, location, description |
| `ProjectItem` | Title, year, description, tech, GitHub link |
| `PhotoStrip` | 3 inline images + captions |
| `SocialLinks` | Inline text links |

## Removed (delete or stop importing)

### Dependencies to remove
- `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`
- `gsap`, `@gsap/react`
- `lenis`
- `zustand` (if no stores remain)

### Features / files to remove
- All `src/components/three/*`
- Film UX: `ViewfinderHUD`, `ShutterEffect`, `FilmTray`, `RackFocus`, `ApertureCursor`, `LoadingScreen`, `LensDiveOverlay`, `SectionCaptureObserver`, `FilmFrame`, `GalleryCarousel`, `DarkroomGallery`, `Polaroid`, `TimelineCard` film styling, etc.
- `ContactSheetSection` and roll-recording (`rollStore`, `shutterBus`, contact sheet lib)
- `LenisProvider`, `HeroProvider`, `CapabilitiesProvider`, `BackgroundLayer`, `AtmosphereOverlay`
- Audio store and synthesized shutter audio

### Sections removed
- Full Gallery section
- "Your Roll" contact sheet epilogue

## Accessibility

- Skip link to `#about`
- Single `h1`, `h2` per section
- Visible focus rings on links
- `prefers-reduced-motion`: no animations
- Semantic HTML throughout

## Mobile

- Single column
- Nav links wrap or scroll horizontally
- Photo strip: horizontal snap scroll
- Touch targets ≥ 44px for links

## Testing

- Update Playwright smoke test for new section IDs and absence of loader/3D
- Remove unit tests for deleted modules (`shutterBus`, `contactSheet`, etc.)
- `npm run build` must pass with stripped dependencies

## Implementation Notes

- Branch from `main` (not `shot-on-smit`) so cinematic version stays on `shot-on-smit`
- Prefer rewriting `page.tsx` and `layout.tsx` clean rather than patching old sections
- Reuse `src/types` and content data where possible; move project/job arrays to `src/data/` for clarity
- Keep `public/images/` assets; only 3 photos referenced in new design
