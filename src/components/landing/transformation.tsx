"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles, Scan, Layers, CheckCircle } from "lucide-react"

export function Transformation() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98])
  const scanLineY = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"])

  return (
    <section
      ref={containerRef}
      id="transformation"
      className="relative bg-[#07080B] text-white py-24 sm:py-36 border-b border-white/10 patternbreak-grid overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#A8FF3E]/10 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#CA9FFF]/10 blur-[150px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-label text-white/70 uppercase tracking-[0.25em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A8FF3E] animate-pulse" />
            <span>03 // THE TRANSFORMATION</span>
          </div>

          <h2 className="mt-4 font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-tight">
            ORDER OUT OF CHAOS.
          </h2>

          <p className="mt-4 font-body text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            From tangled heaps and forgotten hangers to a high-fidelity digital closet.
            Every item cataloged, tagged, and ready to wear.
          </p>
        </div>

        {/* Cinematic Video Showcase Container */}
        <motion.div
          style={{ scale: videoScale }}
          className="mt-14 relative mx-auto max-w-5xl rounded-[36px] sm:rounded-[44px] bg-[#111319] border border-white/20 p-3 sm:p-4 shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_50px_rgba(168,255,62,0.15)] overflow-hidden"
        >
          {/* Inner Video Window */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-black">
            {/* The Order Video */}
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/hero-order.mp4" type="video/mp4" />
            </video>

            {/* Dark gradient vignette for readability */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

            {/* Animated Laser Scanning Line */}
            <motion.div
              style={{ top: scanLineY }}
              className="pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#A8FF3E] to-transparent shadow-[0_0_15px_#A8FF3E]"
            />

            {/* Top Bar HUD */}
            <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-label text-white uppercase tracking-widest">
                <Scan className="h-3 w-3 text-[#A8FF3E] animate-spin" style={{ animationDuration: "6s" }} />
                <span>AI AUTO-CROP & CLASSIFIER // ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-label text-[#CA9FFF] uppercase tracking-widest">
                <Layers className="h-3 w-3" />
                <span>STATE: COMPLETE ORDER</span>
              </div>
            </div>

            {/* Floating Live Garment HUD Tag 1 (Top Left) */}
            <div className="hidden sm:block absolute top-20 left-6 z-20 p-3.5 rounded-2xl bg-[#0D0F14]/85 backdrop-blur-xl border border-white/20 shadow-2xl max-w-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="font-label text-[9px] uppercase tracking-wider text-[#A8FF3E] font-bold">
                  TAGGED GARMENT #0412
                </span>
                <span className="h-2 w-2 rounded-full bg-[#A8FF3E]" />
              </div>
              <div className="mt-1 font-display text-sm font-bold text-white uppercase">
                TAILORED WOOL OVERCOAT
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] font-label text-white/70">
                <span className="px-2 py-0.5 rounded bg-white/10">OUTERWEAR</span>
                <span>CPW: $12.50</span>
                <span className="text-[#A8FF3E]">16 WEARS</span>
              </div>
            </div>

            {/* Floating Live Garment HUD Tag 2 (Bottom Right) */}
            <div className="hidden sm:block absolute bottom-20 right-6 z-20 p-3.5 rounded-2xl bg-[#0D0F14]/85 backdrop-blur-xl border border-white/20 shadow-2xl max-w-xs text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="h-2 w-2 rounded-full bg-[#CA9FFF]" />
                <span className="font-label text-[9px] uppercase tracking-wider text-[#CA9FFF] font-bold">
                  TAGGED GARMENT #0188
                </span>
              </div>
              <div className="mt-1 font-display text-sm font-bold text-white uppercase">
                JAPANESE SELVEDGE DENIM
              </div>
              <div className="mt-2 flex items-center justify-end gap-2 text-[10px] font-label text-white/70">
                <span className="text-[#A8FF3E]">ROTATION: HIGH</span>
                <span>CPW: $4.20</span>
                <span className="px-2 py-0.5 rounded bg-white/10">BOTTOMS</span>
              </div>
            </div>

            {/* Bottom HUD Bar */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-black/65 backdrop-blur-lg border border-white/15">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#A8FF3E]/20 text-[#A8FF3E]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold uppercase text-white">
                    ZERO BACKGROUND CLUTTER. PURE DIGITAL WARDROBE.
                  </h4>
                  <p className="font-body text-xs text-white/70">
                    Snap anywhere. TAG auto-erases your bed or carpet, leaving only the garment.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#A8FF3E] text-[#08090C] font-label text-[10px] uppercase tracking-wider font-bold">
                  <CheckCircle className="h-3 w-3" />
                  100% INVENTORY CONTROL
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Comparative Flow Strip */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="font-label text-[10px] uppercase tracking-widest text-red-400">
              STEP 01 // BEFORE
            </span>
            <h4 className="mt-2 font-display text-base font-bold uppercase text-white">
              DISORGANIZED PILES
            </h4>
            <p className="mt-1 font-body text-xs text-white/60">
              Buried hangers, forgotten drawers, zero awareness.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#A8FF3E]/10 border border-[#A8FF3E]/30 text-center shadow-[0_0_30px_rgba(168,255,62,0.1)]">
            <span className="font-label text-[10px] uppercase tracking-widest text-[#A8FF3E]">
              STEP 02 // TAG SCAN
            </span>
            <h4 className="mt-2 font-display text-base font-bold uppercase text-white">
              INSTANT AUTO-CROP
            </h4>
            <p className="mt-1 font-body text-xs text-white/80">
              Auto-crop background in seconds, assign taxonomy.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="font-label text-[10px] uppercase tracking-widest text-[#CA9FFF]">
              STEP 03 // AFTER
            </span>
            <h4 className="mt-2 font-display text-base font-bold uppercase text-white">
              HIGH-ROTATION WARDROBE
            </h4>
            <p className="mt-1 font-body text-xs text-white/60">
              Mix, match, and re-wear with cost-per-wear intelligence.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
