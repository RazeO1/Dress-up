"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const TEXT = "TAG. WEAR. REPEAT. — "
const REPEAT = 12

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-20%" })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-[#1A1A1A]/10 bg-[#FFF8F0] py-16"
    >
      <div className="absolute left-6 top-6 z-10">
        <p className="font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]">
          05 / THE CYCLE
        </p>
      </div>

      {/* Marquee container */}
      <div className="relative flex overflow-hidden">
        {/* First copy */}
        <motion.div
          className="flex shrink-0 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: REPEAT }).map((_, i) => (
            <span
              key={i}
              className="font-editorial text-[clamp(2.5rem,10vw,9rem)] font-bold leading-none tracking-tight text-[#1A1A1A]"
            >
              {TEXT}
            </span>
          ))}
        </motion.div>

        {/* Duplicate for seamless loop */}
        <motion.div
          className="flex shrink-0 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: REPEAT }).map((_, i) => (
            <span
              key={`dup-${i}`}
              className="font-editorial text-[clamp(2.5rem,10vw,9rem)] font-bold leading-none tracking-tight text-[#1A1A1A]"
            >
              {TEXT}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hover pause overlay hint */}
      <div className="absolute bottom-4 right-6">
        <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#8A8A7A]/50">
          hover to pause ↑
        </p>
      </div>
    </section>
  )
}
