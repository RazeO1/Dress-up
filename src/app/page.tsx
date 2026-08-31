import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Categories } from "@/components/landing/categories"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8F0] text-[#1A1A1A]">
      <header className="border-b-2 border-[#1A1A1A]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="font-display text-2xl font-bold tracking-tight">
            TAG
          </a>
          <nav className="flex items-center gap-2">
            <a
              href="/login"
              className="px-4 py-2 font-label text-xs uppercase tracking-widest text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-[#A8FF3E]"
            >
              LOG IN
            </a>
            <a
              href="/signup"
              className="border-2 border-[#1A1A1A] bg-[#A8FF3E] px-4 py-2 font-label text-xs uppercase tracking-widest text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-[#A8FF3E]"
            >
              SIGN UP
            </a>
          </nav>
        </div>
      </header>

      <Hero />
      <Features />
      <Categories />

      <footer className="bg-[#1A1A1A] text-[#FFF8F0]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="font-display text-2xl font-bold tracking-tight">TAG</p>
            <p className="font-body text-sm text-[#8A8A7A]">
              © 2026 TAG. Built for people who actually wear their clothes.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
