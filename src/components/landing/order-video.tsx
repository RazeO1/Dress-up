"use client"

import { useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"

export function OrderVideo() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isInView) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#1A1A1A]"
    >
      {/* Order Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/hero-order.mp4" type="video/mp4" />
      </video>


      {/* Centered payoff copy */}
      <div className="relative z-10 flex h-screen items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 font-label text-[10px] uppercase tracking-[0.3em] text-[#8A8A7A]">
            02b / WE SORTED IT
          </p>
          <h2 className="font-editorial text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight text-[#FFF8F0]">
            Now you know<br />
            <span className="text-[#A8FF3E]">what you own.</span>
          </h2>
          <p className="mt-6 max-w-sm mx-auto font-body text-sm leading-relaxed text-[#C8C8B8]">
            Every piece tagged.<br />
            Every category sorted.<br />
            Every outfit, tracked.
          </p>
        </motion.div>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#FFF8F0]/10 bg-[#FFF8F0] py-2">
        <div className="animate-marquee whitespace-nowrap font-label text-[11px] uppercase tracking-[0.2em] text-[#8A8A7A]">
          {"WARDROBE SYSTEM — TAGS — ORGANIZE — WEAR MORE — ".repeat(6)}
        </div>
      </div>
    </section>
  )
}
