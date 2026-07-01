# "Shot on Smit" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve smitpatel.xyz from a film-themed portfolio into a film-structured experience: load the roll → shoot the site through a viewfinder → develop the visitor's roll into a contact sheet.

**Architecture:** Content stays DOM-based (GSAP + Lenis + Tailwind, existing sections). Three WebGL surfaces: the existing hero camera scene (gains a lens-dive), a new persistent full-screen atmosphere shader overlay (grain / vignette / light leaks), and a new darkroom gallery scene (develop-on-hover shader). A Zustand "roll store" records captures; a shutter event bus triggers the iris-wipe transition; the epilogue renders the visitor's contact sheet and exports it to PNG.

**Tech Stack:** Next.js 14 (App Router), React 18, GSAP 3 + ScrollTrigger, Lenis, React Three Fiber 8 + drei 9 + three 0.182, Tailwind 3, Zustand (new), Vitest + Playwright (new, tests).

## Global Constraints

- This is an **evolution of the existing codebase**, not a rewrite. Keep the vintage palette (`vintage-*` Tailwind colors), fonts (`font-display` Playfair, `font-body` Inter, `font-handwritten` Caveat), Lenis smooth scroll, and existing section ids (`hero`, `about`, `projects`, `experience`, `gallery`, `contact`).
- Act 2 content (About/Projects/Experience) stays DOM-rendered — no DOM-to-WebGL compositing.
- No runtime screenshotting. Roll thumbnails are pre-assigned assets from `public/images/`.
- Audio is muted by default; sounds are synthesized with plain WebAudio (no audio files, no Howler).
- Single page, no new routes.
- Deviation from spec noted and accepted: the atmosphere layer uses a custom fullscreen `ShaderMaterial` quad instead of `@react-three/postprocessing` (there is no 3D scene to post-process; a quad is lighter).
- `prefers-reduced-motion: reduce` ⇒ no shutter flash, no light leaks, no lens dive, no rack focus, simple loader. Captures still record (they're state, not motion).
- No WebGL ⇒ static hero fallback (skip canvas + loader), everything else DOM.
- Known existing bug: `LenisProvider`'s context value is captured before the ref is set, so `useLenis()` always returns `null`. Do NOT rely on it — components that need scroll velocity measure `window.scrollY` deltas in their own rAF loop. Do not fix the provider in this plan (out of scope).
- Every task ends with `npx tsc --noEmit` passing and a commit.

---

### Task 1: Test infrastructure (Vitest + Playwright) and new deps

**Files:**
- Modify: `package.json` (scripts + deps)
- Create: `vitest.config.mts`
- Create: `playwright.config.ts`
- Modify: `.gitignore` (playwright artifacts)

**Interfaces:**
- Produces: `npm test` (Vitest, jsdom), `npm run test:e2e` (Playwright against dev server), `zustand` available for later tasks.

- [ ] **Step 1: Install dependencies**

```bash
npm install zustand
npm install -D vitest jsdom @testing-library/react @vitejs/plugin-react @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Add scripts to package.json**

In `package.json` `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 3: Create vitest.config.mts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

- [ ] **Step 4: Create playwright.config.ts**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3000",
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
```

- [ ] **Step 5: Ignore test artifacts**

Append to `.gitignore`:

```
/test-results/
/playwright-report/
```

- [ ] **Step 6: Verify tooling runs**

Run: `npx vitest run --passWithNoTests`
Expected: exits 0, "No test files found" is OK.

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.mts playwright.config.ts .gitignore
git commit -m "chore: add vitest + playwright test infra and zustand"
```

---

### Task 2: Capabilities detection (tier / reduced-motion / WebGL)

**Files:**
- Create: `src/lib/capabilities.ts`
- Create: `src/contexts/CapabilitiesContext.tsx`
- Test: `src/lib/capabilities.test.ts`
- Modify: `src/app/layout.tsx` (wrap providers)

**Interfaces:**
- Produces: `detectCapabilities(input: CapabilityInput): Capabilities`, `useCapabilities(): Capabilities | null` (null until client detection runs). `Capabilities = { webgl: boolean; reducedMotion: boolean; tier: "high" | "low" }`.

- [ ] **Step 1: Write the failing test**

`src/lib/capabilities.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { detectCapabilities, type CapabilityInput } from "./capabilities";

function makeInput(overrides: Partial<CapabilityInput> = {}): CapabilityInput {
  return {
    matchMedia: () => ({ matches: false }),
    createCanvas: () => ({ getContext: () => ({}) }), // WebGL available
    hardwareConcurrency: 8,
    deviceMemory: 8,
    ...overrides,
  };
}

describe("detectCapabilities", () => {
  it("returns high tier on a capable desktop", () => {
    const caps = detectCapabilities(makeInput());
    expect(caps).toEqual({ webgl: true, reducedMotion: false, tier: "high" });
  });

  it("returns low tier when WebGL is unavailable", () => {
    const caps = detectCapabilities(
      makeInput({ createCanvas: () => ({ getContext: () => null }) })
    );
    expect(caps.webgl).toBe(false);
    expect(caps.tier).toBe("low");
  });

  it("returns low tier on coarse pointer (mobile)", () => {
    const caps = detectCapabilities(
      makeInput({ matchMedia: (q) => ({ matches: q === "(pointer: coarse)" }) })
    );
    expect(caps.tier).toBe("low");
  });

  it("detects reduced motion without affecting tier", () => {
    const caps = detectCapabilities(
      makeInput({
        matchMedia: (q) => ({ matches: q === "(prefers-reduced-motion: reduce)" }),
      })
    );
    expect(caps.reducedMotion).toBe(true);
    expect(caps.tier).toBe("high");
  });

  it("returns low tier when getContext throws", () => {
    const caps = detectCapabilities(
      makeInput({
        createCanvas: () => ({ getContext: () => { throw new Error("boom"); } }),
      })
    );
    expect(caps.webgl).toBe(false);
    expect(caps.tier).toBe("low");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/capabilities.test.ts`
Expected: FAIL — cannot resolve `./capabilities`.

- [ ] **Step 3: Implement src/lib/capabilities.ts**

```ts
export type Tier = "high" | "low";

export interface Capabilities {
  webgl: boolean;
  reducedMotion: boolean;
  tier: Tier;
}

export interface CapabilityInput {
  matchMedia: (query: string) => { matches: boolean };
  createCanvas: () => { getContext: (id: string) => unknown };
  hardwareConcurrency?: number;
  deviceMemory?: number;
}

export function detectCapabilities(input: CapabilityInput): Capabilities {
  const reducedMotion = input.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = input.matchMedia("(pointer: coarse)").matches;

  let webgl = false;
  try {
    const canvas = input.createCanvas();
    webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webgl = false;
  }

  const cores = input.hardwareConcurrency ?? 4;
  const memory = input.deviceMemory ?? 8;
  const tier: Tier =
    webgl && !coarsePointer && cores > 4 && memory > 4 ? "high" : "low";

  return { webgl, reducedMotion, tier };
}

export function detectBrowserCapabilities(): Capabilities {
  return detectCapabilities({
    matchMedia: (q) => window.matchMedia(q),
    createCanvas: () => document.createElement("canvas"),
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/capabilities.test.ts`
Expected: 5 passed.

- [ ] **Step 5: Create the context provider**

`src/contexts/CapabilitiesContext.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Capabilities, detectBrowserCapabilities } from "@/lib/capabilities";

const CapabilitiesContext = createContext<Capabilities | null>(null);

export function CapabilitiesProvider({ children }: { children: ReactNode }) {
  const [caps, setCaps] = useState<Capabilities | null>(null);

  useEffect(() => {
    setCaps(detectBrowserCapabilities());
  }, []);

  return (
    <CapabilitiesContext.Provider value={caps}>
      {children}
    </CapabilitiesContext.Provider>
  );
}

/** Returns null until client-side detection has run (first effect). */
export function useCapabilities(): Capabilities | null {
  return useContext(CapabilitiesContext);
}
```

- [ ] **Step 6: Wrap the app in layout.tsx**

In `src/app/layout.tsx`, import the provider and wrap it around `HeroProvider`:

```tsx
import { CapabilitiesProvider } from "@/contexts/CapabilitiesContext";
```

```tsx
<CapabilitiesProvider>
  <HeroProvider>
    <LenisProvider>
      <BackgroundLayer />
      <LensCursor />
      {children}
    </LenisProvider>
  </HeroProvider>
</CapabilitiesProvider>
```

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit && npx vitest run`
Expected: both pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/capabilities.ts src/lib/capabilities.test.ts src/contexts/CapabilitiesContext.tsx src/app/layout.tsx
git commit -m "feat: device capability detection (webgl/tier/reduced-motion)"
```

---

### Task 3: Roll store + capture-point registry

**Files:**
- Create: `src/lib/frames.ts`
- Create: `src/stores/rollStore.ts`
- Test: `src/stores/rollStore.test.ts`

**Interfaces:**
- Produces:
  - `FRAME_TOTAL = 12`, `SECTION_CAPTURES: CapturePoint[]` where `CapturePoint = { frameId: string; sectionId: string; label: string; thumbnailSrc: string }`.
  - `useRollStore` (Zustand): `{ captures: RollFrame[]; capture(frame: Omit<RollFrame, "capturedAt">, capturedAt?: number): boolean; reset(): void }` with `RollFrame = CapturePoint & { capturedAt: number }` (ms since page load, `performance.now()`). `capture` returns `true` only for a new frameId.

- [ ] **Step 1: Write the failing test**

`src/stores/rollStore.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useRollStore } from "./rollStore";

const frame = (id: string) => ({
  frameId: id,
  sectionId: "about",
  label: "about smit",
  thumbnailSrc: "/images/creativity.JPG",
});

describe("rollStore", () => {
  beforeEach(() => useRollStore.getState().reset());

  it("captures a new frame and returns true", () => {
    const isNew = useRollStore.getState().capture(frame("sec-about"), 1000);
    expect(isNew).toBe(true);
    expect(useRollStore.getState().captures).toHaveLength(1);
    expect(useRollStore.getState().captures[0].capturedAt).toBe(1000);
  });

  it("dedupes by frameId and returns false", () => {
    useRollStore.getState().capture(frame("sec-about"), 1000);
    const isNew = useRollStore.getState().capture(frame("sec-about"), 2000);
    expect(isNew).toBe(false);
    expect(useRollStore.getState().captures).toHaveLength(1);
  });

  it("preserves capture order", () => {
    useRollStore.getState().capture(frame("a"), 1);
    useRollStore.getState().capture(frame("b"), 2);
    useRollStore.getState().capture(frame("c"), 3);
    expect(useRollStore.getState().captures.map((c) => c.frameId)).toEqual(["a", "b", "c"]);
  });

  it("reset clears the roll", () => {
    useRollStore.getState().capture(frame("a"), 1);
    useRollStore.getState().reset();
    expect(useRollStore.getState().captures).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/stores/rollStore.test.ts`
Expected: FAIL — cannot resolve `./rollStore`.

- [ ] **Step 3: Implement src/lib/frames.ts**

```ts
export const FRAME_TOTAL = 12;

export interface CapturePoint {
  frameId: string;
  sectionId: string;
  label: string;
  thumbnailSrc: string;
}

/** Auto-capture points: one per section, thumbnail from existing assets. */
export const SECTION_CAPTURES: CapturePoint[] = [
  { frameId: "sec-hero", sectionId: "hero", label: "the camera", thumbnailSrc: "/images/IMG_8156.png" },
  { frameId: "sec-about", sectionId: "about", label: "about smit", thumbnailSrc: "/images/creativity.JPG" },
  { frameId: "sec-projects", sectionId: "projects", label: "the projects", thumbnailSrc: "/images/behavaced.png" },
  { frameId: "sec-experience", sectionId: "experience", label: "the work", thumbnailSrc: "/images/cs.png" },
  { frameId: "sec-gallery", sectionId: "gallery", label: "the darkroom", thumbnailSrc: "/images/IMG_6976.JPG" },
  { frameId: "sec-contact", sectionId: "contact", label: "the sign-off", thumbnailSrc: "/images/weekend.png" },
];
```

- [ ] **Step 4: Implement src/stores/rollStore.ts**

```ts
import { create } from "zustand";
import { CapturePoint } from "@/lib/frames";

export interface RollFrame extends CapturePoint {
  /** ms since page load (performance.now()) */
  capturedAt: number;
}

interface RollState {
  captures: RollFrame[];
  /** Returns true when the frame is new (not previously captured). */
  capture: (frame: CapturePoint, capturedAt?: number) => boolean;
  reset: () => void;
}

export const useRollStore = create<RollState>((set, get) => ({
  captures: [],
  capture: (frame, capturedAt) => {
    if (get().captures.some((c) => c.frameId === frame.frameId)) return false;
    const at =
      capturedAt ?? (typeof performance !== "undefined" ? performance.now() : 0);
    set((s) => ({ captures: [...s.captures, { ...frame, capturedAt: at }] }));
    return true;
  },
  reset: () => set({ captures: [] }),
}));
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/stores/rollStore.test.ts`
Expected: 4 passed.

- [ ] **Step 6: Commit**

```bash
git add src/lib/frames.ts src/stores/rollStore.ts src/stores/rollStore.test.ts
git commit -m "feat: roll-recording store and capture-point registry"
```

---

### Task 4: Atmosphere overlay (grain / vignette / light leaks)

**Files:**
- Create: `src/components/three/AtmosphereOverlay.tsx`
- Modify: `src/app/layout.tsx` (mount it)

**Interfaces:**
- Consumes: `useCapabilities()` from Task 2.
- Produces: `<AtmosphereOverlay />` — fixed, pointer-events-none, z-45 full-screen canvas. Renders nothing when capabilities are null, WebGL is unavailable, tier is low, or reduced motion is set.

- [ ] **Step 1: Implement the component**

`src/components/three/AtmosphereOverlay.tsx`:

```tsx
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial, Vector2 } from "three";
import { useCapabilities } from "@/contexts/CapabilitiesContext";

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uLeak;
  uniform vec2 uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // Animated film grain
    float grain = (hash(uv * uResolution * 0.5 + fract(uTime) * 100.0) - 0.5) * 0.10;

    // Vignette: darkens toward corners
    float vignette = smoothstep(1.35, 0.55, length(uv - 0.5) * 2.0);

    // Warm light leak sweeping in from the top-right
    float leakMask = smoothstep(0.45, 1.15, uv.x + (1.0 - uv.y) * 0.6);
    vec3 leakColor = vec3(1.0, 0.55, 0.25) * uLeak * leakMask;

    vec3 color = leakColor + vec3(grain);
    float alpha = clamp(
      abs(grain) * 2.0 + uLeak * leakMask * 0.55 + (1.0 - vignette) * 0.35,
      0.0, 0.6
    );
    gl_FragColor = vec4(color, alpha);
  }
`;

function AtmospherePlane() {
  const materialRef = useRef<ShaderMaterial>(null);
  const { size } = useThree();
  const lastScroll = useRef({ y: 0, t: 0 });
  const smoothedLeak = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLeak: { value: 0 },
      uResolution: { value: new Vector2(1, 1) },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uResolution.value.set(size.width * state.viewport.dpr, size.height * state.viewport.dpr);

    // Scroll velocity -> light leak intensity (measured directly; useLenis is unreliable)
    const now = state.clock.elapsedTime;
    const dt = Math.max(now - lastScroll.current.t, 1 / 120);
    const velocity = Math.abs(window.scrollY - lastScroll.current.y) / dt; // px/s
    lastScroll.current = { y: window.scrollY, t: now };

    const targetLeak = Math.min(Math.max((velocity - 1500) / 2500, 0), 1);
    smoothedLeak.current += (targetLeak - smoothedLeak.current) * 0.06;
    u.uLeak.value = smoothedLeak.current;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function AtmosphereOverlay() {
  const caps = useCapabilities();
  if (!caps || !caps.webgl || caps.tier === "low" || caps.reducedMotion) return null;

  return (
    <div
      className="fixed inset-0 z-[45] pointer-events-none"
      aria-hidden="true"
      data-testid="atmosphere-overlay"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <AtmospherePlane />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Mount in layout.tsx**

In `src/app/layout.tsx`, import and add after `<LensCursor />`:

```tsx
import { AtmosphereOverlay } from "@/components/three/AtmosphereOverlay";
```

```tsx
<BackgroundLayer />
<LensCursor />
<AtmosphereOverlay />
{children}
```

Also remove the `film-grain` class from `<body>` (the shader replaces the CSS grain on high tier; low tier keeps CSS grain — re-add conditionally later in Task 15 if visual QA wants it back).

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, open http://localhost:3000.
Expected: subtle animated grain over the whole page; scrolling fast flares a warm light leak from the top-right; enabling "Emulate prefers-reduced-motion" in devtools and reloading removes the overlay (`[data-testid="atmosphere-overlay"]` absent).

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/three/AtmosphereOverlay.tsx src/app/layout.tsx
git commit -m "feat: atmosphere overlay - film grain, vignette, scroll light leaks"
```

---

### Task 5: Aperture cursor (replaces LensCursor)

**Files:**
- Create: `src/components/ui/ApertureCursor.tsx`
- Delete: `src/components/ui/LensCursor.tsx`
- Modify: `src/app/layout.tsx` (swap component)

**Interfaces:**
- Consumes: `useHero()` (`isHeroVisible`), `useCapabilities()`.
- Produces: `<ApertureCursor />` — desktop-only custom cursor: 6-blade SVG aperture that follows the mouse (lerp), rotates while over interactive targets (`a`, `button`, `[data-focusable]`), and stops down (blades close) on mousedown.

- [ ] **Step 1: Implement the component**

`src/components/ui/ApertureCursor.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useHero } from "@/contexts/HeroContext";
import { useCapabilities } from "@/contexts/CapabilitiesContext";

const BLADE_COUNT = 6;
const INTERACTIVE = "a, button, [data-focusable]";

export function ApertureCursor() {
  const { isHeroVisible } = useHero();
  const caps = useCapabilities();
  const rootRef = useRef<HTMLDivElement>(null);
  const bladesRef = useRef<SVGGElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setActive(true);

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let hovering = false;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      const nowHovering = !!target;
      if (nowHovering !== hovering && bladesRef.current) {
        hovering = nowHovering;
        // Open the iris wider over interactive elements
        gsap.to(bladesRef.current, {
          scale: hovering ? 1.35 : 1,
          transformOrigin: "50% 50%",
          duration: 0.35,
          ease: "power3.out",
        });
      }
    };

    const onDown = () => {
      if (!bladesRef.current) return;
      // Stop down: blades close then reopen
      gsap
        .timeline()
        .to(bladesRef.current, { scale: 0.45, duration: 0.1, ease: "power2.in", transformOrigin: "50% 50%" })
        .to(bladesRef.current, { scale: hovering ? 1.35 : 1, duration: 0.3, ease: "power3.out" });
    };

    const tick = () => {
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;
      if (rootRef.current) {
        rootRef.current.style.transform = `translate3d(${pos.x - 22}px, ${pos.y - 22}px, 0)`;
      }
      if (bladesRef.current) {
        const speed = hovering ? 1.6 : 0.25;
        gsap.set(bladesRef.current, { rotation: `+=${speed}`, transformOrigin: "50% 50%" });
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Hidden during hero (PresentationControls owns the cursor there)
  if (!active || !caps) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[70] pointer-events-none transition-opacity duration-300"
      style={{ opacity: isHeroVisible ? 0 : 1 }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(201, 169, 110, 0.9)" strokeWidth="1.5" />
        <g ref={bladesRef}>
          {Array.from({ length: BLADE_COUNT }).map((_, i) => (
            <path
              key={i}
              d="M22 7 L28 16 L22 22 Z"
              fill="rgba(201, 169, 110, 0.55)"
              transform={`rotate(${(360 / BLADE_COUNT) * i} 22 22)`}
            />
          ))}
        </g>
        <circle cx="22" cy="22" r="3" fill="none" stroke="rgba(201, 169, 110, 0.8)" strokeWidth="1" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Swap in layout.tsx and delete old cursor**

In `src/app/layout.tsx` replace the `LensCursor` import and usage:

```tsx
import { ApertureCursor } from "@/components/ui/ApertureCursor";
```

```tsx
<BackgroundLayer />
<ApertureCursor />
<AtmosphereOverlay />
```

Then delete the old file:

```bash
git rm src/components/ui/LensCursor.tsx
```

- [ ] **Step 3: Verify**

Run: `npm run dev`.
Expected: after scrolling past the hero, a gold aperture follows the mouse; it enlarges + spins faster over links/buttons; clicking snaps the blades closed and back open. During the hero it's invisible.

Run: `npx tsc --noEmit`
Expected: exits 0 (fails if anything still imports `LensCursor`).

- [ ] **Step 4: Commit**

```bash
git add -A src/components/ui src/app/layout.tsx
git commit -m "feat: aperture-blade cursor replacing lens cursor"
```

---

### Task 6: Shutter-speed mapping + Viewfinder HUD

**Files:**
- Create: `src/lib/shutter.ts`
- Test: `src/lib/shutter.test.ts`
- Create: `src/components/ui/ViewfinderHUD.tsx`
- Modify: `src/app/page.tsx` (mount HUD)
- Modify: `src/components/sections/AboutSection.tsx`, `src/components/ui/FilmFrame.tsx`, `src/components/ui/TimelineCard.tsx`, `src/components/sections/GallerySection.tsx` (add `data-focusable`)

**Interfaces:**
- Consumes: `useRollStore` (frame counter), `useHero()` (`isHeroVisible`), `SECTION_CAPTURES`, `FRAME_TOTAL`.
- Produces:
  - `velocityToShutter(pxPerSecond: number): number` — returns denominator from `[60, 125, 250, 500, 1000, 2000]`.
  - `<ViewfinderHUD />` — fixed pointer-events-none overlay: corner brackets, `FRM NN/12` counter, `1/N s · ISO 400 · <scene label>` readout, focus bracket that GSAP-tweens to the hovered `[data-focusable]` element.

- [ ] **Step 1: Write the failing test**

`src/lib/shutter.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { velocityToShutter } from "./shutter";

describe("velocityToShutter", () => {
  it("maps rest to 1/60", () => expect(velocityToShutter(0)).toBe(60));
  it("maps slow scroll to 1/125", () => expect(velocityToShutter(900)).toBe(125));
  it("maps fast scroll upward through stops", () => {
    expect(velocityToShutter(1700)).toBe(250);
    expect(velocityToShutter(2500)).toBe(500);
  });
  it("clamps at 1/2000", () => expect(velocityToShutter(50_000)).toBe(2000));
  it("uses absolute velocity", () => expect(velocityToShutter(-900)).toBe(125));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/shutter.test.ts`
Expected: FAIL — cannot resolve `./shutter`.

- [ ] **Step 3: Implement src/lib/shutter.ts**

```ts
const SHUTTER_STOPS = [60, 125, 250, 500, 1000, 2000];

/** Map scroll velocity (px/s) to a photographic shutter-speed denominator. */
export function velocityToShutter(pxPerSecond: number): number {
  const v = Math.abs(pxPerSecond);
  const idx = Math.min(SHUTTER_STOPS.length - 1, Math.floor(v / 800));
  return SHUTTER_STOPS[idx];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/shutter.test.ts`
Expected: 5 passed.

- [ ] **Step 5: Implement the HUD**

`src/components/ui/ViewfinderHUD.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useHero } from "@/contexts/HeroContext";
import { useRollStore } from "@/stores/rollStore";
import { SECTION_CAPTURES, FRAME_TOTAL } from "@/lib/frames";
import { velocityToShutter } from "@/lib/shutter";

const corner =
  "absolute w-8 h-8 border-vintage-brass/70 pointer-events-none";

export function ViewfinderHUD() {
  const { isHeroVisible } = useHero();
  const captureCount = useRollStore((s) => s.captures.length);
  const [shutter, setShutter] = useState(60);
  const [scene, setScene] = useState("the camera");
  const bracketRef = useRef<HTMLDivElement>(null);

  // Scroll velocity -> shutter readout
  useEffect(() => {
    let last = { y: window.scrollY, t: performance.now() };
    let rafId = 0;
    const tick = () => {
      const now = performance.now();
      const dt = Math.max(now - last.t, 8) / 1000;
      const v = (window.scrollY - last.y) / dt;
      last = { y: window.scrollY, t: now };
      setShutter(velocityToShutter(v));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Active scene label: section crossing the middle band of the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const point = SECTION_CAPTURES.find((c) => c.sectionId === entry.target.id);
            if (point) setScene(point.label);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    SECTION_CAPTURES.forEach((c) => {
      const el = document.getElementById(c.sectionId);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Focus bracket snaps to hovered [data-focusable] with a breathing wobble
  useEffect(() => {
    const bracket = bracketRef.current;
    if (!bracket) return;
    let current: Element | null = null;

    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.("[data-focusable]") ?? null;
      if (target === current) return;
      current = target;
      if (!target) {
        gsap.to(bracket, { opacity: 0, duration: 0.25 });
        return;
      }
      const r = target.getBoundingClientRect();
      gsap
        .timeline()
        .to(bracket, {
          opacity: 1,
          left: r.left - 8,
          top: r.top - 8,
          width: r.width + 16,
          height: r.height + 16,
          duration: 0.35,
          ease: "power3.out",
        })
        // lens breathing: slight overshoot before lock
        .to(bracket, { scale: 1.02, duration: 0.12, yoyo: true, repeat: 1, ease: "sine.inOut" });
    };

    document.addEventListener("mouseover", onOver);
    return () => document.removeEventListener("mouseover", onOver);
  }, []);

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none font-mono text-[11px] tracking-widest text-vintage-brass/80 transition-opacity duration-500"
      style={{ opacity: isHeroVisible ? 0 : 1 }}
      aria-hidden="true"
      data-testid="viewfinder-hud"
    >
      {/* Corner brackets */}
      <div className={`${corner} top-4 left-4 border-t-2 border-l-2`} />
      <div className={`${corner} top-4 right-4 border-t-2 border-r-2`} />
      <div className={`${corner} bottom-4 left-4 border-b-2 border-l-2`} />
      <div className={`${corner} bottom-4 right-4 border-b-2 border-r-2`} />

      {/* Frame counter */}
      <div className="absolute top-6 right-16">
        FRM {String(captureCount).padStart(2, "0")}/{FRAME_TOTAL}
      </div>

      {/* Readouts */}
      <div className="absolute bottom-6 left-16 flex gap-4">
        <span>1/{shutter}s</span>
        <span>ISO 400</span>
        <span className="uppercase">{scene}</span>
      </div>

      {/* Focus bracket (position/size driven by GSAP) */}
      <div
        ref={bracketRef}
        className="fixed opacity-0"
        style={{ left: 0, top: 0, width: 0, height: 0 }}
      >
        <div className={`${corner} -top-0 -left-0 border-t border-l w-4 h-4`} />
        <div className={`${corner} -top-0 right-0 border-t border-r w-4 h-4 absolute`} />
        <div className={`${corner} bottom-0 -left-0 border-b border-l w-4 h-4 absolute`} />
        <div className={`${corner} bottom-0 right-0 border-b border-r w-4 h-4 absolute`} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Mount HUD and tag focusable elements**

In `src/app/page.tsx`, import and render first inside `<main>`:

```tsx
import { ViewfinderHUD } from "@/components/ui/ViewfinderHUD";
```

```tsx
<main className="relative">
  <ViewfinderHUD />
  <HeroSection />
  ...
```

Add `data-focusable` attributes:
- `src/components/ui/FilmFrame.tsx` — on the root div (`className="film-frame-container ..."`): add `data-focusable`.
- `src/components/sections/AboutSection.tsx` — on each polaroid wrapper div (the one receiving `key={polaroid.id}`): add `data-focusable`.
- `src/components/ui/TimelineCard.tsx` — add `data-focusable` to the component's root element (the outermost div it returns).
- `src/components/sections/GallerySection.tsx` — on the div with `className="gallery-photo-card ..."`: add `data-focusable`.

- [ ] **Step 7: Verify**

Run: `npm run dev`.
Expected: after the hero, corner brackets + `FRM 00/12` + readouts appear; scrolling changes `1/60s` → higher stops; hovering a polaroid/film frame snaps the focus bracket to it with a small breathing wobble; scene label updates per section.

Run: `npx tsc --noEmit && npx vitest run`
Expected: both pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/shutter.ts src/lib/shutter.test.ts src/components/ui/ViewfinderHUD.tsx src/app/page.tsx src/components/ui/FilmFrame.tsx src/components/ui/TimelineCard.tsx src/components/sections/AboutSection.tsx src/components/sections/GallerySection.tsx
git commit -m "feat: viewfinder HUD with focus brackets, shutter readout, frame counter"
```

---

### Task 7: Shutter transitions + auto section captures + film tray

**Files:**
- Create: `src/lib/shutterBus.ts`
- Create: `src/components/ui/ShutterEffect.tsx`
- Create: `src/components/ui/SectionCaptureObserver.tsx`
- Create: `src/components/ui/FilmTray.tsx`
- Modify: `src/app/page.tsx` (mount all three)
- Test: `src/lib/shutterBus.test.ts`

**Interfaces:**
- Consumes: `useRollStore`, `SECTION_CAPTURES`, `useCapabilities()`.
- Produces:
  - `fireShutter(): void`, `onShutter(listener: () => void): () => void` (unsubscribe).
  - `<ShutterEffect />` — plays iris-wipe + white flash on every shutter event (skipped under reduced motion).
  - `<SectionCaptureObserver />` — auto-captures each section when it crosses the viewport middle band; fires the shutter on new captures.
  - `<FilmTray />` — fixed bottom strip of captured thumbnails, `data-testid="film-tray"`.

- [ ] **Step 1: Write the failing test**

`src/lib/shutterBus.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { fireShutter, onShutter } from "./shutterBus";

describe("shutterBus", () => {
  it("notifies subscribers on fire", () => {
    const listener = vi.fn();
    const off = onShutter(listener);
    fireShutter();
    expect(listener).toHaveBeenCalledTimes(1);
    off();
  });

  it("stops notifying after unsubscribe", () => {
    const listener = vi.fn();
    const off = onShutter(listener);
    off();
    fireShutter();
    expect(listener).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/shutterBus.test.ts`
Expected: FAIL — cannot resolve `./shutterBus`.

- [ ] **Step 3: Implement src/lib/shutterBus.ts**

```ts
type Listener = () => void;

const listeners = new Set<Listener>();

export function onShutter(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function fireShutter(): void {
  listeners.forEach((l) => l());
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/shutterBus.test.ts`
Expected: 2 passed.

- [ ] **Step 5: Implement ShutterEffect**

`src/components/ui/ShutterEffect.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { onShutter } from "@/lib/shutterBus";
import { useCapabilities } from "@/contexts/CapabilitiesContext";

const BLADES = 6;

export function ShutterEffect() {
  const caps = useCapabilities();
  const rootRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (caps?.reducedMotion) return;
    const root = rootRef.current;
    const flash = flashRef.current;
    if (!root || !flash) return;
    const blades = Array.from(root.querySelectorAll<HTMLElement>("[data-blade]"));

    return onShutter(() => {
      gsap
        .timeline()
        .set(root, { display: "block" })
        .to(blades, { scale: 1, duration: 0.12, ease: "power3.in", stagger: 0.008 })
        .set(flash, { opacity: 1 })
        .to(flash, { opacity: 0, duration: 0.18, ease: "power1.out" })
        .to(blades, { scale: 0, duration: 0.22, ease: "power3.out", stagger: 0.008 }, "<")
        .set(root, { display: "none" });
    });
  }, [caps]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] pointer-events-none hidden"
      aria-hidden="true"
      data-testid="shutter-effect"
    >
      {/* Iris blades: wedges rotated around center, scale 0 -> 1 to close */}
      {Array.from({ length: BLADES }).map((_, i) => (
        <div
          key={i}
          data-blade
          className="absolute left-1/2 top-1/2 w-[160vmax] h-[160vmax] bg-vintage-darkroom origin-top-left scale-0"
          style={{
            transform: `rotate(${(360 / BLADES) * i}deg)`,
            clipPath: "polygon(0 0, 100% 0, 0 62%)",
          }}
        />
      ))}
      <div ref={flashRef} className="absolute inset-0 bg-white opacity-0" />
    </div>
  );
}
```

- [ ] **Step 6: Implement SectionCaptureObserver**

`src/components/ui/SectionCaptureObserver.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useRollStore } from "@/stores/rollStore";
import { SECTION_CAPTURES } from "@/lib/frames";
import { fireShutter } from "@/lib/shutterBus";

export function SectionCaptureObserver() {
  const capture = useRollStore((s) => s.capture);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const point = SECTION_CAPTURES.find((c) => c.sectionId === entry.target.id);
          if (point && capture(point)) {
            fireShutter();
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    SECTION_CAPTURES.forEach((c) => {
      const el = document.getElementById(c.sectionId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [capture]);

  return null;
}
```

- [ ] **Step 7: Implement FilmTray**

`src/components/ui/FilmTray.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useHero } from "@/contexts/HeroContext";
import { useRollStore } from "@/stores/rollStore";

export function FilmTray() {
  const { isHeroVisible } = useHero();
  const captures = useRollStore((s) => s.captures);
  const trayRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(0);

  // Animate the newest frame flying into the tray
  useEffect(() => {
    if (captures.length > prevCount.current && trayRef.current) {
      const cells = trayRef.current.querySelectorAll("[data-tray-frame]");
      const newest = cells[cells.length - 1];
      if (newest) {
        gsap.fromTo(
          newest,
          { y: -40, scale: 1.8, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
        );
      }
    }
    prevCount.current = captures.length;
  }, [captures.length]);

  return (
    <div
      ref={trayRef}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex gap-1 px-3 py-1.5 bg-vintage-darkroom/85 rounded-sm border border-vintage-brass/20 transition-opacity duration-500"
      style={{ opacity: isHeroVisible || captures.length === 0 ? 0 : 1 }}
      aria-hidden="true"
      data-testid="film-tray"
    >
      {captures.map((c) => (
        <div
          key={c.frameId}
          data-tray-frame
          className="relative w-10 h-7 border border-vintage-brass/30 overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.thumbnailSrc} alt="" className="w-full h-full object-cover sepia-[.3]" />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 8: Mount in page.tsx**

In `src/app/page.tsx` add inside `<main>` next to the HUD:

```tsx
import { ShutterEffect } from "@/components/ui/ShutterEffect";
import { SectionCaptureObserver } from "@/components/ui/SectionCaptureObserver";
import { FilmTray } from "@/components/ui/FilmTray";
```

```tsx
<main className="relative">
  <ViewfinderHUD />
  <ShutterEffect />
  <SectionCaptureObserver />
  <FilmTray />
  <HeroSection />
  ...
```

- [ ] **Step 9: Verify**

Run: `npm run dev`, scroll the full page.
Expected: entering each section fires an iris-blade close + white flash + reopen; a thumbnail drops into the bottom tray; `FRM` counter increments; frames never duplicate when scrolling back up. With reduced motion emulated: no flash, but tray/counter still update.

Run: `npx tsc --noEmit && npx vitest run`
Expected: both pass.

- [ ] **Step 10: Commit**

```bash
git add src/lib/shutterBus.ts src/lib/shutterBus.test.ts src/components/ui/ShutterEffect.tsx src/components/ui/SectionCaptureObserver.tsx src/components/ui/FilmTray.tsx src/app/page.tsx
git commit -m "feat: shutter transitions, auto section captures, film tray"
```

---

### Task 8: Rack focus (depth-of-field between sections)

**Files:**
- Create: `src/components/ui/RackFocus.tsx`
- Modify: `src/app/globals.css` (rack styles)
- Modify: `src/app/page.tsx` (mount)

**Interfaces:**
- Consumes: `useCapabilities()`, section ids.
- Produces: `<RackFocus />` — adds `rack-enabled` to `<main>` and toggles `is-focused` on the section in the viewport middle band. High tier + no reduced motion only.

- [ ] **Step 1: Add CSS to globals.css**

Append to `src/app/globals.css`:

```css
/* Rack focus: out-of-focus sections sit under a slight blur */
main.rack-enabled section[id]:not(#hero) {
  filter: blur(5px) brightness(0.97);
  transition: filter 0.7s ease;
}

main.rack-enabled section[id].is-focused {
  filter: none;
}
```

- [ ] **Step 2: Implement RackFocus**

`src/components/ui/RackFocus.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useCapabilities } from "@/contexts/CapabilitiesContext";

export function RackFocus() {
  const caps = useCapabilities();

  useEffect(() => {
    if (!caps || caps.tier !== "high" || caps.reducedMotion) return;

    const main = document.querySelector("main");
    if (!main) return;
    main.classList.add("rack-enabled");

    const sections = Array.from(main.querySelectorAll<HTMLElement>("section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-focused", entry.isIntersecting);
        }
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
      main.classList.remove("rack-enabled");
      sections.forEach((s) => s.classList.remove("is-focused"));
    };
  }, [caps]);

  return null;
}
```

- [ ] **Step 3: Mount in page.tsx**

```tsx
import { RackFocus } from "@/components/ui/RackFocus";
```

Add `<RackFocus />` next to `<SectionCaptureObserver />`.

- [ ] **Step 4: Verify (pin regression check)**

Run: `npm run dev`.
Expected: sections entering the middle of the viewport rack into focus; adjacent ones blur slightly. **Critical check:** the Projects section's pinned horizontal film-strip scroll still works (CSS `filter` creates a containing block; the pin uses transforms so it should survive). If the pin breaks, move the blur to the section's direct child wrapper instead of the section:

```css
main.rack-enabled section[id]:not(#hero) > * { filter: blur(5px); transition: filter 0.7s ease; }
main.rack-enabled section[id].is-focused > * { filter: none; }
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/RackFocus.tsx src/app/globals.css src/app/page.tsx
git commit -m "feat: rack-focus blur between sections"
```

---

### Task 9: Act 1 — lens dive (scroll into the camera)

**Files:**
- Modify: `src/components/three/CameraModel.tsx` (dive camera path)
- Modify: `src/components/three/SceneCanvas.tsx` (dive prop, visibility)
- Modify: `src/components/ui/HeroOverlay.tsx` (own fade curve)
- Create: `src/components/ui/LensDiveOverlay.tsx`
- Modify: `src/components/sections/HeroSection.tsx` (mount overlay; keep fade only for non-dive path)

**Interfaces:**
- Consumes: `useHero()` (`scrollProgress`, `isHeroVisible`), `useCapabilities()`.
- Produces: `<LensDiveOverlay />`; `SceneCanvas`/`CameraModel` accept `dive: boolean`. Dive is enabled when `tier === "high" && webgl && !reducedMotion`; otherwise the existing opacity-fade behavior is preserved.

- [ ] **Step 1: Add dive camera motion to CameraModel**

In `src/components/three/CameraModel.tsx`, add a `dive` prop and camera push-in. Change the component signature and `useFrame`:

```tsx
export function CameraModel({ dive = false }: { dive?: boolean }) {
```

Inside `useFrame((state) => { ... })`, after the existing rotation code, add:

```tsx
    // Lens dive: from 50% scroll, push the viewport camera into the lens
    if (dive) {
      const p = Math.min(Math.max((scrollProgress - 0.5) / 0.45, 0), 1);
      const eased = p * p * p; // easeInCubic — accelerates into the glass
      state.camera.position.z = 6 - 5.1 * eased; // 6 -> 0.9
      state.camera.position.y = -0.5 * eased * 0.4;
      state.camera.updateProjectionMatrix();
    }
```

And guard the existing opacity-fade block so the model does NOT fade in dive mode (replace `material.opacity = cameraOpacity;` logic):

```tsx
    const targetOpacity = dive ? 1 : cameraOpacity;
    scene.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        const material = child.material as MeshStandardMaterial;
        if (material.transparent !== (targetOpacity < 1)) {
          material.transparent = targetOpacity < 1;
          material.needsUpdate = true;
        }
        material.opacity = targetOpacity;
      }
    });
```

- [ ] **Step 2: Thread dive through SceneCanvas**

In `src/components/three/SceneCanvas.tsx`:

```tsx
import { useCapabilities } from "@/contexts/CapabilitiesContext";
```

Inside `SceneCanvas`, derive dive and change the wrapper (the R3F tree can't read outside context, so pass a prop):

```tsx
export function SceneCanvas({ className = "" }: SceneCanvasProps) {
  const { cameraOpacity, isHeroVisible } = useHero();
  const caps = useCapabilities();
  const dive = !!caps && caps.webgl && caps.tier === "high" && !caps.reducedMotion;

  // In dive mode the canvas stays fully opaque and simply unmounts from view
  // once the hero ends (the LensDiveOverlay covers the transition).
  const style = dive
    ? { opacity: isHeroVisible ? 1 : 0, pointerEvents: (isHeroVisible ? "auto" : "none") as const }
    : {
        opacity: cameraOpacity,
        transition: "opacity 0.1s ease-out",
        pointerEvents: (cameraOpacity > 0.1 ? "auto" : "none") as const,
      };

  return (
    <div className={`fixed inset-0 w-full h-screen ${className}`} style={style}>
      <Canvas ...>  {/* unchanged */}
        ...
        <SceneContent dive={dive} />
        ...
```

Update `SceneContent` to accept and forward the prop:

```tsx
function SceneContent({ dive }: { dive: boolean }) {
  ...
  return (
    <>
      <Lights />
      <CameraModel dive={dive} />
    </>
  );
}
```

- [ ] **Step 3: Create LensDiveOverlay**

`src/components/ui/LensDiveOverlay.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useHero } from "@/contexts/HeroContext";
import { useCapabilities } from "@/contexts/CapabilitiesContext";

/**
 * Black overlay that closes in as the viewport dives into the lens,
 * then iris-opens to reveal Act 2.
 */
export function LensDiveOverlay() {
  const { scrollProgress, isHeroVisible } = useHero();
  const caps = useCapabilities();
  const overlayRef = useRef<HTMLDivElement>(null);
  const wasHeroVisible = useRef(true);

  const enabled = !!caps && caps.webgl && caps.tier === "high" && !caps.reducedMotion;

  // Darken as we approach the glass (55% -> 90% of hero scroll)
  useEffect(() => {
    if (!enabled || !overlayRef.current || !isHeroVisible) return;
    const p = Math.min(Math.max((scrollProgress - 0.55) / 0.35, 0), 1);
    gsap.set(overlayRef.current, { opacity: p, clipPath: "none", display: p > 0 ? "block" : "none" });
  }, [scrollProgress, isHeroVisible, enabled]);

  // Iris-open when the hero ends; iris-close when scrolling back in
  useEffect(() => {
    if (!enabled || !overlayRef.current) return;
    const overlay = overlayRef.current;

    if (wasHeroVisible.current && !isHeroVisible) {
      // leaving hero: overlay is near-black -> iris-open reveal
      gsap
        .timeline()
        .set(overlay, { display: "block", opacity: 1, clipPath: "circle(75% at 50% 50%)" })
        .to(overlay, { clipPath: "circle(0% at 50% 50%)", duration: 0.9, ease: "power3.inOut" })
        .set(overlay, { display: "none", clipPath: "none" });
    }
    wasHeroVisible.current = isHeroVisible;
  }, [isHeroVisible, enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[55] bg-black pointer-events-none hidden"
      aria-hidden="true"
      data-testid="lens-dive-overlay"
    />
  );
}
```

- [ ] **Step 4: Mount and adjust HeroOverlay fade**

In `src/components/sections/HeroSection.tsx`, import and render `<LensDiveOverlay />` next to `<HeroOverlay />`:

```tsx
import { LensDiveOverlay } from "@/components/ui/LensDiveOverlay";
```

```tsx
<SceneCanvas />
<HeroOverlay />
<LensDiveOverlay />
```

In `src/components/ui/HeroOverlay.tsx`, the text currently fades with `cameraOpacity` (which stays 1 in dive mode). Make it fade on scroll instead. Add `scrollProgress` to the destructure and replace the wrapper style:

```tsx
const { isModelLoaded, cameraOpacity, scrollProgress } = useHero();
const textFade = Math.min(cameraOpacity, 1 - Math.min(Math.max((scrollProgress - 0.15) / 0.3, 0), 1));
```

```tsx
style={{
  opacity: textFade,
  transition: "opacity 0.1s ease-out",
}}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`.
Expected (desktop, high tier): scrolling the hero first rotates the camera, then dives toward the lens; the screen darkens, and at the hero boundary a black iris opens onto the About section. Scrolling back up re-enters the hero. With reduced motion or low tier: old fade behavior, no dive.

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/three/CameraModel.tsx src/components/three/SceneCanvas.tsx src/components/ui/HeroOverlay.tsx src/components/ui/LensDiveOverlay.tsx src/components/sections/HeroSection.tsx
git commit -m "feat: lens dive - scroll into the camera with iris-open reveal"
```

---

### Task 10: Act 0 — film-leader loading screen

**Files:**
- Modify: `src/components/ui/LoadingScreen.tsx` (full rewrite)

**Interfaces:**
- Consumes: `useHero()` (`isModelLoaded`), `useCapabilities()`.
- Produces: same component name/usage — countdown 8→3 film leader, then sprocket feed, then fade. Dismisses only when countdown finished AND model loaded. Reduced motion: simple fade (current behavior).

- [ ] **Step 1: Rewrite LoadingScreen.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useHero } from "@/contexts/HeroContext";
import { useCapabilities } from "@/contexts/CapabilitiesContext";

const COUNTDOWN_START = 8;
const COUNTDOWN_END = 3;
const TICK_MS = 350;

type Phase = "countdown" | "feed" | "done";

export function LoadingScreen() {
  const { isModelLoaded } = useHero();
  const caps = useCapabilities();
  const [count, setCount] = useState(COUNTDOWN_START);
  const [phase, setPhase] = useState<Phase>("countdown");
  const [isFading, setIsFading] = useState(false);

  const reduced = caps?.reducedMotion ?? false;

  // Countdown ticks regardless of load state (min display time)
  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= COUNTDOWN_END) return;
    const t = setTimeout(() => setCount((c) => c - 1), TICK_MS);
    return () => clearTimeout(t);
  }, [count, phase]);

  // Advance to feed when countdown done AND model loaded
  useEffect(() => {
    if (phase === "countdown" && count <= COUNTDOWN_END && isModelLoaded) {
      setPhase("feed");
      const t = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => setPhase("done"), 700);
      }, 650);
      return () => clearTimeout(t);
    }
  }, [count, phase, isModelLoaded]);

  if (phase === "done") return null;

  // Reduced motion: plain fade, no theatrics
  if (reduced) {
    return (
      <div
        className={`fixed inset-0 z-[80] flex items-center justify-center bg-vintage-cream transition-opacity duration-700 ${
          isModelLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <p className="font-display text-xl text-vintage-dark-brown">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "#141210" }}
      data-testid="film-leader"
    >
      {/* Rotating clock-wipe behind the numeral */}
      <div
        className="absolute w-[140vmax] h-[140vmax] rounded-full opacity-20 animate-spin"
        style={{
          animationDuration: `${TICK_MS * 2}ms`,
          background:
            "conic-gradient(rgba(253,251,247,0.55) 0deg 20deg, transparent 20deg 360deg)",
        }}
      />

      {/* Crosshair circle */}
      <div className="absolute w-64 h-64 rounded-full border border-vintage-cream/25" />
      <div className="absolute w-px h-full bg-vintage-cream/15" />
      <div className="absolute h-px w-full bg-vintage-cream/15" />

      {/* Scratches */}
      <div className="absolute left-[22%] top-0 w-px h-full bg-vintage-cream/10" />
      <div className="absolute left-[71%] top-0 w-px h-full bg-vintage-cream/[0.07]" />

      {phase === "countdown" ? (
        <span
          key={count}
          className="relative font-display text-[9rem] leading-none text-vintage-cream animate-fade-in"
        >
          {count}
        </span>
      ) : (
        /* Sprocket feed: strip of holes slides across */
        <div className="relative w-full overflow-hidden" data-testid="sprocket-feed">
          <div className="flex gap-6 animate-slide-in-right">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-5 h-8 shrink-0 rounded-sm bg-vintage-cream/20" />
            ))}
          </div>
        </div>
      )}

      <p className="absolute bottom-10 font-mono text-xs tracking-[0.3em] text-vintage-cream/40">
        LOADING ROLL · SMIT PATEL · TORONTO
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev` (hard reload with cache disabled to see it).
Expected: dark leader with countdown 8→3, rotating wipe, scratch lines; then a sprocket strip feeds through; then fade into the hero. With reduced motion: plain "Loading…" fade. The screen never dismisses before the GLB is loaded.

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/LoadingScreen.tsx
git commit -m "feat: film-leader countdown loading screen with sprocket feed"
```

---

### Task 11: Projects — negative-to-positive develop + EXIF card back

**Files:**
- Modify: `src/components/ui/FilmFrame.tsx`

**Interfaces:**
- Consumes: `useRollStore().capture`, `fireShutter()`, `Project` type.
- Produces: film frames render as orange-base negatives at rest, develop to positive on hover, and flip to a fake-EXIF back on click. Clicking also captures frame `proj-<project.id>` (section `projects`, label = project title lowercased, thumbnail = project image).

- [ ] **Step 1: Add negative filter + flip + capture to FilmFrame**

In `src/components/ui/FilmFrame.tsx`:

Add imports and state:

```tsx
import { useRollStore } from "@/stores/rollStore";
import { fireShutter } from "@/lib/shutterBus";
```

```tsx
const [isFlipped, setIsFlipped] = useState(false);
const capture = useRollStore((s) => s.capture);

const handleClick = () => {
  setIsFlipped((f) => !f);
  const isNew = capture({
    frameId: `proj-${project.id}`,
    sectionId: "projects",
    label: project.title.toLowerCase(),
    thumbnailSrc: project.imageUrl,
  });
  if (isNew) fireShutter();
};
```

Add `onClick={handleClick}` and `style={{ perspective: "1200px" }}` to the root div, plus `cursor-pointer`.

Wrap the existing `bg-vintage-darkroom` frame div in a 3D flipper. Structure becomes:

```tsx
<div /* root: film-frame-container, data-focusable, onClick, perspective */>
  <div
    className="relative transition-transform duration-500 [transform-style:preserve-3d]"
    style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
  >
    {/* FRONT: existing frame div, add [backface-visibility:hidden] to its className */}
    <div className="relative bg-vintage-darkroom rounded-sm overflow-hidden [backface-visibility:hidden]">
      ... existing sprockets + image + overlay ...
    </div>

    {/* BACK: EXIF panel */}
    <div
      className="absolute inset-0 bg-vintage-darkroom rounded-sm p-8 flex flex-col justify-center gap-3 [backface-visibility:hidden]"
      style={{ transform: "rotateY(180deg)" }}
    >
      <p className="font-mono text-xs tracking-widest text-vintage-brass/70">
        FRM {String(index + 1).padStart(2, "0")} · f/2.8 · 1/250 · ISO 400
      </p>
      <h3 className="font-display text-2xl text-vintage-cream">{project.title}</h3>
      <p className="font-mono text-xs text-vintage-cream/70">YEAR&nbsp;&nbsp;{project.year}</p>
      <p className="font-mono text-xs text-vintage-cream/70">
        LENS&nbsp;&nbsp;{project.techStack.join(" · ")}
      </p>
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-xs text-vintage-sepia hover:text-vintage-cream transition-colors"
        >
          LOC&nbsp;&nbsp;&nbsp;{project.githubUrl.replace("https://", "")}
        </a>
      )}
      <p className="font-handwritten text-lg text-vintage-brass/80 mt-2">{project.description}</p>
    </div>
  </div>
</div>
```

Change the `<Image>` className to render as a negative at rest and develop on hover (replace the existing `brightness-50/scale` conditional):

```tsx
className={`
  object-cover transition-all duration-700 ease-out
  ${isHovered
    ? "scale-105 [filter:none]"
    : "scale-100 [filter:invert(1)_hue-rotate(180deg)_sepia(0.35)_contrast(0.85)_brightness(0.9)]"}
`}
```

And add an orange base-cast overlay directly after the `<Image>` (before the grain overlay):

```tsx
{/* Negative orange base — fades away as the frame develops */}
<div
  className={`absolute inset-0 pointer-events-none mix-blend-multiply transition-opacity duration-700 ${
    isHovered ? "opacity-0" : "opacity-60"
  }`}
  style={{ backgroundColor: "#e8842f" }}
/>
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, scroll to Projects.
Expected: frames sit as orange negatives; hovering develops them to full color and slides up the details overlay; clicking flips to the EXIF back (readable, links work) and fires the shutter + adds a tray frame once per project; clicking again flips back.

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/FilmFrame.tsx
git commit -m "feat: project frames develop from negative and flip to EXIF back"
```

---

### Task 12: Act 3 — darkroom WebGL gallery with develop-on-hover shader

**Files:**
- Create: `src/components/ui/GalleryCarousel.tsx` (extract existing DOM carousel)
- Create: `src/components/three/DarkroomGallery.tsx`
- Modify: `src/components/sections/GallerySection.tsx` (branch by tier)

**Interfaces:**
- Consumes: `Photo` type, `useCapabilities()`, `useRollStore().capture`, `fireShutter()`.
- Produces:
  - `<GalleryCarousel photos={Photo[]} />` — the current DOM carousel, verbatim, as the low-tier path.
  - `<DarkroomGallery photos={Photo[]} />` — R3F scene: prints on a hanging line under safelight tint; hover develops a print (shader `uDevelop` 0→1 over 2s); full development captures frame `photo-<id>`.

- [ ] **Step 1: Extract GalleryCarousel**

Create `src/components/ui/GalleryCarousel.tsx` and move everything from `GallerySection.tsx`'s carousel block into it — the `carouselRef` div through the navigation arrows, plus `scrollToPhoto`, `handleScroll`, `activeIndex` state, and `photoRefs`. Signature:

```tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Photo } from "@/types";

