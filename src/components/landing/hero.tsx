"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowDown, Sparkles, Tag, EyeOff, Copy, AlertCircle, ArrowUpRight } from "lucide-react"

const FLOATING_BADGES = [
  {
    icon: Tag,
    title: "TAGS STILL ON",
    desc: "Bought 7 months ago on flash sale. Zero wears.",
    tag: "$95 Unworn",
    position: "top-12 -left-4 sm:-left-12 lg:-left-24",
    rotate: -4,
    color: "#CA9FFF", // electric lavender
  },
  {
    icon: EyeOff,
    title: "INVISIBILITY EFFECT",
    desc: "Folded beneath the pile. Exists only in theory.",
    tag: "Buried 280 Days",
    position: "top-1/3 -right-4 sm:-right-12 lg:-right-24",
    rotate: 5,
    color: "#A8FF3E", // neon lime
  },
  {
    icon: Copy,
    title: "DUPLICATE TRAP",
    desc: "Bought identical black tee #4 because #1-#3 were lost.",
    tag: "Ghost Duplicate",
    position: "bottom-24 -left-2 sm:-left-8 lg:-left-16",
    rotate: 3,
    color: "#FFF8F0", // cream
  },
  {
    icon: AlertCircle,
    title: "WARDROBE PARALYSIS",
    desc: "Closet bursting at seams. 'I have nothing to wear.'",
    tag: "Every Morning",
    position: "bottom-12 -right-2 sm:-right-8 lg:-right-20",
    rotate: -3,
    color: "#FF9F9F", // soft alert pink
  },
]

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.9, 0.4])
  const phoneScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  const scrollToStats = () => {
    const el = document.getElementById("stats")
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-[#08090C] text-white pt-28 pb-20 sm:pt-36 sm:pb-32 patternbreak-grid flex flex-col justify-center"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CA9FFF]/10 blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-[#A8FF3E]/10 blur-[130px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Kicker / Monospace Category */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-label text-white/70 uppercase tracking-[0.25em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#CA9FFF] animate-ping" />
            <span>00 // THE WARDROBE PARADOX</span>
          </div>
        </motion.div>

        {/* Massive Neo-Grotesque Display Headline */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.02] uppercase"
          >
            We own more clothes.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8F0] via-[#CA9FFF] to-[#A8FF3E]">
              And wear less of them.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-body text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Cluttered hangers and impulse buys create a vicious loop: buy, bury, forget, re-buy.
            TAG breaks the pattern by turning your closet into a living digital catalog.
          </motion.p>

          {/* Primary Action Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#A8FF3E] text-[#08090C] font-label text-xs uppercase tracking-widest font-bold transition-all duration-300 hover:bg-[#bbfd5e] hover:shadow-[0_0_30px_rgba(168,255,62,0.4)]"
            >
              <span>BREAK THE CYCLE — FREE</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>

            <button
              onClick={scrollToStats}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-label text-xs uppercase tracking-widest transition-all"
            >
              <span>SEE THE DATA</span>
              <ArrowDown className="h-3.5 w-3.5 text-[#CA9FFF]" />
            </button>
          </motion.div>
        </motion.div>

        {/* Central Stage: iPhone Mockup playing /hero-chaos.mp4 + Surrounding Floating Micro-Badges */}
        <div className="relative mt-16 sm:mt-20 max-w-3xl mx-auto flex items-center justify-center">
          {/* Glowing pedestal backdrop */}
          <div className="absolute inset-0 max-w-md mx-auto h-[480px] bg-gradient-to-b from-[#CA9FFF]/15 via-[#A8FF3E]/10 to-transparent blur-2xl rounded-full pointer-events-none" />

          {/* Phone Device Frame */}
          <motion.div
            style={{ scale: phoneScale }}
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 w-[280px] sm:w-[320px] md:w-[350px] aspect-[9/18.5] rounded-[44px] bg-[#12141A] border-[6px] border-[#2B2F38] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(202,159,255,0.2)] overflow-hidden p-2.5"
          >
            {/* Dynamic Island Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 h-5 w-24 bg-black rounded-full flex items-center justify-end px-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center">
                <div className="h-1 w-1 rounded-full bg-[#344054]" />
              </div>
            </div>

            {/* Inner Phone Screen */}
            <div className="relative h-full w-full rounded-[36px] overflow-hidden bg-black flex flex-col justify-between">
              {/* Chaos Video Element */}
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src="/hero-chaos.mp4" type="video/mp4" />
              </video>

              {/* Subtle glass reflection overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10" />

              {/* Status Header inside Phone */}
              <div className="relative z-20 pt-8 px-4 flex items-center justify-between text-[10px] font-label text-white/90 drop-shadow">
                <span className="bg-red-500/80 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  STATE: CHAOS
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                  UNINDEXED
                </span>
              </div>

              {/* Warning Banner at bottom of Phone */}
              <div className="relative z-20 m-3 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-left">
                <div className="flex items-center gap-2 text-[10px] font-label text-[#CA9FFF] font-bold tracking-wider uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  WARDROBE OVERFLOW
                </div>
                <p className="mt-1 font-body text-xs text-white/90 line-clamp-2">
                  128 uncataloged garments detected. Estimated 74% untouched this season.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Floating Badges Surrounding the Phone */}
          {FLOATING_BADGES.map((badge, idx) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + idx * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: 0,
                  transition: { duration: 0.2 },
                }}
                style={{ rotate: badge.rotate }}
                className={`absolute z-30 ${badge.position} w-56 sm:w-64 p-3.5 rounded-2xl bg-[#12141A]/90 backdrop-blur-xl border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-default transition-shadow hover:shadow-[0_20px_40px_rgba(202,159,255,0.25)]`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-label text-[10px] font-bold uppercase tracking-wider text-white">
                        {badge.title}
                      </span>
                    </div>
                    <p className="mt-1 font-body text-[11px] text-white/70 leading-snug">
                      {badge.desc}
                    </p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-label font-bold uppercase tracking-wider bg-white/10 text-white/90">
                      {badge.tag}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Scroll Cue */}
        <div className="mt-16 flex flex-col items-center justify-center gap-2 text-center">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-white/40">
            SCROLL TO EXPLORE THE EVIDENCE
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-5 h-9 rounded-full border border-white/20 flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-2 rounded-full bg-[#A8FF3E]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
