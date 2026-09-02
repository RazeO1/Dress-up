# TAG Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current "AI slop" landing page with a fashion-editorial redesign: cinematic loader, shadergradient hero with 3D garment tag, manifesto section, scroll-pinned how-it-works, horizontal categories gallery, and dark CTA footer.

**Architecture:** Five new/rewritten landing page sections assembled in `src/app/page.tsx`. Loader is a client-component overlay on the landing page. Hero uses ShaderGradientCanvas + ShaderGradient + @react-three/fiber Canvas. All animations via framer-motion useScroll/useTransform. No new dependencies.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, framer-motion, @shadergradient/react, @react-three/fiber, three.js, next/font/google

**Spec:** `docs/superpowers/specs/2026-09-02-landing-redesign-design.md`

## Global Constraints

- Landing page only — app shell (sidebar, wardrobe, settings) retains existing brutalist design unchanged
- No deployment — run locally with `npm run dev`
- Do NOT use liquid-logo or liquidglass (not on npm)
- Use framer-motion for all animations (no GSAP, no Lenis)
- 3D tag only in hero — no other r3f on the landing page
- Use existing color tokens from globals.css where possible
- Preserve existing navigation links (/login, /signup) in header

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/components/landing/loader.tsx` | CREATE | Cinematic letter-by-letter fade loader |
| `src/components/landing/hero.tsx` | REWRITE | ShaderGradientCanvas bg + r3f 3D tag + serif headline |
| `src/components/landing/manifesto.tsx` | CREATE | Oversized serif scroll-driven word reveal |
| `src/components/landing/how-it-works.tsx` | CREATE | Scroll-pinned 3-step feature explainer |
| `src/components/landing/categories.tsx` | REWRITE | Horizontal drag-scroll category gallery |
| `src/components/landing/cta.tsx` | CREATE | Full-bleed dark section + footer |
| `src/components/landing/garment-tag-3d.tsx` | CREATE | r3f Canvas with floating 3D garment tag |
| `src/components/landing/gradient-bg.tsx` | CREATE | ShaderGradientCanvas wrapper with "Sunset" preset |
| `src/app/page.tsx` | MODIFY | Reorder/replace sections to new flow |
| `src/app/globals.css` | MODIFY | Add Syne + Playfair Display fonts, loader keyframes |

---

## Task 1: Fonts + Loader CSS

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/landing/loader.tsx`

**Interfaces:**
- Produces: `Loader` component (exported), new CSS variables + font imports in globals.css

**Steps:**

- [ ] **Step 1: Add font imports to globals.css**

Add after the existing `@tailwind` directives:

```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
```

Add new CSS variables and loader keyframes before the `@layer base` block:

```css
/* Editorial landing page fonts */
:root {
  /* ... existing variables ... */
  --font-display: 'Syne', sans-serif;
  --font-editorial: 'Playfair Display', serif;
}

/* Cinematic loader keyframes */
@keyframes loader-word-reveal {
  0% { opacity: 0; transform: translateY(20px) skewY(3deg); }
  100% { opacity: 1; transform: translateY(0) skewY(0deg); }
}

@keyframes loader-clip-wipe {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0% 0 0); }
}

@keyframes loader-fade-out {
  0% { opacity: 1; }
  100% { opacity: 0; pointer-events: none; }
}
```

- [ ] **Step 2: Create cinematic Loader component**

Create `src/components/landing/loader.tsx`:

```tsx
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const TAG_LETTERS = ["T", "A", "G"]

interface LoaderProps {
  onComplete?: () => void
}

export function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState<"letters" | "wipe" | "done">("letters")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("wipe"), 1600)
    const t2 = setTimeout(() => {
      setPhase("done")
      onComplete?.()
    }, 2400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFF8F0]"
          initial={{ opacity: 1 }}
          animate={phase === "wipe" ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="flex items-baseline gap-1" aria-label="TAG">
            {TAG_LETTERS.map((letter, i) => (
              <motion.span
                key={letter}
                className="font-editorial text-[20vw] font-bold leading-none tracking-tight text-[#1A1A1A]"
                initial={{ opacity: 0, y: 24, skewY: 4 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Bottom label */}
          <motion.p
            className="absolute bottom-12 font-label text-[11px] uppercase tracking-[0.3em] text-[#8A8A7A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            Wardrobe, in order.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css src/components/landing/loader.tsx
git commit -m "feat(landing): add cinematic loader + editorial fonts"
```