interface GalleryCarouselProps {
  photos: Photo[];
}

export function GalleryCarousel({ photos }: GalleryCarouselProps) {
  // ... moved code, using `photos` instead of module-level galleryPhotos ...
}
```

(The GSAP photo-reveal stagger stays in `GallerySection` — it targets `.gallery-photo-card`, which still exists in the carousel.)

- [ ] **Step 2: Implement DarkroomGallery**

`src/components/three/DarkroomGallery.tsx`:

```tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import { Group, ShaderMaterial } from "three";
import { gsap } from "gsap";
import { Photo } from "@/types";
import { useRollStore } from "@/stores/rollStore";
import { fireShutter } from "@/lib/shutterBus";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uDevelop;
  uniform float uRed;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec4 img = texture2D(uTex, vUv);

    // Development spreads from the center, broken up by noise —
    // like developer chemicals working across the paper.
    float n = hash(floor(vUv * 90.0)) * 0.35;
    float spread = 1.0 - distance(vUv, vec2(0.5)) * 0.9;
    float reveal = smoothstep(uDevelop - 0.25, uDevelop + 0.05, 1.0 - (spread - n));

    vec3 paper = vec3(0.93, 0.90, 0.84); // blank photo paper
    float luma = dot(img.rgb, vec3(0.299, 0.587, 0.114));
    vec3 sepia = vec3(luma) * vec3(1.15, 1.0, 0.8);
    // Tones arrive first as sepia, then full color
    vec3 developed = mix(sepia, img.rgb, smoothstep(0.5, 1.0, uDevelop));
    vec3 color = mix(paper, developed, 1.0 - reveal);

    // Safelight: warm red cast that lifts as the print develops
    vec3 safelight = mix(vec3(1.0), vec3(1.0, 0.45, 0.38), uRed * (1.0 - uDevelop * 0.6));
    gl_FragColor = vec4(color * safelight, 1.0);
  }
