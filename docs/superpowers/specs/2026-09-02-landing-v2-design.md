# TAG Landing Page v2 — Awwwards-Worthy Redesign

**Goal:** Replace the current landing with a choreographed, magazine-cover scroll experience that earns its place next to Awwwards winners — single coherent design language, persistent custom cursor, film grain, kinetic typography, and a custom-cursor-driven interaction layer across the whole page.

**Architecture:** 8-section scroll narrative (preloader → hero → manifesto → pinned acts → horizontal pinned categories → marquee break → stats → CTA). Persistent overlay layer (custom cursor, film grain, scroll progress bar, section index counter) rendered above the main content. All animations via framer-motion. The 3D garment tag lives only in the hero, the shadergradient lives only in the hero. Every other section is pure 2D with custom CSS/SVG art for visual interest — no external images, no auth, no network calls.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, framer-motion 13, @react-three/fiber, @shadergradient/react, three.js

**Spec:** This document

## Global Constraints

- **No new dependencies.** Use only what's installed: framer-motion, @react-three/fiber, three, @shadergradient/react.
- **No external images.** Every visual element is CSS, SVG, or WebGL. Pinned-acts scenes use SVG illustrations.
- **3D only in hero.** No r3f outside the hero.
- **Custom cursor across whole site.** `mix-blend-difference` dot, spring-follows pointer, expands to ring with "VIEW" label on interactive elements. `cursor: none` on `html` so default OS cursor is hidden.
- **Persistent overlay layer:** scroll progress bar (1px acid green, top), section index (top-left, "01 / 08"), film grain (full-page SVG noise, 4% opacity, scroll-velocity reactive).
- **Palette:** Cream `#FFF8F0` + charcoal `#1A1A1A` + acid green `#A8FF3E` (sparingly, only on active state + scroll progress + hover accents). Tangerine `#FF6B35` only for hover rings.
- **Type:** Playfair Display 700 (headlines, italic for emphasis), IBM Plex Mono 400 (body), Space Mono 400 (labels, monospace UI).
- **Motion library:** framer-motion only. No GSAP, no Lenis, no drei.

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/components/landing/loader.tsx` | REWRITE | Counter preloader (00 → 100) with clipPath wipe reveal |
| `src/components/landing/hero.tsx` | REWRITE | Full-bleed editorial hero, no card, minimal CTA, scroll-velocity skew on headline |
| `src/components/landing/manifesto.tsx` | REWRITE | Kinetic letter drop/rotate/reassemble on scroll |
| `src/components/landing/pinned-acts.tsx` | CREATE | Scroll-pinned 3-act timeline with CSS-art scene illustrations |
| `src/components/landing/categories.tsx` | REWRITE | Vertical-scroll → horizontal-translation pinned gallery (6 cards) |
| `src/components/landing/marquee.tsx` | CREATE | Giant 18vw serif marquee, scroll-velocity reactive |
| `src/components/landing/stats.tsx` | CREATE | Magazine "by the numbers" with count-up animation |
| `src/components/landing/cta.tsx` | REWRITE | Dark CTA with outline-hover wordmark |
| `src/components/landing/cursor.tsx` | CREATE | Persistent custom cursor (mix-blend-difference dot + hover ring) |
| `src/components/landing/film-grain.tsx` | CREATE | Persistent SVG noise overlay, scroll-velocity reactive |
| `src/components/landing/scroll-progress.tsx` | CREATE | 1px acid green scroll progress bar at top |
| `src/components/landing/section-nav.tsx` | CREATE | "01 / 08" section index in top-left, updates on scroll |
| `src/app/page.tsx` | MODIFY | Assemble 8 new sections + persistent overlay layer |
| `src/app/globals.css` | MODIFY | `cursor: none` on html, blend mode utilities, scroll-behavior |

---

## Section 1: PRELOADER

**File:** `src/components/landing/loader.tsx`

**Layout:**
- Full-screen cream `#FFF8F0` overlay, z-100
- Center: counter "00" → "100" over 2.4s, font mono, 14vw, charcoal
- Below counter: "TAG — Wardrobe, in order." in Playfair serif 18px, charcoal
- Bottom-left: "LOADING / WARDROBE SYSTEM" in 10px mono muted
- Bottom-right: "v.2026" in 10px mono muted

