"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Loader } from "./loader"

export function Hero() {
  const pinRef = useRef<HTMLDivElement>(null)
  const chaosVideoRef = useRef<HTMLVideoElement>(null)
  const [showLoader, setShowLoader] = useState(true)
  const [loaderDone, setLoaderDone] = useState(false)

  useEffect(() => {
    const chaos = chaosVideoRef.current
    if (!chaos) return

    chaos.play().catch(() => {})
    chaos.addEventListener("ended", () => { chaos.currentTime = 0; chaos.play().catch(() => {}) })
  }, [])

  // Pin-scrub: container is 300vh, sticky inner pins the hero to the viewport
  // for that whole 300vh of scroll. Scroll position is mapped 1:1 to the animation
  // timeline — no DOM movement until the scrub finishes.
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  })

  // Animation timeline (matches the reference: scale-up + fade-out as you scroll)
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const headlineSkew = useTransform(scrollYProgress, [0, 0.4], [0, -3])
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const sceneOpacity = useTransform(scrollYProgress, [0.6, 1], [1, 0])

  const handleLoaderComplete = () => {
    setShowLoader(false)
    setTimeout(() => setLoaderDone(true), 100)
  }

  const delay = loaderDone ? 0 : 2.5

  return (
    <>
      {showLoader && <Loader onComplete={handleLoaderComplete} />}

      {/* Pin container — owns the 300vh scroll distance for the scrub */}
      <div ref={pinRef} className="relative" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen">
          <motion.section
            className="relative h-screen w-full overflow-hidden bg-[#1A1A1A]"
            style={{ opacity: sceneOpacity }}
          >
            {/* 3D scene: the video — scales up as scroll progresses (camera dolly) */}
            <motion.div
              className="absolute inset-0 z-0"
              style={{ scale: videoScale, transformOrigin: "center center" }}
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

            {/* Headline + scroll-cue — fade out as the scrub progresses */}
            <motion.div
              className="relative z-10 ml-6 mr-6 flex h-full flex-col justify-center pb-20 md:ml-12 md:mr-12"
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
                className="mt-8 max-w-md font-display text-[clamp(1.5rem,4vw,3rem)] leading-[1.15] font-bold tracking-tight"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-[#FFF8F0]">Tag every piece.</span>
                <br />
                <span className="text-[#A8FF3E]">Know what you own.</span>
                <br />
                <span className="text-[#FFF8F0]">Wear more of it.</span>
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

            {/* Scroll-down cue — fades out early in the scrub */}
            <motion.div
              className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 font-label text-[10px] uppercase tracking-[0.3em] text-[#FFF8F0]"
              style={{ opacity: cueOpacity }}
            >
              <div className="flex flex-col items-center gap-2">
                <span>SCROLL</span>
                <span className="h-8 w-px bg-[#FFF8F0]" />
              </div>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </>
  )
}
