import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-content pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1 text-xs text-muted backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Private by default
          </p>
          <h1 className="font-display text-[44px] font-semibold leading-[1.05] tracking-[-0.025em] md:text-[72px]">
            Your wardrobe,
            <br className="hidden sm:block" />
            <span className="text-muted"> quietly organized.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted md:text-xl">
            Every piece you own, in one place. Build outfits. Try things on.
            No public feed. No strangers browsing.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-fg px-6 text-[15px] font-medium text-bg transition-all duration-300 ease-apple hover:opacity-90 active:scale-[0.98]"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-apple group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-full px-5 text-[15px] text-fg transition-colors duration-200 ease-apple hover:bg-surface-2"
            >
              I already have an account
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted">Free for you and your family. Always.</p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[600px] bg-gradient-to-b from-surface-2/70 via-surface-2/20 to-transparent"
      />
    </section>
  );
}
