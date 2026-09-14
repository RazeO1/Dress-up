"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"

const DOCK_ITEMS = [
  { id: "hero", label: "STORY" },
  { id: "stats", label: "EVIDENCE" },
  { id: "patterns", label: "TRAPS" },
  { id: "transformation", label: "ORDER" },
  { id: "system", label: "SYSTEM" },
  { id: "categories", label: "CATEGORIES" },
]

export function FloatingDock() {
  const [activeId, setActiveId] = useState("hero")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Reveal dock once scrolled a bit
      if (window.scrollY > 150) {
        setVisible(true)
      } else {
        setVisible(false)
      }

      // Check which section is in view
      const scrollPosition = window.scrollY + window.innerHeight / 3
      for (const item of [...DOCK_ITEMS].reverse()) {
        const el = document.getElementById(item.id)
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top) {
            setActiveId(item.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-1.5 p-1.5 rounded-full bg-[#0E1118]/85 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,0,0,0.5)]"
    >
      {/* Navigation Pills */}
      <div className="flex items-center gap-0.5 px-1">
        {DOCK_ITEMS.map((item) => {
          const isActive = activeId === item.id
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative px-3 py-1.5 rounded-full text-[11px] font-label uppercase tracking-wider transition-colors duration-200 ${
                isActive ? "text-[#08090C] font-bold" : "text-white/70 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockPill"
                  className="absolute inset-0 rounded-full bg-[#A8FF3E]"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="h-4 w-px bg-white/15 mx-1" />

      {/* Direct CTA inside capsule dock */}
      <Link
        href="/signup"
        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[11px] font-label uppercase tracking-wider font-semibold transition-all hover:scale-105"
      >
        <span>GET STARTED</span>
        <ArrowUpRight className="h-3 w-3 text-[#A8FF3E]" />
      </Link>
    </motion.div>
  )
}