---

## Task 2: Gradient Background Component

**Files:**
- Create: `src/components/landing/gradient-bg.tsx`

**Interfaces:**
- Consumes: nothing (static)
- Produces: `GradientBg` component that renders ShaderGradientCanvas with ShaderGradient

**Steps:**

- [ ] **Step 1: Create gradient-bg.tsx**

Create `src/components/landing/gradient-bg.tsx`:

```tsx
"use client"

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react"

export function GradientBg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <ShaderGradientCanvas>
        <ShaderGradient
          type="plane"
          color1="#F5E6D3"
          color2="#FFECD2"
          color3="#FFC89A"
          cAzimuthAngle={180}
          cPolarAngle={70}
          cDistance={2.5}
          cDomain="left"
          uSpeed={0.4}
          uTime={0}
          uDensity={1.2}
          uFrequency={1.6}
          uAmplitude={1.8}
        />
      </ShaderGradientCanvas>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/gradient-bg.tsx
git commit -m "feat(landing): add ShaderGradientCanvas background"
```

---

## Task 3: 3D Garment Tag Component

**Files:**
- Create: `src/components/landing/garment-tag-3d.tsx`

**Interfaces:**
- Consumes: nothing (static 3D object)
- Produces: `GarmentTag3D` React component — a r3f Canvas containing a 3D garment tag mesh

**Steps:**

- [ ] **Step 1: Create garment-tag-3d.tsx**

Create `src/components/landing/garment-tag-3d.tsx` — uses pure three.js (no @react-three/drei dependency needed):

```tsx
"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function GarmentTagMesh() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    // Gentle floating: sine-wave y offset + slow rotation
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.08
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.12 + 0.2
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* Tag body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.2, 0.08]} />
        <meshStandardMaterial color="#A8FF3E" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Top hole — dark circle */}
      <mesh position={[0, 0.8, 0.045]}>
        <ringGeometry args={[0.12, 0.18, 24]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Brand label strip */}
      <mesh position={[0, 0.3, 0.046]}>
        <boxGeometry args={[0.9, 0.18, 0.005]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Care info lines */}
      <mesh position={[0, -0.05, 0.046]}>
        <boxGeometry args={[0.8, 0.06, 0.005]} />
        <meshStandardMaterial color="#1A1A1A" opacity={0.5} transparent />
      </mesh>
      <mesh position={[0, -0.18, 0.046]}>
        <boxGeometry args={[0.6, 0.06, 0.005]} />
        <meshStandardMaterial color="#1A1A1A" opacity={0.35} transparent />
      </mesh>
      <mesh position={[0, -0.31, 0.046]}>
        <boxGeometry args={[0.7, 0.06, 0.005]} />
        <meshStandardMaterial color="#1A1A1A" opacity={0.25} transparent />
      </mesh>

      {/* Care wash label */}
      <mesh position={[0, -0.55, 0.046]}>
        <boxGeometry args={[0.75, 0.4, 0.005]} />
        <meshStandardMaterial color="#FFF8F0" />
      </mesh>
      {/* Wash lines */}
      <mesh position={[0, -0.5, 0.048]}>
        <boxGeometry args={[0.55, 0.025, 0.002]} />
        <meshStandardMaterial color="#1A1A1A" opacity={0.4} transparent />
      </mesh>
      <mesh position={[0, -0.57, 0.048]}>
        <boxGeometry args={[0.4, 0.025, 0.002]} />
        <meshStandardMaterial color="#1A1A1A" opacity={0.3} transparent />
      </mesh>
    </group>
  )
}

interface GarmentTag3DProps {
  className?: string
}

export function GarmentTag3D({ className }: GarmentTag3DProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
        <directionalLight position={[-2, 3, -2]} intensity={0.4} />
        <GarmentTagMesh />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/garment-tag-3d.tsx
git commit -m "feat(landing): add 3D garment tag with r3f"
```

---

## Task 4: Hero Section

**Files:**
- Rewrite: `src/components/landing/hero.tsx`

**Interfaces:**
- Consumes: `GradientBg` (Task 2), `GarmentTag3D` (Task 3), `Loader` (Task 1)
- Produces: `Hero` exported component