**Animation:**
- Counter increments smoothly with `useMotionValue` + `useTransform`
- When counter hits 100, hold for 200ms
- Then `clipPath: inset(0 0 100% 0)` wipes top-down revealing the hero
- After wipe completes (600ms), `onComplete` fires, parent hides loader

**Props:** `{ onComplete?: () => void }`

---

## Section 2: HERO

**File:** `src/components/landing/hero.tsx`

**Layout:**
- `min-h-screen` overflow-hidden
- Shadergradient background (existing `GradientBg` component)
- Top-left: section index "01 / 08" (rendered by `SectionNav` overlay, not in hero)
- Top-right: "LOG IN" + "START" links, 10px mono, with magnetic-pull on hover
- Center: massive serif headline "A wardrobe, in order." in Playfair Display 700, ~12vw
- Below headline (right-aligned, max-w-sm): "Tag every piece. Know what you own. Wear more of it." in IBM Plex Mono 14px
- Bottom-left: "START →" 10px mono (no button, just text + arrow) — clicking goes to /signup
- Right-center: 3D garment tag (`GarmentTag3D`) floating, scale ~0.5 of viewport height
- Bottom strip (full width): marquee "WARDROBE SYSTEM — TAGS — ORGANIZE — WEAR MORE —" 14px mono, scrolling right-to-left infinite

**Animation:**
- Headline: scroll-velocity skew — uses `useScroll` + `useSpring` (existing `useScrollVelocity` pattern from session 1)
- 3D tag: existing floating animation (gentle y-sine + rotation), add scroll-driven parallax (y: 0 → -80px over scroll 0-1)
- Marquee: CSS animation infinite
- Section enters: headline letters stagger fade-in (after loader completes)

**State:**
- Track loader-done to delay entrance animations
- `showLoader`, `loaderDone` (local state)

---

## Section 3: MANIFESTO

**File:** `src/components/landing/manifesto.tsx`

**Layout:**
- Full-width cream section, py-32 md:py-48
- Center: "You own more than you wear." in Playfair Display 700, ~10vw
- Subtitle (top-left): "02 / MANIFESTO" in 10px mono muted

**Animation:**
- Each letter is a separate motion.span
- On scroll into view: letters drop from above (y: -40 → 0) with rotation (rotate: 15 → 0), staggered 50ms each
- Mid-section (fully in view): letters form the full statement
- On scroll out: letters fly apart in scroll direction (y: 0 → 60, opacity: 1 → 0)
- Background: film grain overlay intensifies here

---

## Section 4: PINNED ACTS

**File:** `src/components/landing/pinned-acts.tsx`

**Layout:**
- `min-h-[300vh]` container, internal section is `h-screen sticky top-0`
- Three scenes, only one visible at a time based on scroll progress
- Each scene: 2-column grid (image left, text right)
  - Left: SVG illustration of the act concept
  - Right: large number "01" "02" "03" in Playfair serif 200px, label, title, body
- Left rail: vertical progress line with 3 nodes, highlights current
- Top-left: "03 / ACTS"

**Scenes:**
- **Act 01 / UPLOAD**: SVG of a phone screen with a garment silhouette inside, scan-line across it, "Drop a photo" annotation
- **Act 02 / ORGANIZE**: SVG of 6 garment tags hanging from a rod, each with a different category icon
- **Act 03 / WEAR MORE**: SVG of a calendar grid (7x4) with tags filling some cells (visualize rotation)

**Animation:**
- `useScroll` with offset `["start start", "end end"]` to drive scene transitions
- Each scene has its own opacity (1 in active range, 0 elsewhere) + scale (1 → 1.05 on entry)
- Image SVG: subtle parallax on scroll (y offset)
- Progress rail: vertical line fills 0% → 100% based on scroll, three nodes highlight at 16%/50%/83%
- Pinned container: CSS `position: sticky` on the inner scene

---

## Section 5: CATEGORIES (horizontal pinned)

