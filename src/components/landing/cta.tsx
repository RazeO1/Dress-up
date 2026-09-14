"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Sparkles, Check, Heart } from "lucide-react"

export function CtaSection() {
  return (
    <section
      id="cta"
      className="relative bg-[#060709] text-white pt-28 pb-36 patternbreak-grid overflow-hidden"
    >
      {/* Ambient background accent glows */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#CA9FFF]/15 to-[#A8FF3E]/15 blur-[160px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <div className="relative rounded-[40px] sm:rounded-[48px] bg-[#0E1118]/90 border border-white/20 p-8 sm:p-16 lg:p-20 text-center shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl">
          {/* Subtle line decorations */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Section Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-label text-white/70 uppercase tracking-[0.25em] mb-6">
            <Sparkles className="h-3 w-3 text-[#A8FF3E]" />
            <span>06 // BEGIN YOUR CLOSET TRANSFORMATION</span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white max-w-4xl mx-auto leading-[0.98]">
            BREAK THE PATTERN.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8F0] via-[#CA9FFF] to-[#A8FF3E]">
              WEAR WHAT YOU OWN.
            </span>
          </h2>

          <p className="mt-6 font-body text-base sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Your dream wardrobe is already in your bedroom. Digitize your garments, track your
            cost-per-wear, and fall back in love with your clothes.
          </p>

          {/* Action Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#A8FF3E] text-[#08090C] font-label text-xs sm:text-sm uppercase tracking-widest font-bold transition-all duration-300 hover:bg-[#bbfd5e] hover:shadow-[0_0_40px_rgba(168,255,62,0.45)] hover:scale-105"
            >
              <span>START CATALOGING — FREE</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-label text-xs sm:text-sm uppercase tracking-widest transition-all"
            >
              <span>LOG IN TO YOUR CLOSET</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-label text-white/60">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#A8FF3E]" />
              Free Core Features Forever
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#A8FF3E]" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#A8FF3E]" />
              100% Private Wardrobe Vault
            </span>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-20 flex items-center">
              <Image
                src="/tag-logo.png"
                alt="TAG"
                width={80}
                height={24}
                className="h-6 w-auto object-contain brightness-0 invert"
              />
            </div>
            <span className="font-label text-xs text-white/40">
              {"//"} WARDROBE INTELLIGENCE SYSTEM
            </span>
          </div>

          <div className="font-label text-[11px] uppercase tracking-wider text-white/50 text-center">
            © 2026 TAG — TAG EVERY PIECE. KNOW WHAT YOU OWN. WEAR MORE OF IT.
          </div>

          <div className="flex items-center gap-6 text-xs font-label text-white/70">
            <Link href="/login" className="hover:text-white transition-colors">
              LOG IN
            </Link>
            <Link href="/signup" className="hover:text-[#A8FF3E] transition-colors">
              SIGN UP
            </Link>
          </div>
        </footer>
      </div>
    </section>
  )
}
