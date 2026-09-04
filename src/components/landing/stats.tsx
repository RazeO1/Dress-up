"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"

const STATS = [
  { value: 0, suffix: "", label: "minutes to tag a piece", italic: false },
  { value: 6, suffix: "", label: "categories", italic: false },
  { value: 100, suffix: "%", label: "yours, forever", italic: true },
]

function useCountUp(target: number, trigger: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return
    const duration = 1200
    const start = performance.now()
    const tick = () => {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [trigger, target])

  return count
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-30%" })

  return (
    <section ref={ref} className="bg-[#FFF8F0] px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Label */}
        <motion.p
          className="mb-12 font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          06 / BY THE NUMBERS
        </motion.p>

        {/* Stats */}
        <div className="space-y-2">
          {STATS.map((stat, i) => (
            <StatRow key={i} stat={stat} trigger={isInView} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatRow({
  stat,
  trigger,
  index,
}: {
  stat: (typeof STATS)[number]
  trigger: boolean
  index: number
}) {
  const count = useCountUp(stat.value, trigger)

  return (
    <motion.div
      className="flex items-baseline gap-6 border-t border-[#1A1A1A]/10 py-6 md:gap-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Number */}
      <span
        className={`font-editorial font-bold leading-none text-[#1A1A1A] ${
          index === 0
            ? "text-[clamp(4rem,10vw,8rem)]"
            : index === 1
            ? "text-[clamp(6rem,14vw,12rem)]"
            : "text-[clamp(5rem,11vw,9rem)]"
        } ${stat.italic ? "italic" : ""}`}
      >
        {count}
        {stat.suffix}
      </span>

      {/* Label */}
      <span className="font-body text-sm text-[#8A8A7A]">{stat.label}</span>
    </motion.div>
  )
}