`;

interface PrintProps {
  photo: Photo;
  position: [number, number, number];
  rotation: number;
}

function PhotoPrint({ photo, position, rotation }: PrintProps) {
  const texture = useTexture(photo.src);
  const materialRef = useRef<ShaderMaterial>(null);
  const developed = useRef(false);
  const capture = useRollStore((s) => s.capture);

  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uDevelop: { value: 0 },
      uRed: { value: 0.5 },
    }),
    [texture]
  );

  const develop = () => {
    if (developed.current || !materialRef.current) return;
    developed.current = true;
    gsap.to(materialRef.current.uniforms.uDevelop, {
      value: 1,
      duration: 2.2,
      ease: "power1.inOut",
      onComplete: () => {
        const isNew = capture({
          frameId: `photo-${photo.id}`,
          sectionId: "gallery",
          label: (photo.caption ?? "print").toLowerCase(),
          thumbnailSrc: photo.src,
        });
        if (isNew) fireShutter();
      },
    });
  };

  return (
    <group position={position} rotation={[0, 0, rotation]}>
      {/* Clip line to print */}
      <mesh position={[0, 1.45, -0.01]}>
        <planeGeometry args={[0.06, 0.5]} />
        <meshBasicMaterial color="#3a2f26" />
      </mesh>
      <mesh onPointerOver={develop} onClick={develop}>
        <planeGeometry args={[2.6, 1.95]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <Html center position={[0, -1.35, 0]} zIndexRange={[10, 0]}>
        <div className="text-center pointer-events-none w-48">
          <p className="font-handwritten text-lg text-vintage-cream/90 leading-tight">
            {photo.caption}
          </p>
          <p className="font-body text-[10px] text-vintage-cream/50">{photo.location}</p>
        </div>
      </Html>
    </group>
  );
}

function HangingLine({ width }: { width: number }) {
  return (
    <mesh position={[0, 1.7, -0.02]}>
      <planeGeometry args={[width, 0.015]} />
      <meshBasicMaterial color="#5a4a3a" />
    </mesh>
  );
}

interface DarkroomGalleryProps {
  photos: Photo[];
}

const SPACING = 3.1;

export function DarkroomGallery({ photos }: DarkroomGalleryProps) {
  const groupRef = useRef<Group>(null);
  const targetX = useRef(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ pointerX: 0, groupX: 0 });

  const maxPan = Math.max(0, (photos.length - 1) * SPACING - 6);

  return (
    <div
      className="relative h-[70vh] w-full cursor-grab active:cursor-grabbing"
      data-testid="darkroom-gallery"
      onPointerDown={(e) => {
        setDragging(true);
        dragStart.current = { pointerX: e.clientX, groupX: targetX.current };
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        const dx = (e.clientX - dragStart.current.pointerX) * 0.012;
        targetX.current = Math.min(0, Math.max(-maxPan, dragStart.current.groupX + dx));
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.9} color="#ff6b5a" />
        <Pannable groupRef={groupRef} targetX={targetX} />
        <group ref={groupRef} position={[2.5, 0, 0]}>
          <HangingLine width={photos.length * SPACING + 2} />
          {photos.map((photo, i) => (
            <PhotoPrint
              key={photo.id}
              photo={photo}
              position={[i * SPACING - ((photos.length - 1) * SPACING) / 2, 0, 0]}
              rotation={(i % 2 === 0 ? 1 : -1) * 0.02}
            />
          ))}
        </group>
      </Canvas>
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-vintage-cream/40">
        DRAG TO PAN · HOVER TO DEVELOP
      </p>
    </div>
  );
}

/** Lerps the print group toward the drag target each frame. */
function Pannable({
  groupRef,
  targetX,
}: {
  groupRef: React.RefObject<Group>;
  targetX: React.MutableRefObject<number>;
}) {
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x += (targetX.current + 2.5 - groupRef.current.position.x) * 0.08;
  });
  return null;
}
```

