"use client"

import { Hero } from "@/components/landing/hero"
import { Manifesto } from "@/components/landing/manifesto"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Categories } from "@/components/landing/categories"
import { CtaSection } from "@/components/landing/cta"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      {/* Hero owns its own pin-scrub: 300vh container, sticky inner, scroll drives the animation */}
      <Hero />

      <Manifesto />
      <HowItWorks />
      <Categories />
      <CtaSection />
    </main>
  )
}