**Steps:**

- [ ] **Step 1: Rewrite hero.tsx**

Replace the entire contents of `src/components/landing/hero.tsx`:

```tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GradientBg } from "./gradient-bg"
import { GarmentTag3D } from "./garment-tag-3d"
import { Loader } from "./loader"

const HEADLINE_WORDS = ["A", "wardrobe,", "in", "order."]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [loaderDone, setLoaderDone] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  // Hide loader after animation completes
  const handleLoaderComplete = () => {
    setShowLoader(false)
    setLoaderDone(true)
  }

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Parallax for 3D tag
  const tagY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const tagScale = useTransform(scrollYProgress, [0, 1], [1, 0.85])

  // Headline parallax
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <>
      {/* Cinematic loader overlay */}
      <AnimatePresence>
        {showLoader && <Loader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      <section
        ref={ref}
        className="relative min-h-screen overflow-hidden bg-[#FFF8F0]"
      >
        {/* Shadergradient background */}
        <GradientBg />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-20 md:pb-28">
          {/* Top metadata */}
          <motion.div
            className="absolute left-6 top-8 font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A] md:top-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="font-semibold text-[#1A1A1A]">TAG</span>
            <span className="ml-3">/ WARDROBE SYSTEM</span>
          </motion.div>

          {/* Nav links top-right */}
          <motion.div
            className="absolute right-6 top-8 flex items-center gap-6 font-label text-[10px] uppercase tracking-[0.2em] md:top-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <a href="/login" className="text-[#1A1A1A] hover:text-[#A8FF3E] transition-colors">
              Log in
            </a>
            <a
              href="/signup"
              className="border-b border-[#1A1A1A] pb-0.5 text-[#1A1A1A] hover:border-[#A8FF3E] hover:text-[#A8FF3E] transition-colors"
            >
              Sign up
            </a>
          </motion.div>

          {/* 3D Garment Tag — right side, floating */}
          <motion.div
            className="absolute right-[4%] top-[20%] w-[280px] md:w-[380px] lg:w-[420px] pointer-events-none"
            style={{ y: tagY, scale: tagScale }}
          >
            <GarmentTag3D className="aspect-[3/4]" />
          </motion.div>

          {/* Headline block */}
          <motion.div
            className="relative z-10 max-w-2xl"
            style={{ y: headlineY, opacity: headlineOpacity }}
          >
            <h1 className="font-editorial text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.88] tracking-tight text-[#1A1A1A]">
              {HEADLINE_WORDS.map((word, i) => (
                <motion.span
                  key={word + i}
                  className="mr-[0.2em] inline-block"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: loaderDone ? 0.1 + i * 0.12 : 2.5 + i * 0.12,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="mt-6 max-w-sm font-body text-base leading-relaxed text-[#5A5A4A]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: loaderDone ? 0.7 : 3.1,
                duration: 0.7,
                ease: "easeOut",
              }}
            >
              Tag every piece. Know what you own.
              <br />
              Wear more of it.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: loaderDone ? 0.9 : 3.3,
                duration: 0.7,
                ease: "easeOut",
              }}
            >
              <Button asChild size="lg">
                <a href="/signup">
                  Start free
                  <span className="ml-2">→</span>
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg" className="border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#A8FF3E]">
                <a href="/login">Log in</a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Bottom metadata strip */}
          <motion.div
            className="relative z-10 mt-16 flex items-center justify-between border-t border-[#1A1A1A]/20 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: loaderDone ? 1.2 : 3.6, duration: 0.8 }}
          >
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#8A8A7A]">
              001 / TAG-YOUR-CLOSET
            </p>
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#8A8A7A]">
              Scroll ↓
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/hero.tsx
git commit -m "feat(landing): rewrite hero with shadergradient + 3D tag + cinematic loader"
```

---

## Task 5: Manifesto Section

**Files:**
- Create: `src/components/landing/manifesto.tsx`

**Interfaces:**
- Consumes: nothing (static copy)
- Produces: `Manifesto` exported component

**Steps:**

- [ ] **Step 1: Create manifesto.tsx**