- [ ] **Step 3: Branch in GallerySection**

In `src/components/sections/GallerySection.tsx`:

```tsx
import { useCapabilities } from "@/contexts/CapabilitiesContext";
import { GalleryCarousel } from "@/components/ui/GalleryCarousel";
import { DarkroomGallery } from "@/components/three/DarkroomGallery";
```

Replace the carousel block (now extracted) with:

```tsx
{caps && caps.webgl && caps.tier === "high" ? (
  <DarkroomGallery photos={galleryPhotos} />
) : (
  <GalleryCarousel photos={galleryPhotos} />
)}
```

where `const caps = useCapabilities();` is added at the top of the component. Keep the header, vignette overlay, grain, background transition, and red accent line unchanged. Remove the now-unused `photoRefs`/`activeIndex`/`carouselInnerRef` code and the photo-reveal GSAP block if the carousel moved it (keep whichever ref the remaining GSAP still targets — `carouselRef` stays on the wrapper div around the branch).

- [ ] **Step 4: Verify**

Run: `npm run dev`, scroll to the gallery (high-tier desktop).
Expected: dark background, prints hang from a line as blank paper with a red cast; hovering a print develops it over ~2s (noise-edged reveal, sepia → color) and fires the shutter + tray frame once; dragging pans the line; captions show under each print. In devtools responsive/mobile mode (coarse pointer → low tier): the old DOM carousel renders instead.

