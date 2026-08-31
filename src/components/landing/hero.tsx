import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative border-b-2 border-[#1A1A1A]">
      {/* Background pattern: horizontal lines */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1A1A1A 0, #1A1A1A 1px, transparent 1px, transparent 8px)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-32">
        <p className="font-label text-xs uppercase tracking-widest text-[#8A8A7A]">
          01 / WARDROBE
        </p>

        <h1 className="mt-6 font-display text-6xl font-bold leading-[0.9] tracking-tight md:text-[10rem]">
          YOUR
          <br />
          WARDROBE.
          <br />
          <span className="text-[#FF6B35]">NO</span> EXCUSES.
        </h1>

        <p className="mt-8 max-w-md font-body text-lg leading-relaxed text-[#1A1A1A]">
          Tag every piece. Know what you own. Wear more of it.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a href="/signup">START FREE →</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/login">LOG IN</a>
          </Button>
        </div>

        {/* Decorative tag element */}
        <div className="mt-16 hidden md:block">
          <div className="inline-block border-2 border-[#1A1A1A] bg-[#A8FF3E] px-4 py-2">
            <p className="font-label text-[11px] uppercase tracking-widest text-[#1A1A1A]">
              ◉ CARE: 100% COTTON / WASH COLD
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
