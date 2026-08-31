import { Camera, Filter, Repeat } from "lucide-react"

const features = [
  {
    icon: Camera,
    label: "UPLOAD",
    title: "Clip photo. Auto-crop.",
    description: "Drop a photo, the background disappears. Your piece, ready to tag.",
  },
  {
    icon: Filter,
    label: "ORGANIZE",
    title: "Sort by category.",
    description: "Tops, bottoms, dresses, outerwear, shoes, accessories. Tag once, find forever.",
  },
  {
    icon: Repeat,
    label: "WEAR MORE",
    title: "Track what's in rotation.",
    description: "See what you own, see what you forget. Wear more of the good stuff.",
  },
]

export function Features() {
  return (
    <section className="border-b-2 border-[#1A1A1A]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="font-label text-xs uppercase tracking-widest text-[#8A8A7A]">
          02 / FEATURES
        </p>

        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-6xl">
          03 WAYS TO
          <br />
          KNOW YOUR CLOSET.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.label}
                className="group relative border-2 border-[#1A1A1A] bg-[#FFF8F0] p-6 transition-all hover:bg-[#A8FF3E] hover:shadow-[6px_6px_0_#1A1A1A] hover:-translate-x-1 hover:-translate-y-1"
              >
                <p className="font-label text-[11px] uppercase tracking-widest text-[#8A8A7A] group-hover:text-[#1A1A1A]">
                  0{i + 1} {feature.label}
                </p>
                <Icon className="mt-4 h-8 w-8 text-[#1A1A1A]" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-[#1A1A1A]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
