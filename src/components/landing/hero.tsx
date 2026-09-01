"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"

// CSS-only SVG "garment tag" illustrations (no external image deps)
function GarmentTagSVG({ hue = "#A8FF3E", label = "TOPS", className = "" }: { hue?: string; label?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 280"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Garment tag illustration: ${label}`}
    >
      <defs>
        <pattern id={`grid-${label}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1A1A1A" strokeWidth="0.5" opacity="0.15" />
        </pattern>
      </defs>
      {/* Tag body */}
      <rect x="10" y="20" width="180" height="240" fill={hue} stroke="#1A1A1A" strokeWidth="3" />
      <rect x="10" y="20" width="180" height="240" fill={`url(#grid-${label})`} />
      {/* Top notch hole */}
      <circle cx="100" cy="50" r="10" fill="#FFF8F0" stroke="#1A1A1A" strokeWidth="3" />
      {/* Content lines */}
      <rect x="30" y="80" width="100" height="8" fill="#1A1A1A" />
      <rect x="30" y="100" width="140" height="4" fill="#1A1A1A" />
      <rect x="30" y="112" width="120" height="4" fill="#1A1A1A" />
      {/* Category stamp */}
      <rect x="30" y="140" width="60" height="20" fill="#1A1A1A" />
      <text x="60" y="155" textAnchor="middle" fill={hue} fontSize="11" fontFamily="monospace" fontWeight="700">
        {label}
      </text>
      {/* Care label */}
      <rect x="30" y="180" width="140" height="60" fill="#FFF8F0" stroke="#1A1A1A" strokeWidth="2" />
      <line x1="40" y1="195" x2="160" y2="195" stroke="#1A1A1A" strokeWidth="1" />
      <line x1="40" y1="205" x2="140" y2="205" stroke="#1A1A1A" strokeWidth="1" />
      <line x1="40" y1="215" x2="150" y2="215" stroke="#1A1A1A" strokeWidth="1" />
      <line x1="40" y1="225" x2="130" y2="225" stroke="#1A1A1A" strokeWidth="1" />
      {/* Barcode */}
      <rect x="30" y="248" width="100" height="2" fill="#1A1A1A" />
      <rect x="30" y="252" width="40" height="2" fill="#1A1A1A" />
      <rect x="75" y="248" width="60" height="6" fill="#1A1A1A" />
    </svg>
  )
}

function HeroTag({ x, y, rotate, hue, label, scale = 1 }: { x: string; y: string; rotate: number; hue: string; label: string; scale?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, transform: `rotate(${rotate}deg) scale(${scale})` }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <GarmentTagSVG hue={hue} label={label} className="w-32 md:w-44 drop-shadow-[4px_4px_0_#1A1A1A]" />
    </motion.div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Smoothed scroll velocity via spring (debounces frame deltas)
  const velocity = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  })

  // Headline responds to scroll: y-translate, x-skew, slight scale
  const titleY = useTransform(velocity, [0, 1], [0, -120])
  const titleX = useTransform(velocity, [0, 1], [0, -40])
  const titleSkew = useTransform(velocity, [0, 1], [0, -3])
  const titleScale = useTransform(velocity, [0, 1], [1, 0.92])

  // Background tags move OPPOSITE to scroll for parallax
  const tagAY = useTransform(velocity, [0, 1], [0, 60])
  const tagBY = useTransform(velocity, [0, 1], [0, 90])
  const tagCY = useTransform(velocity, [0, 1], [0, 40])
  const tagRotA = useTransform(velocity, [0, 1], [-8, -4])
  const tagRotB = useTransform(velocity, [0, 1], [12, 6])

  // Scroll velocity visualizer
  const [scrollVel, setScrollVel] = useState(0)
  useEffect(() => {
    let lastY = window.scrollY
    let lastT = performance.now()
    let raf = 0
    const tick = () => {
      const now = performance.now()
      const dy = window.scrollY - lastY
      const dt = now - lastT
      if (dt > 0) {
        const v = Math.abs(dy / dt) * 16 // px per frame, normalized
        setScrollVel((prev) => prev * 0.85 + v * 0.15)
      }
      lastY = window.scrollY
      lastT = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const velocityBarWidth = Math.min(100, scrollVel * 8)

  return (
    <section ref={ref} className="relative border-b-2 border-[#1A1A1A] overflow-hidden">
      {/* Background grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1A1A1A 0, #1A1A1A 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, #1A1A1A 0, #1A1A1A 1px, transparent 1px, transparent 8px)",
        }}
      />

      {/* Floating garment tags (parallax) */}
      <motion.div className="absolute right-[2%] top-[10%] hidden lg:block pointer-events-none" style={{ y: tagAY, rotate: tagRotA }}>
        <GarmentTagSVG hue="#A8FF3E" label="TOPS" className="w-44 drop-shadow-[6px_6px_0_#1A1A1A]" />
      </motion.div>
      <motion.div className="absolute right-[18%] top-[55%] hidden lg:block pointer-events-none" style={{ y: tagBY, rotate: tagRotB }}>
        <GarmentTagSVG hue="#FF6B35" label="SHOES" className="w-36 drop-shadow-[6px_6px_0_#1A1A1A]" />
      </motion.div>
      <motion.div className="absolute right-[40%] top-[15%] hidden xl:block pointer-events-none" style={{ y: tagCY, rotate: -4 }}>
        <GarmentTagSVG hue="#FF3366" label="BAGS" className="w-28 drop-shadow-[4px_4px_0_#1A1A1A]" />
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Top label row */}
        <div className="flex items-center justify-between font-label text-[10px] uppercase tracking-widest text-[#8A8A7A]">
          <span>01 / WARDROBE</span>
          <div className="flex items-center gap-2">
            <span>SCROLL VELOCITY</span>
            <div className="relative h-2 w-24 border border-[#1A1A1A] bg-[#FFF8F0]">
              <div
                className="absolute inset-y-0 left-0 bg-[#A8FF3E] transition-[width] duration-100"
                style={{ width: `${velocityBarWidth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Headline — moves with scroll velocity */}
        <motion.h1
          className="mt-8 font-display text-6xl font-bold leading-[0.85] tracking-tight md:text-[11rem]"
          style={{ y: titleY, x: titleX, skewX: titleSkew, scale: titleScale, transformOrigin: "left top" }}
        >
          YOUR
          <br />
          WARDROBE.
          <br />
          <span className="text-[#FF6B35]">NO</span> EXCUSES.
        </motion.h1>

        <p className="mt-8 max-w-md font-body text-lg leading-relaxed text-[#1A1A1A]">
          Tag every piece. Know what you own. Wear more of it.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a href="/signup">START FREE →</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/login">LOG IN</a>
          </Button>
        </div>

        {/* Bottom metadata strip */}
        <div className="mt-16 flex flex-wrap items-end justify-between gap-4 border-t-2 border-[#1A1A1A] pt-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-[#8A8A7A]">
            <p>// 001 / TAG-YOUR-CLOSET</p>
            <p className="mt-1 text-[#1A1A1A]">A BRUTALIST WARDROBE TRACKER</p>
          </div>
          <motion.div
            className="border-2 border-[#1A1A1A] bg-[#A8FF3E] px-4 py-2"
            style={{ y: tagCY }}
          >
            <p className="font-label text-[11px] uppercase tracking-widest text-[#1A1A1A]">
              ◉ CARE: 100% COTTON / WASH COLD
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}