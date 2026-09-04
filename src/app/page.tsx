"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Hero } from "@/components/landing/hero"
import { Manifesto } from "@/components/landing/manifesto"
import { OrderVideo } from "@/components/landing/order-video"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Categories } from "@/components/landing/categories"
import { CtaSection } from "@/components/landing/cta"

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Hero zooms toward bottom, fades out as manifesto scrolls in underneath
  const heroScale = useTransform(scrollYProgress, [0, 0.55], [1, 1.15])
  const heroOpacity = useTransform(scrollYProgress, [0.1, 0.6], [1, 0])

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      {/* Sticky hero: zooms toward bottom, fades out — scroll distance lives in this container */}
      <div ref={containerRef} className="relative" style={{ height: "250vh" }}>
        <div className="sticky top-0 z-10 h-screen overflow-hidden bg-[#1A1A1A]">
          <motion.div
            className="h-full w-full"
            style={{
              scale: heroScale,
              opacity: heroOpacity,
              transformOrigin: "center bottom",
            }}
          >
            <Hero />
          </motion.div>
        </div>
      </div>

      <Manifesto />
      <HowItWorks />
      <OrderVideo />
      <Categories />
      <CtaSection />
    </main>
  )
}
