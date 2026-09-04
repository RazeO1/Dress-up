"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  const [hoverWardrobe, setHoverWardrobe] = useState(false)

  return (
    <section className="relative bg-[#1A1A1A] py-28 md:py-40">
      {/* Film grain intensification on dark section */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.12] mix-blend-color-dodge">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Label */}
        <motion.p
          className="font-label text-[10px] uppercase tracking-[0.3em] text-[#8A8A7A]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          07 / START TODAY
        </motion.p>

        {/* Headline */}
        <motion.h2
          className="mt-6 font-editorial text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[1.05] tracking-tight text-[#FFF8F0] md:text-[clamp(3rem,8vw,7rem)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Your{" "}
          <span
            className="relative inline-block cursor-pointer"
            onMouseEnter={() => setHoverWardrobe(true)}
            onMouseLeave={() => setHoverWardrobe(false)}
          >
            {/* Outlined wordmark */}
            <svg
              viewBox="0 0 280 80"
              className="absolute bottom-0 left-1/2 h-[0.7em] -translate-x-1/2 translate-y-full"
              aria-hidden
            >
              <text
                x="50%"
                y="70%"
                textAnchor="middle"
                fontSize="50"
                fontFamily="Georgia, serif"
                fontWeight="700"
                fill="none"
                stroke="#A8FF3E"
                strokeWidth="1.5"
                strokeDasharray={hoverWardrobe ? "400" : "0"}
                strokeDashoffset={hoverWardrobe ? "400" : "0"}
                style={{
                  transition: "stroke-dasharray 1.2s ease, stroke-dashoffset 1.2s ease",
                  textTransform: "uppercase",
                }}
              >
                wardrobe
              </text>
            </svg>
            wardrobe
          </span>{" "}
          <br />
          is waiting.
        </motion.h2>

        {/* Subline */}
        <motion.p
          className="mx-auto mt-6 max-w-md font-body text-base text-[#8A8A7A]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          Tag your closet. See what you own. Wear more of it.
          <br />
          Free, forever. No credit card required.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-[#A8FF3E] text-[#1A1A1A] hover:bg-[#8AE83A] px-12 py-6 text-base font-semibold"
          >
            <a href="/signup">
              START FREE
              <span className="ml-2">→</span>
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-24 border-t border-[#FFF8F0]/10 pt-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <p className="font-editorial text-xl font-bold text-[#FFF8F0]">TAG</p>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#8A8A7A]">
            © 2026 TAG — Wardrobe, in order.
          </p>
          <div className="flex gap-6">
            <a href="/login" className="font-label text-[10px] uppercase tracking-[0.15em] text-[#8A8A7A] hover:text-[#FFF8F0] transition-colors">
              Log in
            </a>
            <a href="/signup" className="font-label text-[10px] uppercase tracking-[0.15em] text-[#8A88A7A] hover:text-[#FFF8F0] transition-colors">
              Sign up
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