```tsx
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const STATEMENT = "You own more than you wear."
const WORDS = STATEMENT.split(" ")

export function Manifesto() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  return (
    <section
      ref={ref}
      className="relative border-b border-[#1A1A1A]/10 bg-[#FFF8F0] py-32 md:py-48"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-editorial text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[1.05] tracking-tight text-[#1A1A1A] md:text-[clamp(3rem,9vw,8rem)]">
          {WORDS.map((word, i) => {
            const start = i / WORDS.length
            const end = (i + 1) / WORDS.length
            return (
              <WordReveal
                key={word + i}
                word={word}
                scrollYProgress={scrollYProgress}
                wordStart={start}
                wordEnd={end}
              />
            )
          })}
        </h2>
      </div>
    </section>
  )
}

function WordReveal({
  word,
  scrollYProgress,
  wordStart,
  wordEnd,
}: {
  word: string
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  wordStart: number
  wordEnd: number
}) {
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, wordStart - 0.1), wordStart + 0.1, wordEnd - 0.05, wordEnd + 0.05],
    [0.15, 1, 1, 0.15]
  )
  const y = useTransform(
    scrollYProgress,
    [Math.max(0, wordStart - 0.1), wordStart, wordEnd, wordEnd + 0.05],
    [20, 0, 0, -10]
  )

  return (
    <motion.span className="mr-[0.3em] inline-block" style={{ opacity, y }}>
      {word}
    </motion.span>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/manifesto.tsx
git commit -m "feat(landing): add manifesto section with scroll word reveal"
```

---

## Task 6: How It Works Section

**Files:**
- Create: `src/components/landing/how-it-works.tsx`

**Interfaces:**
- Consumes: nothing (static copy)
- Produces: `HowItWorks` exported component

**Steps:**

- [ ] **Step 1: Create how-it-works.tsx**

```tsx
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Camera, Tags, Sparkles } from "lucide-react"

const STEPS = [
  {
    number: "01",
    Icon: Camera,
    label: "UPLOAD",
    title: "Snap it.",
    subtitle: "Strip the background.",
    description:
      "Drop a photo of any garment. Our auto-crop removes the background — your piece, ready to tag.",
  },
  {
    number: "02",
    Icon: Tags,
    label: "ORGANIZE",
    title: "Sort by category.",
    subtitle: "Tag once.",
    description:
      "Tops, bottoms, dresses, outerwear, shoes, accessories. One tap to sort, forever to find.",
  },
  {
    number: "03",
    Icon: Sparkles,
    label: "WEAR MORE",
    title: "See what you forget.",
    subtitle: "Wear it.",
    description:
      "TAG surfaces your forgotten pieces. Wear more of what you already own.",
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const totalSteps = STEPS.length
  const progressWidth = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${100 / totalSteps}%`]
  )

  return (
    <section
      ref={ref}
      className="relative border-b border-[#1A1A1A]/10 bg-[#FFF8F0] py-24 md:py-32"
    >
      {/* Section header */}
      <div className="mx-auto mb-16 max-w-7xl px-6">
        <p className="font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]">
          02 / HOW IT WORKS
        </p>
        <h2 className="mt-3 font-editorial text-4xl font-bold text-[#1A1A1A] md:text-5xl">
          Three steps.
          <br />
          <span className="text-[#8A8A7A]">Zero excuses.</span>
        </h2>
      </div>

      {/* Progress bar */}
      <div className="mx-auto mb-16 max-w-7xl px-6">
        <div className="h-[2px] w-full bg-[#1A1A1A]/10">
          <motion.div
            className="h-full bg-[#1A1A1A]"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      {/* Steps grid */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, i) => {
          const { Icon } = step
          return (
            <StepCard key={step.number} step={step} index={i}>
              <div className="mb-8">
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#8A8A7A]">
                  {step.number} {step.label}
                </p>
              </div>
              <Icon
                className="mb-6 h-10 w-10 text-[#1A1A1A]"
                strokeWidth={1.5}
              />
              <h3 className="font-editorial text-2xl font-bold text-[#1A1A1A]">
                {step.title}
              </h3>
              <p className="mt-1 font-editorial text-xl italic text-[#8A8A7A]">
                {step.subtitle}
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-[#5A5A4A]">
                {step.description}
              </p>
            </StepCard>
          )
        })}
      </div>
    </section>
  )
}