Run: `npx tsc --noEmit && npx vitest run`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/GalleryCarousel.tsx src/components/three/DarkroomGallery.tsx src/components/sections/GallerySection.tsx
git commit -m "feat: darkroom gallery - prints develop on hover under safelight"
```

---

### Task 13: Epilogue — contact sheet + PNG export

**Files:**
- Create: `src/lib/contactSheet.ts`
- Create: `src/components/sections/ContactSheetSection.tsx`
- Modify: `src/app/page.tsx` (insert section)
- Test: `src/lib/contactSheet.test.ts` (annotation logic only; canvas drawing is covered by e2e)

**Interfaces:**
- Consumes: `useRollStore`, `FRAME_TOTAL`.
- Produces:
  - `annotate(captures: RollFrame[]): string[]` — one annotation per capture: `` `frame N — <label> · MM:SS` ``, appending `" · lingered here"` to the capture with the longest dwell (gap to the next capture, last frame excluded) when that dwell exceeds 30s.
  - `<ContactSheetSection />` — `#roll` section rendering the visitor's captures as a contact sheet grid (`data-testid="contact-frame"` per cell, each an anchor to its section) with a "Download your roll" button that exports a PNG via canvas.

- [ ] **Step 1: Write the failing test**

`src/lib/contactSheet.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { annotate } from "./contactSheet";
import type { RollFrame } from "@/stores/rollStore";

const frame = (id: string, label: string, at: number): RollFrame => ({
  frameId: id,
  sectionId: "about",
  label,
  thumbnailSrc: "/x.png",
  capturedAt: at,
});

describe("annotate", () => {
  it("formats frame number, label, and MM:SS timestamp", () => {
    const out = annotate([frame("a", "the camera", 5_000)]);
    expect(out).toEqual(["frame 1 — the camera · 00:05"]);
  });

  it("marks the longest dwell over 30s as lingered", () => {
    const out = annotate([
      frame("a", "one", 0),
      frame("b", "two", 10_000), // dwell on a: 10s
      frame("c", "three", 55_000), // dwell on b: 45s <- lingered
    ]);
    expect(out[1]).toContain("lingered here");
    expect(out[0]).not.toContain("lingered");
    expect(out[2]).not.toContain("lingered");
  });

  it("adds no lingered mark when all dwells are short", () => {
    const out = annotate([frame("a", "one", 0), frame("b", "two", 5_000)]);
    expect(out.join("")).not.toContain("lingered");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/contactSheet.test.ts`
