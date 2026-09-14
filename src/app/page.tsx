"use client"

import { LandingNav } from "@/components/landing/landing-nav"
import { Hero } from "@/components/landing/hero"
import { KineticStats } from "@/components/landing/kinetic-stats"
import { DeceptivePatterns } from "@/components/landing/deceptive-patterns"
import { Transformation } from "@/components/landing/transformation"
import { StackingSystem } from "@/components/landing/stacking-system"
import { CategorySpectrum } from "@/components/landing/category-spectrum"
import { CtaSection } from "@/components/landing/cta"
import { FloatingDock } from "@/components/landing/floating-dock"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08090C] text-white selection:bg-[#A8FF3E] selection:text-[#08090C]">
      {/* Top Header Navigation */}
      <LandingNav />

      {/* Act 1: The Wardrobe Paradox & Chaos */}
      <Hero />

      {/* Act 2: The Staggering Reality (The Data Wall) */}
      <KineticStats />

      {/* Act 3: The Deceptive Traps (Interactive Pattern Breakers) */}
      <DeceptivePatterns />

      {/* Act 4: The Transformation (Order Out Of Chaos) */}
      <Transformation />

      {/* Act 5: The TAG Operating System (Stacking Drawers) */}
      <StackingSystem />

      {/* Act 6: The Six Taxonomies (Interactive Category Deck) */}
      <CategorySpectrum />

      {/* Act 7: Grand Finale CTA & Footer */}
      <CtaSection />

      {/* PatternBreak Floating Capsule Dock */}
      <FloatingDock />
    </main>
  )
}
