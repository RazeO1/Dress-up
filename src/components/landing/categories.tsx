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