Expected: FAIL — cannot resolve `./contactSheet`.

- [ ] **Step 3: Implement src/lib/contactSheet.ts**

```ts
import type { RollFrame } from "@/stores/rollStore";

function mmss(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const LINGER_THRESHOLD_MS = 30_000;

/** One handwritten-style annotation per captured frame. */
export function annotate(captures: RollFrame[]): string[] {
  let lingerIndex = -1;
  let longestDwell = LINGER_THRESHOLD_MS;
  for (let i = 0; i < captures.length - 1; i++) {
    const dwell = captures[i + 1].capturedAt - captures[i].capturedAt;
    if (dwell > longestDwell) {
      longestDwell = dwell;
      lingerIndex = i;
    }
  }

  return captures.map((c, i) => {
    const base = `frame ${i + 1} — ${c.label} · ${mmss(c.capturedAt)}`;
    return i === lingerIndex ? `${base} · lingered here` : base;
  });
}

const CELL = 280;
const CELL_H = 260;
const COLS = 4;
const PAD = 40;

/** Draws the contact sheet onto a canvas and resolves to a PNG blob. */
export async function renderContactSheet(
  captures: RollFrame[],
  annotations: string[]
): Promise<Blob> {
  const rows = Math.max(1, Math.ceil(captures.length / COLS));
  const canvas = document.createElement("canvas");
  canvas.width = PAD * 2 + COLS * CELL;
  canvas.height = PAD * 2 + 60 + rows * CELL_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");

  ctx.fillStyle = "#141210";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(253,251,247,0.85)";
  ctx.font = "24px var(--font-handwritten), cursive";
  ctx.fillText("shot on smitpatel.xyz — one roll, developed", PAD, PAD + 10);

  const images = await Promise.all(
    captures.map(
      (c) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = c.thumbnailSrc;
        })
    )
  );

  images.forEach((img, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * CELL;
    const y = PAD + 60 + row * CELL_H;
    ctx.fillStyle = "#000";
    ctx.fillRect(x + 10, y, CELL - 20, CELL_H - 70);
    ctx.drawImage(img, x + 16, y + 6, CELL - 32, CELL_H - 82);
    ctx.fillStyle = "rgba(253,251,247,0.7)";
    ctx.font = "14px var(--font-handwritten), cursive";
    ctx.fillText(annotations[i] ?? "", x + 12, y + CELL_H - 44, CELL - 24);
  });

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/contactSheet.test.ts`
Expected: 3 passed.

