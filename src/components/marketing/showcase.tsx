/**
 * The "showcase" panel. We don't have AI-generated imagery and we don't
 * use stock photos. Instead we render a precise, hand-composed SVG of a
 * tasteful wardrobe visual — flat, balanced, with a real sense of
 * material and depth. This is the kind of thing Apple's product pages
 * would build with real photography; for us it's a calm, well-drawn
 * placeholder that respects the brand.
 */
export function Showcase() {
  return (
    <section className="container-content pb-20 md:pb-28">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface-2/40 p-2 shadow-sm md:p-3">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-bg">
            <ShowcaseArt />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Today</p>
                <p className="font-display text-lg font-semibold tracking-tight">3 looks ready</p>
              </div>
              <div className="hidden gap-2 sm:flex">
                <span className="rounded-full border border-border bg-bg/80 px-3 py-1 text-xs text-muted backdrop-blur">
                  Casual
                </span>
                <span className="rounded-full border border-border bg-bg/80 px-3 py-1 text-xs text-muted backdrop-blur">
                  Office
                </span>
                <span className="rounded-full border border-border bg-bg/80 px-3 py-1 text-xs text-muted backdrop-blur">
                  Evening
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseArt() {
  return (
    <svg
      viewBox="0 0 1200 675"
      className="h-full w-full"
      role="img"
      aria-label="A flat-lay illustration of folded clothes, a jacket, and shoes arranged on a soft surface."
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(220 14% 96%)" />
          <stop offset="100%" stopColor="hsl(220 14% 92%)" />
        </linearGradient>
        <linearGradient id="fabric" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(220 9% 30%)" />
          <stop offset="100%" stopColor="hsl(220 9% 18%)" />
        </linearGradient>
        <linearGradient id="denim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(215 35% 45%)" />
          <stop offset="100%" stopColor="hsl(215 40% 32%)" />
        </linearGradient>
        <linearGradient id="cream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(40 30% 94%)" />
          <stop offset="100%" stopColor="hsl(40 20% 88%)" />
        </linearGradient>
        <linearGradient id="leather" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(25 35% 30%)" />
          <stop offset="100%" stopColor="hsl(25 45% 18%)" />
        </linearGradient>
        <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <rect width="1200" height="675" fill="url(#bg)" />

      {/* Soft window light */}
      <ellipse cx="300" cy="180" rx="420" ry="160" fill="white" opacity="0.5" filter="url(#soft)" />

      {/* Wooden hanger rail */}
      <line x1="80" y1="120" x2="1120" y2="120" stroke="hsl(25 25% 60%)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="120" r="6" fill="hsl(25 25% 55%)" />
      <circle cx="1100" cy="120" r="6" fill="hsl(25 25% 55%)" />

      {/* Hangers */}
      <g transform="translate(180 130)">
        <path d="M0 0 L40 40 L-40 40 Z" fill="none" stroke="hsl(220 9% 60%)" strokeWidth="2" />
        <rect x="-50" y="40" width="100" height="160" rx="6" fill="url(#fabric)" />
        <rect x="-50" y="40" width="100" height="6" fill="hsl(220 9% 12%)" />
      </g>
      <g transform="translate(360 130)">
        <path d="M0 0 L40 40 L-40 40 Z" fill="none" stroke="hsl(220 9% 60%)" strokeWidth="2" />
        <rect x="-50" y="40" width="100" height="200" rx="6" fill="url(#cream)" />
        <rect x="-50" y="40" width="100" height="6" fill="hsl(40 20% 75%)" />
      </g>

      {/* Folded stack on a surface */}
      <rect x="560" y="220" width="380" height="220" rx="8" fill="hsl(0 0% 100%)" stroke="hsl(220 13% 88%)" strokeWidth="2" />
      {/* shirt */}
      <rect x="580" y="240" width="340" height="40" rx="4" fill="url(#cream)" />
      <rect x="580" y="240" width="340" height="3" fill="hsl(40 20% 80%)" />
      {/* shirt 2 */}
      <rect x="580" y="288" width="340" height="40" rx="4" fill="hsl(220 14% 88%)" />
      <rect x="580" y="288" width="340" height="3" fill="hsl(220 14% 80%)" />
      {/* denim */}
      <rect x="580" y="336" width="340" height="48" rx="4" fill="url(#denim)" />
      <rect x="580" y="336" width="340" height="3" fill="hsl(215 40% 25%)" />
      {/* jacket folded */}
      <rect x="580" y="392" width="340" height="42" rx="4" fill="hsl(220 9% 24%)" />
      <rect x="580" y="392" width="340" height="3" fill="hsl(220 9% 14%)" />

      {/* Shoes */}
      <g transform="translate(100 470)">
        <ellipse cx="60" cy="50" rx="60" ry="14" fill="hsl(220 14% 88%)" opacity="0.6" />
        <path d="M0 50 Q0 20 30 20 L100 20 Q120 20 120 50 Z" fill="url(#leather)" />
        <ellipse cx="60" cy="22" rx="20" ry="6" fill="hsl(25 35% 22%)" />
      </g>
      <g transform="translate(260 490)">
        <ellipse cx="60" cy="50" rx="60" ry="14" fill="hsl(220 14% 88%)" opacity="0.6" />
        <path d="M0 50 Q0 20 30 20 L100 20 Q120 20 120 50 Z" fill="url(#leather)" />
        <ellipse cx="60" cy="22" rx="20" ry="6" fill="hsl(25 35% 22%)" />
      </g>

      {/* Small detail: a watch */}
      <g transform="translate(440 500)">
        <circle cx="30" cy="30" r="26" fill="hsl(220 9% 14%)" />
        <circle cx="30" cy="30" r="22" fill="hsl(220 9% 8%)" />
        <circle cx="30" cy="30" r="2" fill="hsl(40 20% 88%)" />
        <line x1="30" y1="30" x2="30" y2="14" stroke="hsl(40 20% 88%)" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="30" x2="42" y2="30" stroke="hsl(40 20% 88%)" strokeWidth="2" strokeLinecap="round" />
        <rect x="20" y="0" width="20" height="6" rx="2" fill="hsl(25 35% 30%)" />
        <rect x="20" y="54" width="20" height="6" rx="2" fill="hsl(25 35% 30%)" />
      </g>

      {/* Subtle paper tag */}
      <g transform="translate(1000 470) rotate(-6)">
        <rect x="0" y="0" width="120" height="80" rx="4" fill="hsl(40 30% 96%)" stroke="hsl(40 20% 85%)" />
        <line x1="14" y1="22" x2="100" y2="22" stroke="hsl(220 9% 60%)" strokeWidth="1.5" />
        <line x1="14" y1="36" x2="80" y2="36" stroke="hsl(220 9% 70%)" strokeWidth="1.5" />
        <line x1="14" y1="50" x2="92" y2="50" stroke="hsl(220 9% 70%)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
