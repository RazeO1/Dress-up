"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function FilmGrain() {
  const opacity = useMotionValue(0.05)
  const smoothOpacity = useSpring(opacity, { stiffness: 80, damping: 20 })

  useEffect(() => {
    let lastY = window.scrollY
    let lastT = performance.now()
    let raf = 0

    const tick = () => {
      const now = performance.now()
      const dy = window.scrollY - lastY
      const dt = now - lastT
      if (dt > 0) {
        const velocity = Math.abs(dy / dt)
        // map velocity [0..2] to opacity [0.05..0.15]
        const target = Math.min(0.05 + velocity * 0.05, 0.15)
        opacity.set(target)
      }
      lastY = window.scrollY
      lastT = now
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [opacity])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[90] mix-blend-multiply"
      style={{ opacity: smoothOpacity }}
      aria-hidden
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </motion.div>
  )
}
