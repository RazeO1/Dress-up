"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Camera, Sparkles, Sliders, ArrowUpRight, TrendingDown, Repeat, Layers } from "lucide-react"

const SYSTEM_CARDS = [
  {
    step: "01",
    tag: "SMART DIGITIZATION",
    title: "SNAP IN SECONDS. WE STRIP THE BACKGROUND.",
    subtitle: "Turn messy bedroom photos into studio-grade catalog assets.",
    description:
      "Lay your garment on the bed, rug, or hanger. Our automated background remover extracts the piece with sub-pixel edge fidelity. No photographer required.",
    accent: "#CA9FFF",
    cardBg: "bg-[#11131A]",
    details: [
      "Sub-pixel edge background removal",
      "Automatic taxonomy categorization",
      "Palette and primary hue detection",
      "Metadata tagging: brand, size, season",
    ],
    mockup: {
      type: "digitize",
    },
  },
  {
    step: "02",
    tag: "COST-PER-WEAR METRICS",
    title: "TREAT YOUR CLOTHES LIKE AN ASSET, NOT WASTE.",
    subtitle: "Gamify rewearing and watch your cost-per-wear drop to cents.",
    description:
      "When you buy a $150 jacket and wear it twice, that jacket cost you $75 per wear. Wear it 30 times, and it's $5. TAG tracks every wear so you maximize the value of what you already own.",
    accent: "#A8FF3E",
    cardBg: "bg-[#0E1318]",
    details: [
      "Dynamic Cost-Per-Wear formula",
      "Forgotten garment alert notifications",
      "Closet valuation breakdown",
      "Milestone rewards for 30+ re-wears",
    ],
    mockup: {
      type: "cpw",
    },
  },
  {
    step: "03",
    tag: "CAPSULE & ROTATION ENGINE",
    title: "PAIR OUTFITS WITHOUT MESSING UP YOUR HANGERS.",
    subtitle: "Discover combinations buried in the back of your wardrobe.",
    description:
      "Slide through tops, bottoms, outerwear, and shoes digitally. Create capsule sets for travel, seasons, or work weeks without tearing through drawers every morning.",
    accent: "#FFF8F0",
    cardBg: "bg-[#14151E]",
    details: [
      "Digital hanger outfit builder",
      "Weather & seasonality filters",
      "Travel capsule packing lists",
      "Zero morning decision fatigue",
    ],
    mockup: {
      type: "capsule",
    },
  },
]

