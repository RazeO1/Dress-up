"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function OrderVideo() {
  const orderVideoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = orderVideoRef.current
    if (!video) return
    video.play().catch(() => {})
    video.addEventListener("ended", () => {
      video.currentTime = 0
      video.play().catch(() => {})
    })
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Text fades in and out as you scroll
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.35, 0.45], [0, 1, 1, 0])
  const text1Y = useTransform(scrollYProgress, [0, 0.1, 0.35, 0.45], [30, 0, 0, -20])
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.45, 0.7, 0.8], [0, 1, 1, 0])
  const text2Y = useTransform(scrollYProgress, [0.3, 0.45, 0.7, 0.8], [30, 0, 0, -20])

  return (
    <section
      ref={containerRef}
      className="relative bg-[#1A1A1A]"
      style={{ height: "150vh" }}
    >
      {/* Sticky video — fills the whole section, no border, no inset */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={orderVideoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/hero-order.mp4" type="video/mp4" />
        </video>

        {/* Subtle dark wash for text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-[#1A1A1A]/15" />

        {/* Live indicator */}
        <div className="pointer-events-none absolute left-6 top-8 z-10 flex items-center gap-2 md:left-12">
          <span className="h-2 w-2 rounded-full bg-[#A8FF3E] animate-pulse" />
          <span className="font-label text-[10px] uppercase tracking-[0.25em] text-[#FFF8F0]/80">
            LIVE
          </span>
        </div>

        {/* Text scrolls over the video */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          <motion.div
            className="text-center"
            style={{ opacity: text1Opacity, y: text1Y }}
          >
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#FFF8F0]/60">
              ORDER OUT OF CHAOS
            </p>
            <h2 className="mt-4 font-editorial text-5xl font-bold leading-[0.95] text-[#FFF8F0] md:text-7xl lg:text-8xl">
              Your wardrobe,
              <br />
              <span className="text-[#A8FF3E]">finally sorted.</span>
            </h2>
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            style={{ opacity: text2Opacity, y: text2Y }}
          >
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#FFF8F0]/60">
              SEE EVERY PIECE
            </p>
            <h2 className="mt-4 font-editorial text-5xl font-bold leading-[0.95] text-[#FFF8F0] md:text-7xl lg:text-8xl">
              Every piece.
              <br />
              <span className="italic text-[#A8FF3E]">Seen.</span>
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
