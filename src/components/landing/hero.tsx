"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Loader } from "./loader"

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const chaosVideoRef = useRef<HTMLVideoElement>(null)
  const [showLoader, setShowLoader] = useState(true)
  const [loaderDone, setLoaderDone] = useState(false)

  useEffect(() => {
    const chaos = chaosVideoRef.current
    if (!chaos) return

    chaos.play().catch(() => {})
    chaos.addEventListener("ended", () => { chaos.currentTime = 0; chaos.play().catch(() => {}) })
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const handleLoaderComplete = () => {
    setShowLoader(false)
    setTimeout(() => setLoaderDone(true), 100)
  }

  // Scroll-velocity skew on headline
  const headlineSkew = useTransform(scrollYProgress, [0, 0.4], [0, -3])
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Video scale parallax
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const delay = loaderDone ? 0 : 2.5

  return (
    <>
      {showLoader && <Loader onComplete={handleLoaderComplete} />}

      <section
        ref={ref}
        className="relative min-h-screen overflow-hidden bg-[#1A1A1A]"
      >
        {/* Chaos Video Layer — the only video in the hero */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: videoScale }}
        >
          <motion.video
            ref={chaosVideoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
          >
            <source src="/hero-chaos.mp4" type="video/mp4" />
          </motion.video>

        </motion.div>

        {/* Headline */}
        <motion.div
          className="relative z-10 ml-6 mr-6 flex min-h-screen flex-col justify-center pb-20 md:ml-12 md:mr-12"
          style={{ skewX: headlineSkew, y: headlineY, opacity: headlineOpacity }}
        >
          <motion.h1
            className="font-editorial text-[clamp(5rem,12vw,10rem)] font-bold leading-[0.9] tracking-tight text-[#FFF8F0]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              color: '#A8FF3E',
              transform: 'scale(1.05)',
              transition: { duration: 0.3 }
            }}
          >
            TAG
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xs font-body text-sm leading-relaxed text-[#C8C8B8]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.3, duration: 0.7, ease: "easeOut" }}
          >
            Tag every piece.
            <br />
            Know what you own.
            <br />
            Wear more of it.
          </motion.p>

          <motion.div
            className="mt-8 flex items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.5, duration: 0.7, ease: "easeOut" }}
          >
            <a
              href="/signup"
              className="group flex items-center gap-2 font-label text-xs uppercase tracking-[0.2em] text-[#FFF8F0] hover:text-[#A8FF3E] transition-colors"
              data-cursor="START"
            >
              START
              <span className="text-base transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="/login"
              className="font-label text-xs uppercase tracking-[0.2em] text-[#8A8A7A] hover:text-[#FFF8F0] transition-colors"
              data-cursor="LOG IN"
            >
              LOG IN
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom marquee strip */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-[#1A1A1A]/15 bg-[#FFF8F0] py-2">
          <div className="animate-marquee whitespace-nowrap font-label text-[11px] uppercase tracking-[0.2em] text-[#8A8A7A]">
            {"WARDROBE SYSTEM — TAGS — ORGANIZE — WEAR MORE — ".repeat(6)}
          </div>
        </div>

        {/* Top-right: nav */}
        <motion.div
          className="absolute right-6 top-8 z-20 flex items-center gap-6 md:top-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.6 }}
        >
          <a
            href="/login"
            className="font-label text-[10px] uppercase tracking-[0.2em] text-[#FFF8F0] hover:text-[#A8FF3E] transition-colors"
            data-cursor="LOG IN"
          >
            LOG IN
          </a>
          <a
            href="/signup"
            className="border-b border-[#FFF8F0] pb-0.5 font-label text-[10px] uppercase tracking-[0.2em] text-[#FFF8F0] hover:border-[#A8FF3E] hover:text-[#A8FF3E] transition-colors"
            data-cursor="SIGN UP"
          >
            START
          </a>
        </motion.div>
      </section>
    </>
  )
}