export function StackingSystem() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={containerRef}
      id="system"
      className="relative bg-[#07080B] text-white py-24 sm:py-32 border-b border-white/10 patternbreak-grid"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-label text-white/70 uppercase tracking-[0.25em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#CA9FFF]" />
            <span>04 // THE SYSTEM</span>
          </div>

          <h2 className="mt-4 font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-tight">
            THE TAG OPERATING SYSTEM.
          </h2>

          <p className="mt-4 font-body text-base sm:text-lg text-white/70 leading-relaxed">
            Three simple layers engineered to permanently break wardrobe disorganization and impulse buying.
          </p>
        </div>

        {/* Stacking Cards Container */}
        <div className="relative flex flex-col gap-8 lg:gap-12">
          {SYSTEM_CARDS.map((card, idx) => {
            const topSticky = 100 + idx * 30 // PatternBreak stacking offset

            return (
              <div
                key={card.step}
                style={{ top: `${topSticky}px` }}
                className={`sticky rounded-[36px] sm:rounded-[44px] border border-white/15 p-6 sm:p-10 lg:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all ${card.cardBg}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Card Left: Narrative Details */}
                  <div className="lg:col-span-6 flex flex-col justify-between">
                    <div>
                      {/* Step Pill */}
                      <div className="flex items-center gap-3">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-label font-bold uppercase tracking-widest"
                          style={{ backgroundColor: `${card.accent}20`, color: card.accent }}
                        >
                          LAYER {card.step} {"//"} {card.tag}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-5 font-display text-2xl sm:text-4xl lg:text-5xl font-bold uppercase text-white tracking-tight leading-tight">
                        {card.title}
                      </h3>

                      <p className="mt-3 font-editorial text-lg sm:text-xl italic text-white/80">
                        {card.subtitle}
                      </p>

                      <p className="mt-4 font-body text-sm sm:text-base text-white/70 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {card.details.map((detail, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center gap-2 text-xs font-body text-white/80"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: card.accent }}
                          />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Right: Interactive Visual Mockup */}
                  <div className="lg:col-span-6">
                    {card.mockup.type === "digitize" && <DigitizeMockup accent={card.accent} />}
                    {card.mockup.type === "cpw" && <CpwMockup accent={card.accent} />}
                    {card.mockup.type === "capsule" && <CapsuleMockup accent={card.accent} />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function DigitizeMockup({ accent }: { accent: string }) {
  return (
    <div className="relative rounded-3xl bg-black/60 border border-white/15 p-6 overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 text-[10px] font-label text-white/50 uppercase tracking-widest">
        <span>AUTO-CROP ENGINE v2.6</span>
        <span className="text-[#CA9FFF]">AI SEGMENTATION: 99.4%</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Left: Raw Photo */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 text-center">
          <div className="h-36 rounded-xl bg-[#1A1A1A] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#333] to-[#222] opacity-80" />
            <Camera className="h-8 w-8 text-white/30 relative z-10" />
            <span className="relative z-10 font-label text-[9px] uppercase tracking-wider text-white/40 mt-2">
              RAW BED PHOTO
            </span>
          </div>
          <div className="mt-3 text-[10px] font-label text-white/50 uppercase">
            BEFORE: MESSY BACKGROUND
          </div>
        </div>

        {/* Right: Transparent Garment Cutout */}
        <div className="rounded-2xl bg-[#CA9FFF]/10 border border-[#CA9FFF]/30 p-4 text-center shadow-[0_0_20px_rgba(202,159,255,0.15)]">
          <div className="h-36 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="patternbreak-grid absolute inset-0 opacity-40" />
            <div className="relative z-10 px-3 py-1 rounded-full bg-[#CA9FFF] text-[#08090C] font-label text-[10px] font-bold uppercase tracking-wider">
              ISOLATED ASSET
            </div>
            <span className="relative z-10 font-label text-[9px] text-[#CA9FFF] mt-2">
              READY TO TAG
            </span>
          </div>
          <div className="mt-3 text-[10px] font-label text-[#CA9FFF] uppercase font-bold">
            AFTER: PURE WARDROBE DECK
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-label">
        <span className="text-white/60">DETECTED CATEGORY:</span>
        <span className="text-white font-bold uppercase">OUTERWEAR / WOOL COAT</span>
      </div>
    </div>
  )
}

function CpwMockup({ accent }: { accent: string }) {
  return (
    <div className="relative rounded-3xl bg-black/60 border border-white/15 p-6 overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 text-[10px] font-label text-white/50 uppercase tracking-widest">
        <span>COST-PER-WEAR TELEMETRY</span>
        <span className="text-[#A8FF3E]">ROI STATUS: OPTIMAL</span>
      </div>

      <div className="mt-6 space-y-4">
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
          <div>
            <span className="font-label text-[10px] uppercase text-white/50 block">GARMENT</span>
            <span className="font-display text-base font-bold text-white uppercase">
              HEAVYWEIGHT MERINO KNIT
            </span>
          </div>
          <div className="text-right">
            <span className="font-label text-[10px] uppercase text-white/50 block">INITIAL COST</span>
            <span className="font-display text-base font-bold text-white">$140.00</span>
          </div>
        </div>

        {/* Dynamic CPW Metric Scale */}
        <div className="p-5 rounded-2xl bg-[#A8FF3E]/10 border border-[#A8FF3E]/25">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs uppercase tracking-wider text-white/80">
              CURRENT CPW
            </span>
            <span className="font-display text-3xl font-black text-[#A8FF3E]">$4.66</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2.5 w-full bg-black/50 rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-[#A8FF3E] rounded-full w-[85%]" />
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] font-label text-white/60">
            <span>30 WEARS LOGGED</span>
            <span className="text-[#A8FF3E] font-bold">GOAL: 35 WEARS</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-label text-white/70">
        <TrendingDown className="h-4 w-4 text-[#A8FF3E]" />
        <span>Cost decreased by 96.6% from purchase date.</span>
      </div>
    </div>
  )
}

function CapsuleMockup({ accent }: { accent: string }) {
  return (
    <div className="relative rounded-3xl bg-black/60 border border-white/15 p-6 overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 text-[10px] font-label text-white/50 uppercase tracking-widest">
        <span>CAPSULE ROTATION ENGINE</span>
        <span className="text-[#FFF8F0]">HARMONY: 98% MATCH</span>
      </div>

      <div className="mt-6 space-y-3">
        {/* Layer 1: Outerwear */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <span className="font-label text-xs uppercase text-white/50">01 / TOP LAYER</span>
          <span className="font-display text-xs font-bold text-white uppercase">
            OVERSIZED TRENCH COAT
          </span>
          <span className="font-label text-[10px] text-[#CA9FFF]">#0412</span>
        </div>

        {/* Layer 2: Base */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <span className="font-label text-xs uppercase text-white/50">02 / BASE LAYER</span>
          <span className="font-display text-xs font-bold text-white uppercase">
            HEAVY RIB KNIT CREW
          </span>
          <span className="font-label text-[10px] text-[#A8FF3E]">#0208</span>
        </div>

        {/* Layer 3: Bottoms */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <span className="font-label text-xs uppercase text-white/50">03 / BOTTOM</span>
          <span className="font-display text-xs font-bold text-white uppercase">
            WIDE-LEG PLEATED TROUSERS
          </span>
          <span className="font-label text-[10px] text-white">#0314</span>
        </div>

        {/* Layer 4: Shoes */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <span className="font-label text-xs uppercase text-white/50">04 / FOOTWEAR</span>
          <span className="font-display text-xs font-bold text-white uppercase">
            CHUNKY LEATHER LOAFERS
          </span>
          <span className="font-label text-[10px] text-[#FAFF00]">#0091</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-label">
        <span className="text-white/60">SAVED OUTFIT LOOK:</span>
        <span className="text-[#A8FF3E] font-bold flex items-center gap-1">
          PARIS TRIP CAPSULE <Repeat className="h-3 w-3" />
        </span>
      </div>
    </div>
  )
}