- [ ] **Step 5: Implement ContactSheetSection**

`src/components/sections/ContactSheetSection.tsx`:

```tsx
"use client";

import { useRollStore } from "@/stores/rollStore";
import { FRAME_TOTAL } from "@/lib/frames";
import { annotate, renderContactSheet } from "@/lib/contactSheet";

export function ContactSheetSection() {
  const captures = useRollStore((s) => s.captures);
  const annotations = annotate(captures);

  const handleDownload = async () => {
    try {
      const blob = await renderContactSheet(captures, annotations);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "smitpatel-xyz-contact-sheet.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Image load/canvas failure should never break the page
    }
  };

  return (
    <section id="roll" className="relative py-20 md:py-32 bg-[#141210]">
      <div className="section-container">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-vintage-cream mb-3 text-center">
          Your Roll
        </h2>
        <p className="font-handwritten text-xl text-vintage-brass/80 text-center mb-12">
          you developed {captures.length} of {FRAME_TOTAL} frames on this visit
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {captures.map((c, i) => (
            <a
              key={c.frameId}
              href={`#${c.sectionId}`}
              data-testid="contact-frame"
              data-focusable
              className="group block bg-black p-2 border border-vintage-cream/10 hover:border-vintage-brass/50 transition-colors"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.thumbnailSrc}
                  alt={c.label}
                  className="w-full h-full object-cover sepia-[.25] group-hover:sepia-0 transition-all duration-500"
                />
              </div>
              <p className="font-handwritten text-sm text-vintage-cream/70 mt-2 leading-tight">
                {annotations[i]}
              </p>
            </a>
          ))}
        </div>

        {captures.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={handleDownload}
              className="px-6 py-3 font-mono text-xs tracking-[0.2em] text-vintage-cream border border-vintage-brass/50 hover:bg-vintage-brass/10 transition-colors"
            >
              DOWNLOAD YOUR ROLL ↓
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Insert into page.tsx**

In `src/app/page.tsx`, import and render between `GallerySection` and the webring div:

```tsx
import { ContactSheetSection } from "@/components/sections/ContactSheetSection";
```

```tsx
<GallerySection />
<ContactSheetSection />
{/* Canadian Webring Widget */}
...
```

- [ ] **Step 7: Verify**

Run: `npm run dev`, scroll the full page, then check the Your Roll section.
Expected: grid shows the frames you captured in order with handwritten annotations; timestamps look sane; one frame may say "lingered here"; frames link back to sections; the download button saves a PNG that opens and shows the sheet.

Run: `npx tsc --noEmit && npx vitest run`
Expected: both pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/contactSheet.ts src/lib/contactSheet.test.ts src/components/sections/ContactSheetSection.tsx src/app/page.tsx
git commit -m "feat: contact-sheet epilogue with per-visit roll and PNG export"
```

---

### Task 14: Audio — synthesized shutter/advance + HUD toggle

**Files:**
- Create: `src/lib/audio.ts`
- Create: `src/stores/audioStore.ts`
- Modify: `src/components/ui/ShutterEffect.tsx` (play on shutter)
- Modify: `src/components/ui/ViewfinderHUD.tsx` (SND toggle button)

**Interfaces:**
- Consumes: `onShutter` bus.
- Produces:
  - `playShutter(): void`, `playAdvance(): void` — WebAudio-synthesized clicks; no-ops until an AudioContext can start (first user gesture) or when disabled.
  - `useAudioStore`: `{ enabled: boolean; toggle(): void }`, default `enabled: false`.

- [ ] **Step 1: Implement src/stores/audioStore.ts**

```ts
import { create } from "zustand";

interface AudioState {
  enabled: boolean;
  toggle: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  enabled: false,
  toggle: () => set((s) => ({ enabled: !s.enabled })),
}));
```

- [ ] **Step 2: Implement src/lib/audio.ts**

```ts
import { useAudioStore } from "@/stores/audioStore";

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Short filtered noise burst — the leaf-shutter "snick". */
function noiseBurst(when: number, duration: number, gainValue: number, freq: number) {
  const audio = getContext();
  if (!audio) return;
  const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const source = audio.createBufferSource();
  source.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(gainValue, audio.currentTime + when);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + when + duration);

  source.connect(filter).connect(gain).connect(audio.destination);
  source.start(audio.currentTime + when);
}

