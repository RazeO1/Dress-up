"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EyeOff, Zap, Copy, Sparkles, Check, ArrowRight, ShieldCheck } from "lucide-react"

const TRAPS = [
  {
    id: "invisibility",
    number: "01",
    name: "THE INVISIBILITY EFFECT",
    icon: EyeOff,
    badge: "PSYCHOLOGICAL TRAP",
    color: "#CA9FFF",
    problem: "Folded at the bottom = non-existent.",
    description:
      "When clothing is folded into deep drawers or obscured behind coats, working memory drops to zero. You only wear the top 3 garments you can physically see.",
    solution: "Instant Pocket Digital Twin",
    solutionDetails:
      "TAG creates a clean, searchable index of every single hanger and shelf. You can browse your entire collection in seconds from anywhere.",
    stat: "100% VISIBILITY",
  },
  {
    id: "impulse",
    number: "02",
    name: "THE FLASH-SALE TRAP",
    icon: Zap,
    badge: "BEHAVIORAL TRAP",
    color: "#FAFF00",
    problem: "Bought on discount. Matches nothing you own.",
    description:
      "Discounts trigger artificial urgency. You buy an isolated piece without verifying if it pairs with your existing bottoms, shoes, or outerwear.",
    solution: "Real-Time Wardrobe Cross-Check",
    solutionDetails:
      "Pull up TAG while in the fitting room or shopping cart. Test pairing compatibility in 5 seconds before spending a dollar.",
    stat: "$840 SAVED / YEAR",
  },
  {
    id: "duplicates",
    number: "03",
    name: "THE DUPLICATE PURCHASE LOOP",
    icon: Copy,
    badge: "INVENTORY TRAP",
    color: "#A8FF3E",
    problem: "Bought black crewneck #4 because #1-#3 were buried.",
    description:
      "Without a clear inventory, people subconsciously gravitate towards repeating comfort purchases, accumulating near-identical pieces.",
    solution: "Strict Taxonomy & Hue Tracking",
    solutionDetails:
      "Instant breakdown of your pieces across tops, bottoms, outerwear, shoes, and accessories. Never accidentally buy another duplicate item.",
    stat: "ZERO GHOST BUYS",
  },
  {
    id: "singlewear",
    number: "04",
    name: "THE SINGLE-WEAR GRAVEYARD",
    icon: Sparkles,
    badge: "FINANCIAL TRAP",
    color: "#FF8E8E",
    problem: "A $200 outfit worn once for 4 hours.",
    description:
      "Special event garments sit in garment bags forever because there is no reminder or incentive to style them into regular high-rotation outfits.",
    solution: "Cost-Per-Wear Gamification",
    solutionDetails:
      "TAG calculates real-time Cost-Per-Wear (CPW) and surfaces forgotten pieces, encouraging you to re-wear, re-style, and lower your cost to cents.",
    stat: "CPW TO UNDER $5",
  },
]

export function DeceptivePatterns() {
  const [activeTrapId, setActiveTrapId] = useState(TRAPS[0].id)
  const activeTrap = TRAPS.find((t) => t.id === activeTrapId) || TRAPS[0]

  return (
    <section
      id="patterns"
      className="relative bg-[#08090C] text-white py-24 sm:py-32 border-b border-white/10 patternbreak-grid overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-label text-white/70 uppercase tracking-[0.25em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#CA9FFF]" />
            <span>02 // THE DECEPTIVE PATTERNS</span>
          </div>

          <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white">
            THE TRAPS KEEPING YOUR CLOSET IN CHAOS.
          </h2>

          <p className="mt-4 font-body text-sm sm:text-base text-white/70 leading-relaxed">
            Fast consumption is engineered around unconscious behavior. Click each pattern below to
            see how it traps you, and how TAG shatters it.
          </p>
        </div>

        {/* Interactive Layout: Left Selector Cards, Right High-Impact Breakdown Canvas */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Trap Selector Pills / Cards */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {TRAPS.map((trap) => {
              const Icon = trap.icon
              const isSelected = trap.id === activeTrapId

              return (
                <button
                  key={trap.id}
                  onClick={() => setActiveTrapId(trap.id)}
                  className={`text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                    isSelected
                      ? "bg-[#141822] border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] scale-[1.02]"
                      : "bg-[#0E1015]/60 border-white/10 hover:border-white/20 hover:bg-[#12141A]"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl shrink-0 transition-colors ${
                      isSelected ? "bg-white/10 text-white" : "bg-white/5 text-white/40"
                    }`}
                    style={{ color: isSelected ? trap.color : undefined }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-label text-[10px] uppercase tracking-wider text-white/50">
                        TRAP {trap.number}
                      </span>
                      {isSelected && (
                        <span
                          className="h-2 w-2 rounded-full animate-ping"
                          style={{ backgroundColor: trap.color }}
                        />
                      )}
                    </div>
                    <h3 className="mt-1 font-label text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
                      {trap.name}
                    </h3>
                    <p className="mt-1 font-body text-xs text-white/60 line-clamp-1">
                      {trap.problem}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right Column: PatternBreak Live Diagnostic Screen */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTrap.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 sm:p-10 rounded-3xl bg-[#12151D] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between min-h-[460px]"
              >
                {/* Top Diagnostics Header */}
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${activeTrap.color}20`,
                          color: activeTrap.color,
                        }}
                      >
                        {activeTrap.badge}
                      </span>
                      <span className="font-label text-xs text-white/40 uppercase tracking-widest">
                        {"//"} {activeTrap.number}
                      </span>
                    </div>
                    <div className="font-label text-xs uppercase tracking-wider text-[#A8FF3E] flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span>{activeTrap.stat}</span>
                    </div>
                  </div>

                  {/* The Problem Statement */}
                  <div className="mt-8">
                    <span className="font-label text-[10px] uppercase tracking-[0.25em] text-red-400 font-bold block">
                      THE PATTERN
                    </span>
                    <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold uppercase text-white leading-tight">
                      &ldquo;{activeTrap.problem}&rdquo;
                    </h3>
                    <p className="mt-3 font-body text-sm text-white/70 leading-relaxed">
                      {activeTrap.description}
                    </p>
                  </div>
                </div>

                {/* The TAG Solution Box */}
                <div className="mt-8 pt-6 border-t border-white/10 rounded-2xl bg-white/[0.03] p-5 sm:p-6 border border-white/10">
                  <div className="flex items-center gap-2 text-[#A8FF3E] font-label text-xs font-bold uppercase tracking-wider">
                    <Check className="h-4 w-4" />
                    <span>THE PATTERN BREAK — HOW TAG FIXES THIS</span>
                  </div>

                  <h4 className="mt-2 font-display text-lg sm:text-xl font-bold uppercase text-white">
                    {activeTrap.solution}
                  </h4>

                  <p className="mt-2 font-body text-xs sm:text-sm text-white/80 leading-relaxed">
                    {activeTrap.solutionDetails}
                  </p>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs font-label">
                    <span className="text-white/40 uppercase tracking-wider">
                      STATUS: PATTERN SHATTERED
                    </span>
                    <span className="text-[#A8FF3E] flex items-center gap-1">
                      TAG ACTIVE <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
