"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const STATEMENT = "You own more than you wear."
const WORDS = STATEMENT.split(" ")

export function Manifesto() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  return (
    <section
      ref={ref}
      className="relative border-b border-[#1A1A1A]/10 bg-[#FFF8F0] py-32 md:py-48"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-editorial text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[1.05] tracking-tight text-[#1A1A1A] md:text-[clamp(3rem,9vw,8rem)]">
          {WORDS.map((word, i) => {
            const start = i / WORDS.length
            const end = (i + 1) / WORDS.length
            return (
              <WordReveal
                key={word + i}
                word={word}
                scrollYProgress={scrollYProgress}
                wordStart={start}
                wordEnd={end}
              />
            )
          })}
        </h2>
      </div>
    </section>
  )
}

function WordReveal({
  word,
  scrollYProgress,
  wordStart,
  wordEnd,
}: {
  word: string
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  wordStart: number
  wordEnd: number
}) {
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, wordStart - 0.1), wordStart + 0.1, wordEnd - 0.05, wordEnd + 0.05],
    [0.15, 1, 1, 0.15]
  )
  const y = useTransform(
    scrollYProgress,
    [Math.max(0, wordStart - 0.1), wordStart, wordEnd, wordEnd + 0.05],
    [20, 0, 0, -10]
  )

  return (
    <motion.span className="mr-[0.3em] inline-block" style={{ opacity, y }}>
      {word}
    </motion.span>
  )
}
