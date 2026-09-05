"use client"

import { Hero } from "@/components/landing/hero"
import { Manifesto } from "@/components/landing/manifesto"
import { HowItWorks } from "@/components/landing/how-it-works"
import { OrderVideo } from "@/components/landing/order-video"
import { Categories } from "@/components/landing/categories"
import { CtaSection } from "@/components/landing/cta"
import { LandingNav } from "@/components/landing/landing-nav"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      <LandingNav />
      <Hero />

      <div id="manifesto">
        <Manifesto />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="order-video">
        <OrderVideo />
      </div>
      <div id="categories">
        <Categories />
      </div>
      <div id="cta">
        <CtaSection />
      </div>
    </main>
  )
}
