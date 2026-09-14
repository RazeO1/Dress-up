"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Sparkles } from "lucide-react"
import Link from "next/link"

const CATEGORIES = [
  {
    id: "tops",
    index: "01",
    name: "TOPS",
    tagline: "BASE LAYERS & KNITS",
    description: "T-shirts, structured shirts, knitwear, hoodies, and base essentials.",
    accent: "#CA9FFF",
    samplePieces: ["Heavyweight Boxy Tee", "Cashmere Rollneck", "Oxford Button-Down"],
    count: "42 pieces avg.",
  },
  {
    id: "bottoms",
    index: "02",
    name: "BOTTOMS",
    tagline: "SILHOUETTES & STRUCTURE",
    description: "Pleated trousers, raw denim, relaxed shorts, skirts, and tailored cuts.",
    accent: "#A8FF3E",
    samplePieces: ["Selvedge Wide Denim", "Wool Tailored Trousers", "Cargo Shorts"],
    count: "24 pieces avg.",
  },
  {
    id: "dresses",
    index: "03",
    name: "DRESSES",
    tagline: "ONE-PIECE ARCHITECTURE",
    description: "Full-body silhouettes, slip dresses, evening cuts, and casual daywear.",
    accent: "#FF9FDE",
    samplePieces: ["Silk Slip Dress", "Ribbed Column Knit", "Pleated Midi"],
    count: "16 pieces avg.",
  },
  {
    id: "outerwear",
    index: "04",
    name: "OUTERWEAR",
    tagline: "SHELLS & TAILORING",
    description: "Overcoats, blazers, trench coats, bombers, leather, and technical shells.",
    accent: "#70CFFF",
    samplePieces: ["Oversized Wool Coat", "Double-Breasted Blazer", "Down Puffer"],
    count: "14 pieces avg.",
  },
  {
    id: "shoes",
    index: "05",
    name: "SHOES",
    tagline: "FOUNDATION & FORM",
    description: "Chunky loafers, vintage runners, formal derbies, boots, and sandals.",
    accent: "#FAFF00",
    samplePieces: ["Commando Sole Loafers", "Minimalist Sneakers", "Chelsea Boots"],
    count: "18 pieces avg.",
  },
  {
    id: "accessories",
    index: "06",
    name: "ACCESSORIES",
    tagline: "ACCENTS & UTILITY",
    description: "Leather bags, eyewear, belts, watches, scarves, and daily jewelry.",
    accent: "#FFF8F0",
    samplePieces: ["Structured Leather Tote", "Acetate Sunglasses", "Silver Signet"],
    count: "30 pieces avg.",
  },
]

export function CategorySpectrum() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <section
      id="categories"
      className="relative bg-[#08090C] text-white py-24 sm:py-32 border-b border-white/10 patternbreak-grid overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-10 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-label text-white/70 uppercase tracking-[0.25em]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A8FF3E]" />
              <span>05 // THE SIX TAXONOMIES</span>
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white">
              EVERY PIECE IN ITS PLACE.
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-white/70 max-w-md leading-relaxed">
            TAG categorizes every item into six clean pillars. Fast to sort, instant to search, and
            impossible to lose track of.
          </p>
        </div>

        {/* 6 Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const isHovered = activeCategory === cat.id

            return (
              <motion.div
                key={cat.id}
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-3xl bg-[#111319]/80 border border-white/10 p-7 sm:p-8 backdrop-blur-md flex flex-col justify-between min-h-[340px] hover:border-white/30 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
              >
                {/* Glow accent */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                  style={{ backgroundColor: cat.accent }}
                />

                <div>
                  {/* Category Top Meta */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <span className="font-label text-xs uppercase tracking-widest text-white/50">
                      {cat.index} {"//"} TAXONOMY
                    </span>
                    <span
                      className="font-label text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${cat.accent}15`, color: cat.accent }}
                    >
                      {cat.count}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mt-6">
                    <span
                      className="font-label text-[10px] uppercase tracking-[0.2em] font-bold block"
                      style={{ color: cat.accent }}
                    >
                      {cat.tagline}
                    </span>
                    <h3 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                      {cat.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="mt-3 font-body text-xs text-white/70 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Sample Tags at Bottom */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="font-label text-[9px] uppercase tracking-widest text-white/40 mb-2">
                    TYPICAL CATALOG PIECES:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.samplePieces.map((piece, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-label text-white/80"
                      >
                        {piece}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Action Prompt */}
        <div className="mt-12 text-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-label text-xs uppercase tracking-widest transition-all"
          >
            <span>CATALOG YOUR FIRST 10 PIECES TODAY</span>
            <ArrowUpRight className="h-4 w-4 text-[#A8FF3E] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
