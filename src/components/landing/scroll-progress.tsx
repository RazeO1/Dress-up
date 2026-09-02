"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[2px] origin-left bg-[#A8FF3E]"
      style={{ scaleX: width }}
      aria-hidden
    />
  )
}
