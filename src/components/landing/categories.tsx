const categories = [
  "TOPS",
  "BOTTOMS",
  "DRESSES",
  "OUTERWEAR",
  "SHOES",
  "ACCESSORIES",
]

export function Categories() {
  return (
    <section className="border-b-2 border-[#1A1A1A]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="font-label text-xs uppercase tracking-widest text-[#8A8A7A]">
          03 / CATEGORIES
        </p>

        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-6xl">
          EVERYTHING.
          <br />
          IN ONE PLACE.
        </h2>

        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat}
              className="border-2 border-[#1A1A1A] bg-[#FFF8F0] px-5 py-3 font-label text-xs uppercase tracking-widest text-[#1A1A1A]"
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Decorative bottom element */}
        <div className="mt-12 border-t-2 border-[#1A1A1A] pt-6">
          <p className="font-body text-sm text-[#8A8A7A]">
            No more "I have nothing to wear." You know exactly what you have.
          </p>
        </div>
      </div>
    </section>
  )
}
