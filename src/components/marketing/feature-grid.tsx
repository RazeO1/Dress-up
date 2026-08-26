import { Shirt, Layers, Sparkles, Lock, Camera, Cloud } from 'lucide-react';

const features = [
  {
    icon: Shirt,
    title: 'Your wardrobe, digitised.',
    body: 'Snap a photo, drop the details in later. Browse by color, season, or how often you wear it.',
  },
  {
    icon: Layers,
    title: 'Outfits that make sense.',
    body: 'Combine tops, bottoms, and shoes into saved looks. Tag them. Favorite them. Reach for them.',
  },
  {
    icon: Sparkles,
    title: 'A stylist in your pocket.',
    body: 'Ask for an outfit for a wedding, a date, or a Tuesday. Grounded in clothes you already own.',
  },
  {
    icon: Camera,
    title: 'Try it on, virtually.',
    body: 'See how a piece looks on you — without leaving the house. No fitting rooms required.',
  },
  {
    icon: Cloud,
    title: 'Yours, on every device.',
    body: 'Built for the way you actually get dressed. Quick on mobile. Clean on desktop.',
  },
  {
    icon: Lock,
    title: 'Private. Always.',
    body: 'One person, one account, one wardrobe. Nothing is public by default. Sharing is explicit.',
  },
];

export function FeatureGrid() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="container-content py-24 md:py-32">
        <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Built for one person
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
            A wardrobe is personal.
            <br className="hidden sm:block" /> We treat it that way.
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="group relative bg-bg p-8 transition-colors duration-300 ease-apple hover:bg-surface"
            >
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-fg">
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
