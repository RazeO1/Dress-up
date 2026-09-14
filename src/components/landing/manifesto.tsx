"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

const STATEMENT = "You own more than you wear."
const WORDS = STATEMENT.split(" ")

interface ManifestoProps {
  /** When true, the component is inside the hero-to-manifesto slide panel — uses fixed full-screen layout and inView-based kinetic reveal */
  inSlidePanel?: boolean
  /** Optional scroll progress from the parent (used when manifesto fills a hero-overlap container) */
  scrollYProgress?: ReturnType<typeof useScroll>["scrollYProgress"]
}

export function Manifesto({ inSlidePanel = false, scrollYProgress: externalProgress }: ManifestoProps) {
  const ref = useRef<HTMLElement>(null)

  // When NOT in slide panel (standalone section mode): use scroll-driven reveal
  const { scrollYProgress: ownProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // When IN slide panel: use inView trigger for the kinetic letters
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Prefer external (parent container) progress when provided — keeps kinetic reveal
  // synced with the hero's zoom-scroll distance
  const scrollYProgress = externalProgress ?? ownProgress

  return (
    <section
      ref={ref}
      className={
        inSlidePanel
          ? "relative flex h-full w-full items-center justify-center bg-[#1A1A1A] px-6 md:px-12"
          : "relative flex min-h-screen items-center bg-[#FFF8F0] px-6 md:px-12"
      }
    >
      <div className="mx-auto max-w-7xl w-full">
        {/* Section label */}
        <motion.p
          className={
            inSlidePanel
              ? "mb-6 font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]"
              : "mb-8 font-label text-[10px] uppercase tracking-[0.25em] text-[#8A8A7A]"
          }
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          01 / VISION
        </motion.p>

        {/* Kinetic word reveal */}
        <h2 className={
          inSlidePanel
            ? "font-editorial text-[clamp(2rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight text-[#FFF8F0] md:text-[clamp(3rem,8vw,7rem)]"
            : "font-editorial text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[1.05] tracking-tight text-[#1A1A1A] md:text-[clamp(3.5rem,9vw,8rem)]"
        }>
          {WORDS.map((word, wi) => {
            const chars = word.split("")
            return (
              <span key={wi} className="mr-[0.25em] inline-block">
                {chars.map((char, ci) => {
                  let globalIndex = 0
                  for (let i = 0; i < wi; i++) globalIndex += WORDS[i].length
                  globalIndex += ci
                  const totalGlobalChars = STATEMENT.replace(/ /g, "").length
                  const charProgress = globalIndex / totalGlobalChars
                  const enterStart = 0.1 + charProgress * 0.25
                  const enterEnd = enterStart + 0.04
                  return inSlidePanel ? (
                    <PanelKineticLetter
                      key={`${wi}-${ci}`}
                      char={char}
                      isInView={isInView}
                      charDelay={charProgress * 0.6}
                    />
                  ) : (
                    <SectionKineticLetter
                      key={`${wi}-${ci}`}
                      char={char}
                      scrollYProgress={scrollYProgress}
                      enterStart={enterStart}
                      enterEnd={enterEnd}
                    />
                  )
                })}
              </span>
            )
          })}
        </h2>
      </div>
    </section>
  )
}

function PanelKineticLetter({
  char,
  isInView,
  charDelay,
}: {
  char: string
  isInView: boolean
  charDelay: number
}) {
  return (
    <motion.span
      className="mr-[0.05em] inline-block font-editorial"
      initial={{ opacity: 0, y: 30, rotate: 12 }}
      animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: charDelay,
      }}
    >
      {char}
    </motion.span>
  )
}

function SectionKineticLetter({
  char,
  scrollYProgress,
  enterStart,
  enterEnd,
}: {
  char: string
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  enterStart: number
  enterEnd: number
}) {
  const y = useTransform(
    scrollYProgress,
    [Math.max(0, enterStart - 0.08), enterStart, enterEnd, 0.75, 0.95],
    [30, 15, 0, 0, -20]
  )
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, enterStart - 0.08), enterEnd, 0.75, 0.95],
    [0, 1, 1, 0.2]
  )
  const rotate = useTransform(
    scrollYProgress,
    [Math.max(0, enterStart - 0.08), enterEnd],
    [10, 0]
  )

  return (
    <motion.span
      className="mr-[0.05em] inline-block font-editorial"
      style={{ y, opacity, rotate }}
    >
      {char}
    </motion.span>
  )
}