**File:** `src/components/landing/categories.tsx`

**Layout:**
- `min-h-[200vh]` container, inner section is `h-screen sticky top-0 overflow-hidden`
- Background word "WARDROBE" in 30vw Playfair serif black, 5% opacity, centered
- Foreground: 6 category cards in a horizontal row, each `min-w-[60vw]`
- Each card: solid color background (per category), Playfair 4rem category name, index "01/06", serif description

**Cards (6):**
- 01 / TOPS — peach `#FFE4CC`
- 02 / BOTTOMS — mint `#D4F5D4`
- 03 / DRESSES — blush `#FFD4E8`
- 04 / OUTERWEAR — sky `#D4E8FF`
- 05 / SHOES — sand `#FFE8D4`
- 06 / ACCESSORIES — lilac `#E8D4FF`

**Animation:**
- Vertical scroll maps to horizontal translation: `useTransform(scrollYProgress, [0, 1], [0, -cardsWidth])`
- Each card: on horizontal center crossing, scales 0.95 → 1.05, opacity boost
- Background word: subtle parallax (x scroll-driven, opposite direction)

**Top-left:** "04 / CATEGORIES"

---

## Section 6: MARQUEE BREAK

**File:** `src/components/landing/marquee.tsx`

**Layout:**
- Full-bleed cream section, py-16
- Single horizontal line of text scrolling right-to-left infinitely
- Text: "TAG. WEAR. REPEAT. — " repeated 10x
- Font: Playfair Display 700, 18vw
- Color: charcoal
- Below marquee: small caption "05 / THE CYCLE" centered

**Animation:**
- CSS `animation: marquee-scroll 20s linear infinite` translating -50%
- **Scroll-velocity reactive**: useFramerMotion's `useScroll` to detect scroll velocity, apply a `scaleY` stretch to the text on fast scrolls (squash on deceleration, stretch on acceleration) — the cinematic breathing effect
- Hover: pause animation, slow color shift to acid green

---

## Section 7: STATS

**File:** `src/components/landing/stats.tsx`

**Layout:**
- Cream section, py-24, divided in 3 horizontal rows
- Each row: massive serif number left, small mono description right
- Top-left: "06 / BY THE NUMBERS"

**Three numbers:**
- **0** (italic) — "minutes to tag a piece" (small "0 → 0, no wait" — but the act of showing "0" is the point)
- **6** — "categories" (counts up from 0 → 6 over 1.2s on scroll-in)
- **100%** — "yours, forever" (counts up from 0 → 100)

**Animation:**
- Each number: `useMotionValue` + `useTransform` with `useInView` trigger
- Numbers count up only when section is 50% in view
- Different sizes per row (8vw, 12vw, 10vw) for typographic variety
- Last row: italic Playfair

---

## Section 8: CTA + FOOTER

**File:** `src/components/landing/cta.tsx`

**Layout:**
- Full-bleed dark section `#1A1A1A`, py-32
- Top-left: "07 / START TODAY" in 10px mono muted cream
- Center: massive serif "Your wardrobe is waiting." in Playfair 700 cream, ~10vw
  - "wardrobe" word is rendered as SVG path so it can outline-hover
- Below: "Tag your closet. See what you own. Wear more of it." in mono cream
- CTA: acid green "START FREE →" button (existing Button component)
- Footer: 3 columns — TAG wordmark left, copyright center, nav links right
- Background: subtle film grain

**Animation:**
- On section enter: fade + slight y-up entrance, 600ms
- **Outline hover on "wardrobe" word**: SVG path with stroke-dasharray + stroke-dashoffset, on hover the stroke draws in (1.2s), charcoal stroke on cream background
- CTA button: existing button styles

---

## Persistent Overlay Layer

### Custom Cursor

**File:** `src/components/landing/cursor.tsx`

