"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react"

const NAV_LINKS = [
  { id: "hero", label: "STORY" },
  { id: "stats", label: "EVIDENCE" },
  { id: "patterns", label: "TRAPS" },
  { id: "transformation", label: "ORDER" },
  { id: "system", label: "SYSTEM" },
  { id: "categories", label: "CATEGORIES" },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#08090C]/80 backdrop-blur-xl border-b border-white/10 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & System Status Pill */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2">
              <div className="relative h-8 w-24 sm:w-28 flex items-center">
                <Image
                  src="/tag-logo.png"
                  alt="TAG"
                  width={112}
                  height={32}
                  priority
                  className="h-8 w-auto object-contain brightness-0 invert transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-label text-white/60 tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A8FF3E] animate-pulse" />
              <span>WARDROBE OS</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className="px-3 py-1 text-[11px] font-label uppercase tracking-widest text-white/70 hover:text-[#A8FF3E] transition-colors rounded-full hover:bg-white/5"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-label uppercase tracking-widest text-white/80 hover:text-white transition-colors"
            >
              LOG IN
            </Link>
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#A8FF3E] text-[#08090C] font-label text-xs uppercase tracking-wider font-semibold transition-all hover:bg-[#bbfd5e] hover:shadow-[0_0_20px_rgba(168,255,62,0.35)]"
            >
              <span>GET STARTED</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-white md:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-50 rounded-2xl bg-[#0D0F14] border border-white/10 p-6 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-label text-xs text-white/50 tracking-widest uppercase">
                  NAVIGATION
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-label text-[#A8FF3E]">
                  <Sparkles className="h-3 w-3" /> v2.6
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleScrollTo(link.id)}
                    className="flex items-center justify-between py-2 text-left font-label text-sm uppercase tracking-wider text-white/80 hover:text-[#A8FF3E]"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/40" />
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full py-2.5 text-center font-label text-xs uppercase tracking-widest text-white/80 bg-white/5 rounded-xl border border-white/10"
                >
                  LOG IN
                </Link>
                <Link
                  href="/signup"
                  className="w-full py-2.5 text-center font-label text-xs uppercase tracking-widest font-semibold text-[#08090C] bg-[#A8FF3E] rounded-xl shadow-lg"
                >
                  START FREE
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
