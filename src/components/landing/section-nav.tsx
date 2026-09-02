"use client"

interface SectionNavProps {
  current: number
  total: number
}

export function SectionNav({ current, total }: SectionNavProps) {
  const padded = String(current).padStart(2, "0")
  const totalStr = String(total).padStart(2, "0")

  return (
    <div
      className="pointer-events-none fixed left-6 top-8 z-[55] font-label text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A] mix-blend-difference md:left-10 md:top-10"
      aria-hidden
    >
      <span className="font-semibold text-[#FFF8F0]">{padded}</span>
      <span className="mx-1 text-[#FFF8F0]/40">/</span>
      <span className="text-[#FFF8F0]/40">{totalStr}</span>
    </div>
  )
}
