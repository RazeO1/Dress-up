"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

// Sections ordered top → bottom, with their dominant background tone.
// "dark" sections render light text; "light" sections render dark text.
const sections = [
  { id: "hero",         tone: "dark"  }, // sticky pin before manifesto
  { id: "manifesto",    tone: "light" },
  { id: "how-it-works", tone: "light" },
  { id: "order-video",  tone: "dark"  },
  { id: "categories",   tone: "light" },
  { id: "cta",          tone: "dark"  },
] as const

type Tone = (typeof sections)[number]["tone"]

export function LandingNav() {
  const [activeTone, setActiveTone] = useState<Tone>("dark")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Detect which section is currently under the navbar by sampling a strip
  // of pixels just below it and reading the brightest/darkest average.
  useEffect(() => {
    const sample = () => {
      const x = Math.max(20, window.innerWidth / 2)
      const y = 80 // just under the 64px navbar
      const el = document.elementFromPoint(x, y)
      if (!el) return

      // Walk up from the sampled pixel to find a section wrapper with a known tone
      let node: Element | null = el
      while (node && node !== document.body) {
        const id = (node as HTMLElement).id
        if (id) {
          const s = sections.find(s => s.id === id)
          if (s) {
            setActiveTone(s.tone)
            return
          }
        }
        node = node.parentElement
      }

      // Fallback: sample the computed background of the deepest opaque element
      node = el
      while (node && node !== document.body) {
        const bg = (node as HTMLElement).style?.backgroundColor ||
                   getComputedStyle(node as HTMLElement).backgroundColor
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          const m = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/)
          if (m) {
            const [r, g, b] = [+m[1], +m[2], +m[3]]
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            setActiveTone(lum > 0.5 ? "light" : "dark")
            return
          }
        }
        node = node.parentElement
      }
    }

    sample()
    window.addEventListener("scroll", sample, { passive: true })
    window.addEventListener("resize", sample)
    return () => {
      window.removeEventListener("scroll", sample)
      window.removeEventListener("resize", sample)
    }
  }, [])

  const isDark = activeTone === "dark"

  const sectionLinks = [
    { id: "manifesto",    label: "VISION"  },
    { id: "how-it-works", label: "PROCESS" },
    { id: "order-video",  label: "ORDER"   },
    { id: "categories",   label: "STYLES"  },
    { id: "cta",          label: "BEGIN"   },
  ]

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      const navbarHeight = navRef.current?.offsetHeight ?? 80
      const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Colors for each tone
  const sectionText = isDark ? "text-[#FFF8F0]/80" : "text-[#1A1A1A]/70"
  const sectionHover = "hover:text-[#A8FF3E]"
  const ctaText = isDark ? "text-[#8A8A7A]" : "text-[#1A1A1A]/50"
  const ctaHover = isDark ? "hover:text-[#FFF8F0]" : "hover:text-[#1A1A1A]"
  const joinText = "text-[#A8FF3E]"
  const joinBorder = "border-[#A8FF3E]/30"
  const joinBorderHover = "hover:border-[#A8FF3E]"
  const hamburgerStroke = isDark ? "stroke-[#FFF8F0]" : "stroke-[#1A1A1A]"
  const navBg = isDark ? "bg-transparent" : "bg-[#FFF8F0]/70 backdrop-blur-md"
  const logoFilter = isDark ? "" : "brightness-0"

  return (
    <nav
      ref={navRef}
      className={`fixed inset-x-0 z-50 transition-colors duration-500 ${navBg}`}
    >
      {/* Top row — always visible, always clickable */}
      <div className="mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <img
            src="/tag-logo.png"
            alt="TAG"
            className={`h-10 w-auto transition-all duration-500 ${logoFilter}`}
          />
        </Link>

        {/* Desktop: Section links */}
        <div className="hidden md:flex items-center gap-6">
          {sectionLinks.map((s) => (
            <button
              key={s.id}
              onClick={() => handleNavClick(s.id)}
              className={`font-label text-[10px] uppercase tracking-[0.3em] transition-colors duration-500 ${sectionText} ${sectionHover}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Desktop: Login + Join CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/login"
            className={`font-label text-[10px] uppercase tracking-[0.3em] transition-colors duration-500 ${ctaText} ${ctaHover}`}
          >
            LOG IN
          </a>
          <a
            href="/signup"
            className={`font-label text-[10px] uppercase tracking-[0.3em] border-b transition-colors duration-500 ${joinText} ${joinBorder} ${joinBorderHover}`}
          >
            JOIN
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg className={`h-6 w-6 ${hamburgerStroke}`} viewBox="0 0 24 24" fill="none">
            {mobileMenuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute right-4 top-full mt-2 w-64 bg-[#1A1A1A]/95 backdrop-blur-sm border border-[#FFF8F0]/10 rounded-xl p-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {sectionLinks.map(s => (
              <Link
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(s.id)
                }}
                className="font-label text-xs uppercase tracking-[0.2em] text-[#FFF8F0]/90 hover:text-[#A8FF3E] transition-colors py-1"
              >
                {s.label}
              </Link>
            ))}
            <div className="border-t border-[#FFF8F0]/10 pt-3 flex flex-col space-y-2">
              <a href="/login" className="font-label text-xs uppercase tracking-[0.2em] text-[#8A8A7A] hover:text-[#FFF8F0] transition-colors">
                LOG IN
              </a>
              <Link href="/signup" className="font-label text-xs uppercase tracking-[0.2em] text-[#A8FF3E]">
                START
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