**Behavior:**
- Single small dot (8px), `mix-blend-difference`, color cream
- Spring-follows pointer with `useSpring({ stiffness: 500, damping: 30, mass: 0.2 })`
- On hover over interactive elements (`a`, `button`, `[data-cursor="view"]`): expands to 40px ring with "VIEW" label inside, no fill, charcoal stroke
- On hover over magnetic elements: scales slightly + label changes to element's `data-cursor` value
- On hover over inputs: hides (default OS cursor shows for text caret)
- Hidden on touch devices (`window.matchMedia('(pointer: coarse)')`)

**Implementation:**
- `"use client"` component, mount at root of `page.tsx`
- Uses `useEffect` to attach `mousemove` listener
- `useState` for cursor state (default | hover | hidden)
- Renders `motion.div` with style updated each pointer move

### Film Grain

**File:** `src/components/landing/film-grain.tsx`

**Behavior:**
- Full-page fixed overlay, z-90, pointer-events-none
- SVG `<feTurbulence>` noise pattern, 4% opacity baseline
- Scroll-velocity reactive: `useSpring` of scroll velocity → `opacity: 0.04` to `0.12`
- Color: charcoal on cream sections, cream on dark sections (auto-detect via parent context or use mix-blend)

**Implementation:**
- Single inline SVG with `feTurbulence` filter, applied as background-image to a fixed div
- Listens to `window` scroll, updates opacity via framer-motion

### Scroll Progress Bar

**File:** `src/components/landing/scroll-progress.tsx`

**Behavior:**
- Fixed top, full-width, 2px height, z-50
- Background: cream/transparent
- Fill: acid green `#A8FF3E`, width = `(scrollY / scrollMax) * 100%`
- Updates on every scroll via `useScroll` from framer-motion

### Section Nav

**File:** `src/components/landing/section-nav.tsx`

**Behavior:**
- Fixed top-left, z-40
- Displays "0X / 08" in 10px mono muted
- Updates based on which section is currently in view (using `useInView` on each section ref)
- Parents pass `sectionRefs: RefObject<HTMLElement>[]` to determine current section

---

## Page Assembly

**File:** `src/app/page.tsx`

```tsx
"use client"
import { useRef } from "react"
import { Hero } from "@/components/landing/hero"
import { Manifesto } from "@/components/landing/manifesto"
import { PinnedActs } from "@/components/landing/pinned-acts"
import { Categories } from "@/components/landing/categories"
import { Marquee } from "@/components/landing/marquee"
import { Stats } from "@/components/landing/stats"
import { CtaSection } from "@/components/landing/cta"
import { Cursor } from "@/components/landing/cursor"
import { FilmGrain } from "@/components/landing/film-grain"
import { ScrollProgress } from "@/components/landing/scroll-progress"
import { SectionNav } from "@/components/landing/section-nav"

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const manifestoRef = useRef<HTMLElement>(null)
  // ... refs for all 7 sections

  return (
    <main className="bg-[#FFF8F0]">
      <Cursor />
      <FilmGrain />
      <ScrollProgress />
      <SectionNav refs={[heroRef, manifestoRef, ...]} />

      <Hero ref={heroRef} />
      <Manifesto ref={manifestoRef} />
      <PinnedActs />
      <Categories />
      <Marquee />
      <Stats />
      <CtaSection />
    </main>
  )
}
```

---

## Globals.css Updates

**File:** `src/app/globals.css`

Add:
```css
html { cursor: none; }
@media (pointer: coarse) { html { cursor: auto; } }

.scroll-mt-nav { scroll-margin-top: 80px; }

.mix-blend-difference { mix-blend-mode: difference; }
```

---

## Implementation Plan

This work happens in 13 tasks. Each task ends with an independently testable deliverable and a commit.

### Task 1: Globals.css + base utilities
### Task 2: Custom cursor
### Task 3: Film grain overlay
### Task 4: Scroll progress bar
### Task 5: Section nav
### Task 6: Preloader rewrite
### Task 7: Hero rewrite (with overlay)
### Task 8: Manifesto rewrite (kinetic letters)
### Task 9: Pinned acts (3 scenes with CSS art)
### Task 10: Categories horizontal pinned
### Task 11: Marquee break
### Task 12: Stats (count-up)
### Task 13: CTA rewrite + page assembly
### Task 14: CodeRabbit review + smoke test