function StepCard({
  step,
  index,
  children,
}: {
  step: (typeof STEPS)[number]
  index: number
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0])

  return (
    <motion.div
      ref={ref}
      className="border-t-2 border-[#1A1A1A] pt-8"
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/how-it-works.tsx
git commit -m "feat(landing): add how-it-works scroll-pinned section"
```

---

## Task 7: Categories Horizontal Scroll

**Files:**
- Rewrite: `src/components/landing/categories.tsx`

**Interfaces:**
- Consumes: nothing (static)
- Produces: `Categories` exported component with drag-scroll

**Steps:**

- [ ] **Step 1: Rewrite categories.tsx**

Replace contents of `src/components/landing/categories.tsx`:

```tsx
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronRight } from "lucide-react"

const CATEGORIES = [
  { name: "TOPS", hue: "#FFE4CC" },
  { name: "BOTTOMS", hue: "#D4F5D4" },
  { name: "DRESSES", hue: "#FFD4E8" },
  { name: "OUTERWEAR", hue: "#D4E8FF" },
  { name: "SHOES", hue: "#FFE8D4" },
  { name: "ACCESSORIES", hue: "#E8D4FF" },
]

export function Categories() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 0.5], [80, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section
      ref={ref}
      className="relative border-b border-[#1A1A1A]/10 overflow-hidden bg-[#FFF8F0] py-20 md:py-28"
    >
      {/* Section header */}
      <div className="mx-auto mb-12 max-w-7xl px-6">
        <p className="font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]">
          03 / CATEGORIES
        </p>
        <h2 className="mt-3 font-editorial text-4xl font-bold text-[#1A1A1A] md:text-5xl">
          Everything.
          <br />
          <span className="italic text-[#8A8A7A]">In one place.</span>
        </h2>
      </div>

      {/* Drag hint */}
      <div className="mx-auto mb-6 flex max-w-7xl items-center gap-2 px-6">
        <motion.p
          className="font-label text-[10px] uppercase tracking-[0.2em] text-[#8A8A7A]"
          style={{ opacity }}
        >
          Drag to explore
        </motion.p>
        <motion.div style={{ opacity }}>
          <ChevronRight className="h-3 w-3 text-[#8A8A7A]" />
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <motion.div
        className="flex gap-4 overflow-x-auto px-6 pb-4 md:px-6"
        style={{ x, cursor: "grab" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        whileDrag={{ cursor: "grabbing" }}
        onMouseDown={(e) => e.currentTarget.style.cursor = "grabbing"}
      >
        {/* Spacer for entry animation */}
        <div className="min-w-[1px] shrink-0" />

        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            className="group relative flex min-w-[260px] shrink-0 flex-col justify-end overflow-hidden border-2 border-[#1A1A1A] bg-[#FFF8F0] p-8 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#1A1A1A]"
            style={{ backgroundColor: cat.hue }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.08,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Gradient wash */}
            <div
              className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-20"
              style={{
                background: `radial-gradient(ellipse at 30% 20%, white, transparent 70%)`,
              }}
            />

            <h3 className="relative font-editorial text-4xl font-bold text-[#1A1A1A]">
              {cat.name}
            </h3>

            {/* Arrow indicator */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <ChevronRight className="h-6 w-6 text-[#1A1A1A]/40 group-hover:text-[#1A1A1A] transition-colors" />
            </div>
          </motion.div>
        ))}

        <div className="min-w-[1px] shrink-0" />
      </motion.div>

      {/* Scroll indicator line */}
      <div className="mx-auto mt-8 max-w-7xl px-6">
        <p className="font-body text-xs text-[#8A8A7A]">
          Six categories. One wardrobe. Infinite combinations.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/categories.tsx
git commit -m "feat(landing): rewrite categories as horizontal drag-scroll gallery"
```

---

## Task 8: CTA + Footer Section

**Files:**
- Create: `src/components/landing/cta.tsx`

**Interfaces:**
- Consumes: nothing (static)
- Produces: `CtaSection` exported component

**Steps:**

- [ ] **Step 1: Create cta.tsx**

```tsx
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative bg-[#1A1A1A] py-24 md:py-36">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #FFF8F0 0, #FFF8F0 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #FFF8F0 0, #FFF8F0 1px, transparent 1px, transparent 60px)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.p
          className="font-label text-[10px] uppercase tracking-[0.3em] text-[#8A8A7A]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          04 / START TODAY
        </motion.p>

        <motion.h2
          className="mt-6 font-editorial text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight text-[#FFF8F0] md:text-[clamp(3rem,7vw,6rem)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Your wardrobe
          <br />
          <span className="italic text-[#A8FF3E]">is waiting.</span>
        </motion.h2>

        <motion.p
          className="mx-auto mt-6 max-w-md font-body text-base text-[#8A8A7A]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Tag your closet. See what you own. Wear more of it.
          Free, forever. No credit card required.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-[#A8FF3E] text-[#1A1A1A] hover:bg-[#8AE83A] font-semibold px-10"
          >
            <a href="/signup">
              Start free
              <span className="ml-2">→</span>
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative mt-24 border-t border-[#FFF8F0]/10 pt-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <p className="font-editorial text-xl font-bold text-[#FFF8F0]">TAG</p>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#8A8A7A]">
            © 2026 TAG — Wardrobe, in order.
          </p>
          <div className="flex gap-6">
            <a href="/login" className="font-label text-[10px] uppercase tracking-[0.15em] text-[#8A8A7A] hover:text-[#FFF8F0] transition-colors">
              Log in
            </a>
            <a href="/signup" className="font-label text-[10px] uppercase tracking-[0.15em] text-[#8A8A7A] hover:text-[#FFF8F0] transition-colors">
              Sign up
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/cta.tsx
git commit -m "feat(landing): add CTA section + integrated footer"
```

---

## Task 9: Assemble New Landing Page

**Files:**
- Rewrite: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Hero` (Task 4), `Manifesto` (Task 5), `HowItWorks` (Task 6), `Categories` (Task 7), `CtaSection` (Task 8)
- Produces: updated `page.tsx` with new section order

**Steps:**

- [ ] **Step 1: Rewrite src/app/page.tsx**

```tsx
import { Hero } from "@/components/landing/hero"
import { Manifesto } from "@/components/landing/manifesto"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Categories } from "@/components/landing/categories"
import { CtaSection } from "@/components/landing/cta"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      {/* Hero: shadergradient bg + 3D tag + cinematic loader */}
      <Hero />

      {/* Manifesto: oversized serif word reveal */}
      <Manifesto />

      {/* How It Works: scroll-pinned 3-step */}
      <HowItWorks />

      {/* Categories: horizontal drag-scroll gallery */}
      <Categories />

      {/* CTA + Footer */}
      <CtaSection />
    </main>
  )
}
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
# Visit http://localhost:3000
# Verify: loader animation, hero gradient, 3D tag, scroll reveals
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(landing): assemble new 5-section editorial landing page"
```

---

## Task 10: CodeRabbit Autofix Review

**Files:** All files modified in Tasks 1–9

After implementing all tasks, invoke `/coderabbit:autofix` via the CodeRabbit agent to review and fix any:
- Unused imports
- TypeScript errors
- Accessibility issues
- Performance concerns
- Code style inconsistencies

**Steps:**

- [ ] **Step 1: Invoke CodeRabbit autofix**

Use the Agent tool with `coderabbit:code-reviewer` agent type to scan all modified files.

- [ ] **Step 2: Apply fixes**

Address any critical issues found by CodeRabbit.

- [ ] **Step 3: Commit fixes**

```bash
git add .
git commit -m "fix(landing): apply CodeRabbit review fixes"
```

---

## Self-Review Checklist

After implementation, verify:

1. **Loader**: Letter-by-letter fade-in → wipe → hero content. Check on localhost:3000.
2. **Hero**: Shadergradient fills viewport, 3D tag floats and responds to scroll. Falls back to gradient-only if r3f fails.
3. **Manifesto**: Each word fades in/out as it enters/exits the viewport scroll range.
4. **How It Works**: Three step cards with scroll-triggered opacity/y animations.
5. **Categories**: Horizontal drag-scroll with 6 category cards. Drag feels natural.
6. **CTA**: Dark section, serif headline, acid green CTA button, footer.
7. **Fonts**: Syne and Playfair Display load correctly via Google Fonts.
8. **Accessibility**: `prefers-reduced-motion` media query respected for key animations.
9. **Responsive**: All sections look good on mobile (375px+) and desktop (1280px+).
10. **No console errors**: Check browser console for React/r3f errors on load.

---

## Execution Options

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?