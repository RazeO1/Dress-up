"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const TAG_LETTERS = ["T", "A", "G"]

interface LoaderProps {
  onComplete?: () => void
}

export function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState<"letters" | "wipe" | "done">("letters")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("wipe"), 1600)
    const t2 = setTimeout(() => {
      setPhase("done")
      onComplete?.()
    }, 2400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFF8F0]"
          initial={{ opacity: 1 }}
          animate={phase === "wipe" ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="flex items-baseline gap-1" aria-label="TAG">
            {TAG_LETTERS.map((letter, i) => (
              <motion.span
                key={letter}
                className="font-editorial text-[20vw] font-bold leading-none tracking-tight text-[#1A1A1A]"
                initial={{ opacity: 0, y: 24, skewY: 4 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="absolute bottom-12 font-label text-[11px] uppercase tracking-[0.3em] text-[#8A8A7A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            Wardrobe, in order.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
