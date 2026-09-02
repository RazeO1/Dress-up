"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative bg-[#1A1A1A] py-24 md:py-36">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #FFF8F0 0, #FFF8F0 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #FFF8F0 0, #FFF8F0 1px, transparent 1px, transparent 60px)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.p
          className="font-label text-[10px] uppercase tracking-[0.3em] text-[#8A8A7A]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          04 / START TODAY
        </motion.p>

        <motion.h2
          className="mt-6 font-editorial text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight text-[#FFF8F0] md:text-[clamp(3rem,7vw,6rem)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Your wardrobe
          <br />
          <span className="italic text-[#A8FF3E]">is waiting.</span>
        </motion.h2>

        <motion.p
          className="mx-auto mt-6 max-w-md font-body text-base text-[#8A8A7A]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Tag your closet. See what you own. Wear more of it.
          Free, forever. No credit card required.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-[#A8FF3E] text-[#1A1A1A] hover:bg-[#8AE83A] font-semibold px-10"
          >
            <a href="/signup">
              Start free
              <span className="ml-2">→</span>
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative mt-24 border-t border-[#FFF8F0]/10 pt-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <p className="font-editorial text-xl font-bold text-[#FFF8F0]">TAG</p>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#8A8A7A]">
            © 2026 TAG — Wardrobe, in order.
          </p>
          <div className="flex gap-6">
            <a href="/login" className="font-label text-[10px] uppercase tracking-[0.15em] text-[#8A8A7A] hover:text-[#FFF8F0] transition-colors">
              Log in
            </a>
            <a href="/signup" className="font-label text-[10px] uppercase tracking-[0.15em] text-[#8A8A7A] hover:text-[#FFF8F0] transition-colors">
              Sign up
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
