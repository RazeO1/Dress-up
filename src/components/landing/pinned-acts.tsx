"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const ACTS = [
  {
    number: "01",
    label: "UPLOAD",
    title: "Drop a photo.",
    subtitle: "We strip the background.",
    description:
      "Snap any garment. Our auto-crop removes everything but the piece — ready to tag, instantly.",
  },
  {
    number: "02",
    label: "ORGANIZE",
    title: "Sort by category.",
    subtitle: "Tag once.",
    description:
      "Tops, bottoms, dresses, outerwear, shoes, accessories. One tap to sort, forever to find.",
  },
  {
    number: "03",
    label: "WEAR MORE",
    title: "See what you forget.",
    subtitle: "Wear it.",
    description:
      "TAG surfaces your forgotten pieces. Wear more of what you already own.",
  },
]

export function PinnedActs() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section ref={containerRef} className="relative bg-[#FFF8F0]">
      {/* Section label */}
      <div className="mx-auto max-w-7xl px-6 pt-20">
        <motion.p
          className="font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          03 / HOW IT WORKS
        </motion.p>
      </div>

      {/* Sticky scene container */}
      <div className="relative h-screen">
        {/* Progress rail — left side */}
        <div className="absolute left-8 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-0 md:left-12">
          <div className="relative h-48 w-[1px] bg-[#1A1A1A]/20">
            <motion.div
              className="absolute inset-y-0 left-0 w-full bg-[#1A1A1A]"
              style={{ height: progressWidth }}
            />
          </div>
          {ACTS.map((act, i) => {
            const start = i / ACTS.length
            const end = (i + 1) / ACTS.length
            const mid = (start + end) / 2
            return (
              <motion.div
                key={act.number}
                className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-[#1A1A1A] bg-[#FFF8F0]"
                style={{
                  top: `${(mid * 100)}%`,
                }}
                animate={{
                  backgroundColor: scrollYProgress
                    ? undefined
                    : "#FFF8F0",
                }}
              />
            )
          })}
        </div>

        {/* Acts — scroll-driven */}
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-16 md:px-24">
          {ACTS.map((act, i) => (
            <ActScene
              key={act.number}
              act={act}
              index={i}
              total={ACTS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ActScene({
  act,
  index,
  total,
  scrollYProgress,
}: {
  act: (typeof ACTS)[number]
  index: number
  total: number
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
}) {
  const start = index / total
  const end = (index + 1) / total
  const mid = (start + end) / 2

  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.05), mid - 0.02, mid, Math.min(1, end + 0.05)],
    [0, 0, 1, 0]
  )
  const y = useTransform(scrollYProgress, [mid, end], [0, -20])
  const scale = useTransform(scrollYProgress, [start, mid], [0.96, 1])

  return (
    <motion.div
      className="absolute inset-0 flex items-center px-16 md:px-24"
      style={{ opacity, y, scale }}
    >
      <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        {/* Illustration */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm">
            <ActIllustration index={index} />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center">
          <p className="mb-3 font-label text-[10px] uppercase tracking-[0.3em] text-[#8A8A7A]">
            {act.number} / {act.label}
          </p>
          <h3 className="font-editorial text-5xl font-bold text-[#1A1A1A] md:text-6xl">
            {act.title}
          </h3>
          <p className="mt-1 font-editorial text-3xl italic text-[#8A8A7A] md:text-4xl">
            {act.subtitle}
          </p>
          <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-[#5A5A4A]">
            {act.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function ActIllustration({ index }: { index: number }) {
  if (index === 0) return <UploadIllustration />
  if (index === 1) return <OrganizeIllustration />
  return <WearMoreIllustration />
}

function UploadIllustration() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Phone outline */}
      <rect x="80" y="30" width="140" height="240" rx="20" fill="#FFF8F0" stroke="#1A1A1A" strokeWidth="3" />
      {/* Screen */}
      <rect x="90" y="50" width="120" height="200" rx="8" fill="#1A1A1A" />
      {/* Garment silhouette */}
      <path
        d="M130 100 L110 200 L140 200 L145 150 L155 150 L160 200 L190 200 L170 100 Z"
        fill="#A8FF3E"
        opacity="0.9"
      />
      {/* Scan line */}
      <motion.rect
        x="90"
        y="70"
        width="120"
        height="2"
        fill="#A8FF3E"
        animate={{ y: [70, 250, 70] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* Corner notch */}
      <rect x="135" y="38" width="30" height="6" rx="3" fill="#1A1A1A" />
      {/* Camera dot */}
      <circle cx="150" cy="44" r="3" fill="#8A8A7A" />
    </svg>
  )
}

function OrganizeIllustration() {
  const TAGS = ["TOPS", "BOTTOMS", "DRESSES", "OUTERWEAR", "SHOES", "ACC."]
  const HUES = ["#FFE4CC", "#D4F5D4", "#FFD4E8", "#D4E8FF", "#FFE8D4", "#E8D4FF"]

  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hanging rod */}
      <rect x="30" y="30" width="240" height="6" rx="3" fill="#1A1A1A" />
      {/* Rod ends */}
      <rect x="20" y="26" width="12" height="14" rx="3" fill="#1A1A1A" />
      <rect x="268" y="26" width="12" height="14" rx="3" fill="#1A1A1A" />
      {/* Tags hanging */}
      {TAGS.map((label, i) => {
        const x = 40 + i * 38
        const tagH = 70 + (i % 2) * 20
        return (
          <g key={label} transform={`translate(${x}, 40)`}>
            {/* String */}
            <line x1="18" y1="0" x2="18" y2={tagH - 30} stroke="#1A1A1A" strokeWidth="1" opacity="0.4" />
            {/* Tag */}
            <rect
              x="0"
              y={tagH - 30}
              width="36"
              height={tagH}
              rx="2"
              fill={HUES[i]}
              stroke="#1A1A1A"
              strokeWidth="2"
            />
            {/* Tag hole */}
            <circle cx="18" cy={tagH - 24} r="3" fill="#FFF8F0" />
            {/* Label */}
            <text
              x="18"
              y={tagH + 12}
              textAnchor="middle"
              fontSize="5"
              fontFamily="monospace"
              fill="#1A1A1A"
              fontWeight="700"
            >
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function WearMoreIllustration() {
  const cells = Array.from({ length: 28 }, (_, i) => i)
  const filled = [0, 1, 2, 3, 7, 8, 11, 14, 15, 16, 21, 22, 25]

  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Calendar header */}
      <rect x="30" y="20" width="240" height="40" rx="4" fill="#1A1A1A" />
      {/* Month label */}
      <text x="150" y="47" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#FFF8F0" fontWeight="700">
        SEPTEMBER
      </text>
      {/* Grid */}
      {cells.map((cell, i) => {
        const col = i % 7
        const row = Math.floor(i / 7)
        const x = 30 + col * 34
        const y = 70 + row * 34
        const isFilled = filled.includes(i)

        return (
          <g key={cell}>
            <rect
              x={x + 2}
              y={y + 2}
              width={30}
              height={30}
              rx="2"
              fill={isFilled ? "#A8FF3E" : "#FFF8F0"}
              stroke="#1A1A1A"
              strokeWidth="1.5"
            />
            {isFilled && (
              <path
                d="M{ x + 17 } { y + 17 } L{ x + 10 } { y + 22 }"
                stroke="#1A1A1A"
                strokeWidth="1.5"
              />
            )}
          </g>
        )
      })}
      {/* Day labels */}
      {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
        <text
          key={day + i}
          x={47 + i * 34}
          y={62}
          textAnchor="middle"
          fontSize="8"
          fontFamily="monospace"
          fill="#8A8A7A"
        >
          {day}
        </text>
      ))}
      {/* Legend */}
      <rect x="30" y="280" width="12" height="12" rx="1" fill="#A8FF3E" stroke="#1A1A1A" strokeWidth="1" />
      <text x="48" y="290" fontSize="9" fontFamily="monospace" fill="#5A5A4A">
        worn this month
      </text>
    </svg>
  )
}
