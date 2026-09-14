"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { TrendingDown, PieChart, Clock, DollarSign, CheckCircle2 } from "lucide-react"

const STATS_DATA = [
  {
    number: "73%",
    label: "UNWORN INVENTORY",
    highlight: "Sits untouched >12 months",
    desc: "Nearly three-quarters of the average closet hangs dormant, forgotten behind front-facing basics.",
    icon: TrendingDown,
    color: "#CA9FFF",
    subMetric: "With TAG: 78% active rotation",
  },
  {
    number: "80/20",
    label: "THE CLOSET RATIO",
    highlight: "20% of clothes make 80% of fits",
    desc: "We default to the exact same 6-8 pieces every week simply because the rest are out of sight.",
    icon: PieChart,
    color: "#A8FF3E",
    subMetric: "Break the loop with digital visibility",
  },
  {
    number: "12 MIN",
    label: "DECISION FATIGUE",
    highlight: "Lost every single morning",
    desc: "Standing paralyzed in front of overflowing racks creates morning anxiety and repetitive rut styling.",
    icon: Clock,
    color: "#FFF8F0",
    subMetric: "Curate looks in 30 seconds",
  },
  {
    number: "$1,200",
    label: "DUPLICATE WASTE",
    highlight: "Annual spend on forgotten clothes",
    desc: "Buying black tees, neutral knits, or coats that match pieces you already own at home.",
    icon: DollarSign,
    color: "#FAFF00",
    subMetric: "Average $840 saved in year one",
  },
]

export function KineticStats() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      ref={ref}
      id="stats"
      className="relative bg-[#0A0C10] text-white py-24 sm:py-32 border-t border-b border-white/10 patternbreak-grid overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 right-1/4 w-[500px] h-[500px] bg-[#CA9FFF]/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-[#A8FF3E]/10 blur-[150px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-label text-white/70 uppercase tracking-[0.25em]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A8FF3E]" />
              <span>01 // THE INVENTORY CRISIS</span>
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white max-w-2xl">
              THE HARD TRUTH BEHIND YOUR CLOSET.
            </h2>
          </div>
          <p className="font-body text-sm sm:text-base text-white/70 max-w-md leading-relaxed">
            Fast fashion conditioned us to treat clothes as disposable micro-events.
            The consequence is closet paralysis: immense inventory, near-zero awareness.
          </p>
        </div>

        {/* 4 Kinetic Stat Blocks Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_DATA.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative p-6 sm:p-8 rounded-3xl bg-[#12141B]/70 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:border-white/25 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              >
                {/* Accent top line */}
                <div
                  className="absolute top-0 left-8 right-8 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: item.color }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label text-[10px] uppercase tracking-[0.25em] text-white/50">
                      METRIC 0{idx + 1}
                    </span>
                    <div
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Huge Number */}
                  <div className="mt-6">
                    <span
                      className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight"
                      style={{ color: item.color }}
                    >
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-3 font-label text-xs uppercase tracking-widest font-semibold text-white">
                    {item.label}
                  </h3>

                  <p className="mt-1 font-body text-xs font-medium text-white/90">
                    {item.highlight}
                  </p>

                  <p className="mt-3 font-body text-xs text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Result Pill */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] font-label text-[#A8FF3E]">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.subMetric}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Narrative Callout Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#CA9FFF]/20 border border-[#CA9FFF]/30 flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-lg text-[#CA9FFF]">≠</span>
            </div>
            <div>
              <h4 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                THE SOLUTION IS NOT BUYING A BIGGER CLOSET.
              </h4>
              <p className="font-body text-xs sm:text-sm text-white/60">
                It’s turning blind accumulation into searchable, organized inventory intelligence.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right font-label text-xs">
              <span className="text-white/40 uppercase tracking-wider block">UTILIZATION GOAL</span>
              <span className="text-[#A8FF3E] font-bold text-sm">70%+ WEAR RATE</span>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="h-3 w-28 bg-white/10 rounded-full overflow-hidden p-0.5">
              <div className="h-full w-4/5 bg-[#A8FF3E] rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
