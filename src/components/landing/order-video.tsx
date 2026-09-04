"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

// First act: horizontal "peek" carousel of wardrobe projects.
// Vertical scroll drives horizontal translation — slivers of prev/next peek at the edges.
const PROJECTS = [
  { index: "01", label: "SNAP & STRIP", title: "Background gone.", color: "#FFE4CC", accent: "#1A1A1A" },
  { index: "02", label: "AUTO-TAG",     title: "Category locked.", color: "#D4F5D4", accent: "#1A1A1A" },
  { index: "03", label: "COLOR MATCH",  title: "Palette sorted.", color: "#FFD4E8", accent: "#1A1A1A" },
  { index: "04", label: "WORN TRACK",   title: "Outfits logged.", color: "#D4E8FF", accent: "#1A1A1A" },
  { index: "05", label: "FORGOTTEN",    title: "Wear it again.", color: "#FFE8D4", accent: "#1A1A1A" },
  { index: "06", label: "DASHBOARD",    title: "Know your closet.", color: "#E8D4FF", accent: "#1A1A1A" },
]

// Second act: pinned background with line-reveal headline.
const HEADLINE = [
  "Focus on innovation",
  "and user-centered",
  "design.",
]

export function OrderVideo() {
  const pinRef = useRef<HTMLDivElement>(null)
  const orderVideoRef = useRef<HTMLVideoElement>(null)

  // Pin-scrub: 600vh total. First half drives horizontal carousel,
  // second half drives the line-reveal headline.
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  })

  // Phase split
  const phaseA = useTransform(scrollYProgress, [0, 0.5, 0.5001], [1, 1, 0])
  const phaseB = useTransform(scrollYProgress, [0.4999, 0.5, 1], [0, 1, 1])

  // Phase A — horizontal track translation.
  // Width math: card + gap, translate from 0 to -(total - viewport)
  const cardWidth = 360
  const gap = 24
  const totalWidth = PROJECTS.length * cardWidth + (PROJECTS.length - 1) * gap
  const carouselX = useTransform(
    scrollYProgress,
    [0, 0.5],
    [0, -(totalWidth - (typeof window !== "undefined" ? window.innerWidth : 1280))]
  )

  // Phase B — per-line reveal. Three lines, three scrub windows across [0.5, 1].
  const lineProgress = (i: number) =>
    useTransform(scrollYProgress, [0.5 + i * 0.12, 0.5 + (i + 1) * 0.12], [0, 1])

  // Background video playback — play while pinned, pause when leaving
  useEffect(() => {
    const v = orderVideoRef.current
    if (!v) return
    const unsubscribe = scrollYProgress.on("change", (p) => {
      // Only play during the line-reveal phase; otherwise pause to save resources
      if (p > 0.45 && p < 0.98) {
        if (v.paused) v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <div ref={pinRef} className="relative" style={{ height: "600vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ===== PHASE A: Horizontal peek carousel ===== */}
        <motion.div
          className="absolute inset-0 bg-[#FFF8F0]"
          style={{ opacity: phaseA }}
        >
          {/* Section label */}
          <div className="absolute left-6 top-8 z-10 md:left-12">
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]">
              02b / THE SYSTEM
            </p>
          </div>

          {/* Background word */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className="font-editorial select-none text-[18vw] font-bold leading-none text-[#1A1A1A]/[0.04]"
              aria-hidden
            >
              WARDROBE
            </span>
          </div>

          {/* Carousel track */}
          <div className="flex h-full items-center">
            <motion.div
              className="flex items-center gap-6 pl-[10vw] pr-[10vw]"
              style={{ x: carouselX }}
            >
              {PROJECTS.map((p) => (
                <CarouselCard key={p.index} project={p} />
              ))}
            </motion.div>
          </div>

          {/* Edge gradient masks so the peek effect reads */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[8vw] bg-gradient-to-r from-[#FFF8F0] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[8vw] bg-gradient-to-l from-[#FFF8F0] to-transparent" />

          {/* Bottom marquee */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-[#1A1A1A]/10 py-2">
            <div className="animate-marquee whitespace-nowrap font-label text-[11px] uppercase tracking-[0.2em] text-[#8A8A7A]">
              {"WARDROBE SYSTEM — TAGS — ORGANIZE — WEAR MORE — ".repeat(6)}
            </div>
          </div>
        </motion.div>

        {/* ===== PHASE B: Pinned video + line-reveal headline ===== */}
        <motion.div
          className="absolute inset-0 bg-[#1A1A1A]"
          style={{ opacity: phaseB }}
        >
          {/* Pinned background video */}
          <video
            ref={orderVideoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-50"
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/hero-order.mp4" type="video/mp4" />
          </video>

          {/* Section label */}
          <div className="absolute left-6 top-8 z-10 md:left-12">
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]">
              02c / FOCUS
            </p>
          </div>

          {/* Headline — three lines, each revealed by its own scroll window */}
          <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 md:px-12">
            {HEADLINE.map((line, i) => {
              const p = lineProgress(i)
              const color = useTransform(
                p,
                [0, 1],
                ["rgba(200,200,184,0.35)", "rgba(255,248,240,1)"]
              )
              const opacity = useTransform(p, [0, 1], [0.4, 1])
              return (
                <motion.h2
                  key={i}
                  className="font-editorial text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[1.05] tracking-tight"
                  style={{ color, opacity }}
                >
                  {line}
                </motion.h2>
              )
            })}

            {/* Final payoff reveal after the third line settles */}
            <FinalPayoff progress={scrollYProgress} />
          </div>

          {/* Bottom marquee */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-[#FFF8F0]/10 bg-[#FFF8F0] py-2">
            <div className="animate-marquee whitespace-nowrap font-label text-[11px] uppercase tracking-[0.2em] text-[#8A8A7A]">
              {"WARDROBE SYSTEM — TAGS — ORGANIZE — WEAR MORE — ".repeat(6)}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function CarouselCard({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <div
      className="group relative flex h-[60vh] min-w-[280px] shrink-0 flex-col justify-between overflow-hidden p-8 md:min-w-[360px]"
      style={{ backgroundColor: project.color }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.6), transparent 60%)`,
        }}
      />
      <span className="relative font-label text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40">
        {project.index} / {project.label}
      </span>
      <h3 className="relative font-editorial text-4xl font-bold leading-[1.05] text-[#1A1A1A] md:text-5xl">
        {project.title}
      </h3>
    </div>
  )
}

function FinalPayoff({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
}) {
  const opacity = useTransform(progress, [0.92, 0.98], [0, 1])
  const y = useTransform(progress, [0.92, 0.98], [20, 0])
  return (
    <motion.div
      className="mt-12 max-w-sm"
      style={{ opacity, y }}
    >
      <p className="font-body text-sm leading-relaxed text-[#C8C8B8]">
        Every piece tagged. Every category sorted. Every outfit, tracked.
      </p>
    </motion.div>
  )
}
