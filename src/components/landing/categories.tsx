"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const CATEGORIES = [
  { index: "01", name: "TOPS", desc: "Every essential layer.", color: "#FFE4CC" },
  { index: "02", name: "BOTTOMS", desc: "Pants, shorts, skirts.", color: "#D4F5D4" },
  { index: "03", name: "DRESSES", desc: "All shapes, all seasons.", color: "#FFD4E8" },
  { index: "04", name: "OUTERWEAR", desc: "Coats, jackets, blazers.", color: "#D4E8FF" },
  { index: "05", name: "SHOES", desc: "Every pair, in one place.", color: "#FFE8D4" },
  { index: "06", name: "ACCESSORIES", desc: "Bags, watches, jewelry.", color: "#E8D4FF" },
]

export function Categories() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const cardWidth = 320
  const gap = 16
  const totalWidth = CATEGORIES.length * cardWidth + (CATEGORIES.length - 1) * gap

  // Horizontal translation: scroll maps to horizontal movement
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(totalWidth - (typeof window !== "undefined" ? window.innerWidth : 1280))]
  )

  return (
    <section
      ref={containerRef}
      className="relative bg-[#FFF8F0]"
      style={{ height: `${CATEGORIES.length * 100 + 100}vh` }}
    >
      {/* Sticky inner */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Background word */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="font-editorial select-none text-[20vw] font-bold leading-none text-[#1A1A1A]/[0.04]"
            aria-hidden
          >
            WARDROBE
          </span>
        </div>

        {/* Section label */}
        <div className="absolute left-6 top-8 z-10 md:left-12">
          <p className="font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]">
            04 / CATEGORIES
          </p>
        </div>

        {/* Horizontal track */}
        <motion.div
          className="flex items-center gap-4 pl-6 md:pl-12"
          style={{ x }}
        >
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.index} cat={cat} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CategoryCard({
  cat,
  index,
}: {
  cat: (typeof CATEGORIES)[number]
  index: number
}) {
  return (
    <motion.div
      className="group relative flex min-w-[280px] shrink-0 flex-col justify-end overflow-hidden p-8 md:min-w-[320px]"
      style={{ backgroundColor: cat.color }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Abstract gradient wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 transition-opacity group-hover:opacity-60"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.6), transparent 60%)`,
        }}
      />

      {/* Index */}
      <span className="absolute right-6 top-6 font-label text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40">
        {cat.index}
      </span>

      {/* Category name */}
      <h3 className="relative font-editorial text-5xl font-bold text-[#1A1A1A] md:text-6xl">
        {cat.name}
      </h3>

      {/* Description */}
      <p className="relative mt-2 font-body text-sm text-[#1A1A1A]/60">
        {cat.desc}
      </p>

      {/* Arrow indicator */}
      <div className="absolute bottom-6 right-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1A1A1A]/40 group-hover:text-[#1A1A1A] transition-colors">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        </svg>
      </div>
    </motion.div>
  )
}