export function playShutter(): void {
  if (!useAudioStore.getState().enabled) return;
  noiseBurst(0, 0.05, 0.25, 2400); // blade close
  noiseBurst(0.07, 0.04, 0.18, 1800); // blade open
}

export function playAdvance(): void {
  if (!useAudioStore.getState().enabled) return;
  noiseBurst(0, 0.03, 0.12, 900);
  noiseBurst(0.09, 0.03, 0.12, 1100);
}
```

- [ ] **Step 3: Play on shutter events**

In `src/components/ui/ShutterEffect.tsx`, import and call inside the `onShutter` callback, before the timeline:

```tsx
import { playShutter, playAdvance } from "@/lib/audio";
```

```tsx
return onShutter(() => {
  playShutter();
  setTimeout(playAdvance, 250);
  gsap.timeline()...
});
```

Note: the reduced-motion early-return in this component currently skips subscribing entirely; move the `caps?.reducedMotion` check so it only skips the *animation*, not the sound:

```tsx
return onShutter(() => {
  playShutter();
  setTimeout(playAdvance, 250);
  if (caps?.reducedMotion) return;
  gsap.timeline()...
});
```

(and remove the `if (caps?.reducedMotion) return;` at the top of the effect).

- [ ] **Step 4: Add SND toggle to the HUD**

In `src/components/ui/ViewfinderHUD.tsx`:

```tsx
import { useAudioStore } from "@/stores/audioStore";
```

```tsx
const audioEnabled = useAudioStore((s) => s.enabled);
const toggleAudio = useAudioStore((s) => s.toggle);
```

Add next to the frame counter (note `pointer-events-auto` — the HUD root is pointer-events-none):

```tsx
<button
  onClick={toggleAudio}
  className="absolute top-6 left-16 pointer-events-auto hover:text-vintage-brass transition-colors"
  aria-pressed={audioEnabled}
  aria-label="Toggle sound"
>
  SND {audioEnabled ? "●" : "○"}
</button>
```

- [ ] **Step 5: Verify**

Run: `npm run dev`.
Expected: silent by default; click `SND ○` in the top-left HUD → `SND ●`; scrolling into a new section now plays a shutter snick + film advance; toggling off silences. No console errors before the first gesture.

Run: `npx tsc --noEmit && npx vitest run`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/audio.ts src/stores/audioStore.ts src/components/ui/ShutterEffect.tsx src/components/ui/ViewfinderHUD.tsx
git commit -m "feat: synthesized shutter/advance audio with HUD toggle (muted by default)"
```

---

### Task 15: Fallbacks, e2e smoke suite, final pass

**Files:**
- Modify: `src/components/sections/HeroSection.tsx` (no-WebGL static fallback)
- Modify: `src/components/sections/ContactSection.tsx` (darkroom-notes intro)
- Create: `tests/e2e/smoke.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: everything above.
- Produces: green `npm run lint`, `npm run build`, `npm test`, `npm run test:e2e`.

- [ ] **Step 1: No-WebGL static hero fallback**

In `src/components/sections/HeroSection.tsx`:

```tsx
import { useCapabilities } from "@/contexts/CapabilitiesContext";
import { useEffect } from "react";
```

Inside the component:

```tsx
const caps = useCapabilities();
const noWebgl = !!caps && !caps.webgl;
const { setIsModelLoaded } = useHero(); // add to existing destructure

// Without WebGL there is no model load event — unblock the overlay text.
useEffect(() => {
  if (noWebgl) setIsModelLoaded(true);
}, [noWebgl, setIsModelLoaded]);
```

And in the JSX, render canvas + loader conditionally:

```tsx
{!noWebgl && <LoadingScreen />}
{!noWebgl && <SceneCanvas />}
<HeroOverlay />
{!noWebgl && <LensDiveOverlay />}
```

Also shorten the empty scroll runway when there's nothing to dive into — change the section className:

```tsx
className={`relative w-full ${noWebgl ? "h-screen" : "h-[150vh]"}`}
```

- [ ] **Step 2: Darkroom-notes intro on ContactSection**

In `src/components/sections/ContactSection.tsx`, insert directly above the section's existing heading (keep everything else):

```tsx
<p className="font-handwritten text-2xl text-vintage-brass/80 text-center mb-2">
  — darkroom notes —
</p>
<p className="font-handwritten text-lg text-vintage-cream/60 text-center mb-10 max-w-md mx-auto">
  if the roll came out good, write me. prints available on request.
</p>
```

(Adjust text color classes to match the section's actual background — if the section is cream, use `text-vintage-iron-gall/70` and `text-vintage-muted-umber` instead. Check the file when editing.)

- [ ] **Step 3: Write the e2e smoke suite**

`tests/e2e/smoke.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("full roll: scroll through, capture frames, export contact sheet", async ({ page }) => {
  await page.goto("/");

  // Loader eventually clears and the page is scrollable
  await expect(page.locator("#about")).toBeAttached();
  await page.waitForTimeout(4000); // film leader minimum display

  // Scroll to the bottom in steps so IntersectionObservers fire
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(120);
  }

  // Contact sheet shows at least the auto-captured sections
  await expect(page.locator("#roll")).toBeVisible();
  await expect
    .poll(async () => page.locator("[data-testid='contact-frame']").count(), {
      timeout: 15_000,
    })
    .toBeGreaterThanOrEqual(5);

  // PNG export produces a real download
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /download your roll/i }).click();
  const download = await downloadPromise;
  expect(await download.path()).toBeTruthy();
  expect(download.suggestedFilename()).toContain(".png");
});

test("all sections reachable and film tray records", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(4000);

  for (const id of ["about", "projects", "experience", "gallery", "contact"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  await expect(page.locator("[data-testid='film-tray'] [data-tray-frame]").first()).toBeAttached();
});
```

- [ ] **Step 4: Run the full verification suite**

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

Expected: all green. Known flake risk: the e2e scroll loop racing Lenis smooth scroll — if frame counts come up short, increase wheel steps or per-step timeout, don't weaken the ≥5 assertion.

- [ ] **Step 5: Update README**

Replace `README.md` ("website under construction") with:

```markdown
# smitpatel.xyz — Shot on Smit

Personal site structured as a roll of film: load the roll (film-leader loader),
shoot the site through a viewfinder (HUD, shutter transitions, rack focus,
lens dive), develop it in the darkroom (WebGL develop-on-hover prints), and
leave with a contact sheet of your visit (PNG export).

## Stack

Next.js 14 · React Three Fiber · GSAP ScrollTrigger · Lenis · Tailwind · Zustand

## Develop

    npm install
    npm run dev      # http://localhost:3000
    npm test         # unit (vitest)
    npm run test:e2e # smoke (playwright)

Design spec: `docs/superpowers/specs/2026-07-01-shot-on-smit-design.md`
```

- [ ] **Step 6: Manual QA checklist (do these, note results in the commit body)**

- Desktop Chrome: full journey, 60fps-ish scroll (devtools performance overlay)
- Reduced motion emulated: no flash/leaks/dive/rack-focus; captures + contact sheet still work
- Devtools mobile emulation (coarse pointer): DOM carousel gallery, no atmosphere overlay, no dive
- Scroll up/down repeatedly: no duplicate tray frames, no stuck shutter overlay

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: fallbacks, darkroom-notes contact intro, e2e smoke suite, README"
```

---

## Post-plan notes for the executor

- Section entry order in `page.tsx` after all tasks: `ViewfinderHUD`, `ShutterEffect`, `SectionCaptureObserver`, `FilmTray`, `RackFocus`, then `HeroSection` → `AboutSection` → `ProjectsSection` → `ExperienceSection` → `GallerySection` → `ContactSheetSection` → webring → `ContactSection`.
- z-index ladder: BackgroundLayer (0) < content < ViewfinderHUD/FilmTray (40) < AtmosphereOverlay (45) < LensDiveOverlay (55) < ShutterEffect (60) < ApertureCursor (70) < LoadingScreen (80).
- The `experience` section id must exist for capture/HUD — verify `ExperienceSection` renders `<section id="experience">`; if it doesn't, add the id to its root section element.
- If the Projects pin + rack-focus blur conflict (Task 8 Step 4), prefer fixing via the child-selector CSS variant rather than disabling rack focus.
