"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Camera, Tags, Sparkles } from "lucide-react"

const STEPS = [
  {
    number: "01",
    Icon: Camera,
    label: "UPLOAD",
    title: "Snap it.",
    subtitle: "Strip the background.",
    description:
      "Drop a photo of any garment. Our auto-crop removes the background — your piece, ready to tag.",
  },
  {
    number: "02",
    Icon: Tags,
    label: "ORGANIZE",
    title: "Sort by category.",
    subtitle: "Tag once.",
    description:
      "Tops, bottoms, dresses, outerwear, shoes, accessories. One tap to sort, forever to find.",
  },
  {
    number: "03",
    Icon: Sparkles,
    label: "WEAR MORE",
    title: "See what you forget.",
    subtitle: "Wear it.",
    description:
      "TAG surfaces your forgotten pieces. Wear more of what you already own.",
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const totalSteps = STEPS.length
  const progressWidth = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${100 / totalSteps}%`]
  )

  return (
    <section
      ref={ref}
      className="relative border-b border-[#1A1A1A]/10 bg-[#FFF8F0] py-24 md:py-32"
    >
      {/* Section header */}
      <div className="mx-auto mb-16 max-w-7xl px-6">
        <p className="font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]">
          02 / HOW IT WORKS
        </p>
        <h2 className="mt-3 font-editorial text-4xl font-bold text-[#1A1A1A] md:text-5xl">
          Three steps.
          <br />
          <span className="text-[#8A8A7A]">Zero excuses.</span>
        </h2>
      </div>

      {/* Progress bar */}
      <div className="mx-auto mb-16 max-w-7xl px-6">
        <div className="h-[2px] w-full bg-[#1A1A1A]/10">
          <motion.div
            className="h-full bg-[#1A1A1A]"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      {/* Steps grid */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-3 md:gap-8">
        {STEPS.map((step) => {
          const { Icon } = step
          return (
            <StepCard key={step.number} step={step}>
              <div className="mb-8">
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#8A8A7A]">
                  {step.number} {step.label}
                </p>
              </div>
              <Icon
                className="mb-6 h-10 w-10 text-[#1A1A1A]"
                strokeWidth={1.5}
              />
              <h3 className="font-editorial text-2xl font-bold text-[#1A1A1A]">
                {step.title}
              </h3>
              <p className="mt-1 font-editorial text-xl italic text-[#8A8A7A]">
                {step.subtitle}
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-[#5A5A4A]">
                {step.description}
              </p>
            </StepCard>
          )
        })}
      </div>
    </section>
  )
}

function StepCard({
  step,
  children,
}: {
  step: (typeof STEPS)[number]
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0])

  return (
    <motion.div
      ref={ref}
      className="border-t-2 border-[#1A1A1A] pt-8"
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  )
}
