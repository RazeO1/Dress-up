"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export function LandingNav() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if we've scrolled past the hero section
    const heroHeight = window.innerHeight // hero is full height
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > heroHeight)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const sections = [
    { id: "manifesto", label: "MANIFESTO" },
    { id: "how-it-works", label: "HOW IT WORKS" },
    { id: "order-video", label: "ORDER VIDEO" },
    { id: "categories", label: "CATEGORIES" },
    { id: "cta", label: "GET STARTED" }
  ]

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false) // Close mobile menu on click
    const element = document.getElementById(id)
    if (element) {
      // Scroll to element, accounting for navbar height
      const navbarHeight = 80 // approximate navbar height
      const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  const linkClass = `font-label text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[#A8FF3E] ${
    scrolledPastHero ? "text-[#FFF8F0]" : "text-[#FFF8F0]/80"
  }`

  return (
    <nav
      ref={navRef}
      className={`fixed inset-x-0 z-50 transition-all duration-500 ${scrolledPastHero ? "bg-[#1A1A1A]/90 backdrop-blur-sm" : "bg-transparent"} border-b border-[#FFF8F0]/10`}
    >
      <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/tag-logo.png"
            alt="TAG Logo"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {sections.map(section => (
            <Link
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault()
                handleNavClick(section.id)
              }}
              className={linkClass}
              data-cursor={section.label.toLowerCase()}
            >
              {section.label}
            </Link>
          ))}

          {/* Auth buttons */}
          <div className="flex space-x-4">
            <a
              href="/login"
              className={`font-label text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[#FFF8F0] ${scrolledPastHero ? "text-[#8A8A7A]" : "text-[#FFF8F0]/60"}`}
              data-cursor="LOG IN"
            >
              LOG IN
            </a>
            <Link
              href="/signup"
              className="border-b border-[#FFF8F0] pb-0.5 font-label text-[10px] uppercase tracking-[0.2em] text-[#FFF8F0] hover:border-[#A8FF3E] hover:text-[#A8FF3E] transition-colors"
              data-cursor="SIGN UP"
            >
              START
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="h-6 w-6 stroke-[#FFF8F0]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute right-4 top-full mt-2 w-64 bg-[#1A1A1A]/95 backdrop-blur-sm border border-[#FFF8F0]/10 rounded-xl p-4 shadow-xl">
            <div className="flex flex-col space-y-3">
              {sections.map(section => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(section.id)
                  }}
                  className="font-label text-xs uppercase tracking-[0.2em] text-[#FFF8F0]/90 hover:text-[#A8FF3E] transition-colors py-1"
                  data-cursor={section.label.toLowerCase()}
                >
                  {section.label}
                </Link>
              ))}
              <div className="border-t border-[#FFF8F0]/10 pt-3 flex flex-col space-y-2">
                <a
                  href="/login"
                  className="font-label text-xs uppercase tracking-[0.2em] text-[#8A8A7A] hover:text-[#FFF8F0] transition-colors"
                  data-cursor="LOG IN"
                >
                  LOG IN
                </a>
                <Link
                  href="/signup"
                  className="border-b border-[#FFF8F0] pb-0.5 font-label text-xs uppercase tracking-[0.2em] text-[#FFF8F0] hover:border-[#A8FF3E] hover:text-[#A8FF3E] transition-colors"
                  data-cursor="SIGN UP"
                >
                  START
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}