"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GradientBg } from "./gradient-bg"
import { GarmentTag3D } from "./garment-tag-3d"
import { Loader } from "./loader"

const HEADLINE_WORDS = ["A", "wardrobe,", "in", "order."]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [showLoader, setShowLoader] = useState(true)
  const [loaderDone, setLoaderDone] = useState(false)

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
