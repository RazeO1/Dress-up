import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 border-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="font-display text-2xl font-bold tracking-tight">TAG</h1>
          <nav className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <a href="/login">LOG IN</a>
            </Button>
            <Button asChild size="sm">
              <a href="/signup">SIGN UP</a>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-label text-xs uppercase tracking-widest text-muted-foreground">
          01 WARDROBE
        </p>
        <h2 className="mt-6 font-display text-6xl font-bold leading-none md:text-8xl">
          YOUR WARDROBE.
          <br />
          NO EXCUSES.
        </h2>
        <p className="mt-6 max-w-md font-body text-base text-muted-foreground">
          Tag every piece. Know what you own. Wear more of it.
        </p>
        <div className="mt-10">
          <Button asChild size="lg">
            <a href="/signup">START FREE →</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
