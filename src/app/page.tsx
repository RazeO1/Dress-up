import { Hero } from "@/components/landing/hero"
import { Manifesto } from "@/components/landing/manifesto"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Categories } from "@/components/landing/categories"
import { CtaSection } from "@/components/landing/cta"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      {/* Hero: shadergradient bg + 3D tag + cinematic loader */}
      <Hero />

      {/* Manifesto: oversized serif word reveal */}
      <Manifesto />

      {/* How It Works: scroll-pinned 3-step */}
      <HowItWorks />

      {/* Categories: horizontal drag-scroll gallery */}
      <Categories />

      {/* CTA + Footer */}
      <CtaSection />
    </main>
  )
}
