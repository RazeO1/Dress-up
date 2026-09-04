"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function Cursor() {
  const [isTouch, setIsTouch] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverLabel, setHoverLabel] = useState("VIEW")

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const springX = useSpring(x, { stiffness: 500, damping: 30, mass: 0.2 })
  const springY = useSpring(y, { stiffness: 500, damping: 30, mass: 0.2 })

  useEffect(() => {
    // Detect touch device
    const touchQuery = window.matchMedia("(pointer: coarse)")
    setIsTouch(touchQuery.matches)
    if (touchQuery.matches) return

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return
      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null
      const interactive = !cursorEl && target.closest("a, button, [role='button']")
      if (cursorEl) {
        setIsHovering(true)
        setHoverLabel(cursorEl.dataset.cursor?.toUpperCase() || "VIEW")
      } else if (interactive) {
        setIsHovering(true)
        setHoverLabel("VIEW")
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", handleMove, { passive: true })
    window.addEventListener("mouseover", handleOver, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseover", handleOver)
    }
  }, [x, y])

  if (isTouch) return null

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[200] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFF8F0] mix-blend-difference"
        style={{ x: springX, y: springY }}
        aria-hidden
      />
      {/* Ring on hover */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[199] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#1A1A1A] mix-blend-difference"
        style={{ x: springX, y: springY }}
        animate={{
          width: isHovering ? 72 : 0,
          height: isHovering ? 72 : 0,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        aria-hidden
      >
        <span className="font-label text-[9px] uppercase tracking-[0.15em] text-[#1A1A1A] mix-blend-difference">
          {hoverLabel}
        </span>
      </motion.div>
    </>
  )
}
