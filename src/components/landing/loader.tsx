"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"

interface LoaderProps {
  onComplete?: () => void
}

export function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState<"loading" | "wipe" | "done">("loading")
  const count = useMotionValue(0)
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    // Animate counter 0 → 100 over 2.4s
    const startTime = performance.now()
    const duration = 2400

    const tick = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const val = Math.floor(progress * 100)
      setDisplayCount(val)
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setDisplayCount(100)
        // Hold briefly, then wipe
        setTimeout(() => setPhase("wipe"), 200)
        // Done after wipe animation
        setTimeout(() => {
          setPhase("done")
          onComplete?.()
        }, 800)
      }
    }

    requestAnimationFrame(tick)
  }, [onComplete])

  const padded = String(displayCount).padStart(2, "0")

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFF8F0]"
          initial={{ opacity: 1 }}
          animate={phase === "wipe" ? { opacity: 0, y: 0 } : { opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Counter */}
          <motion.div
            className="font-label text-[18vw] font-bold leading-none tracking-tight text-[#1A1A1A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {padded}
          </motion.div>

          {/* Brand line */}
          <motion.div
            className="mt-6 font-editorial text-lg italic text-[#1A1A1A] md:text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            TAG — Wardrobe, in order.
          </motion.div>

          {/* Bottom meta */}
          <motion.div
            className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#8A8A7A]">
              LOADING / WARDROBE SYSTEM
            </span>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#8A8A7A]">
              v.2026
            </span>
          </motion.div>

          {/* Wipe bar that slides in at bottom on done */}
          {phase === "wipe" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-[#1A1A1A]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              style={{ originX: 0 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
