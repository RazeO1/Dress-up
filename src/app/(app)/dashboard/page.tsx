import { getCurrentUser } from '@/lib/auth/session';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shirt, Layers, Sparkles } from 'lucide-react';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const greeting = user.displayName ?? user.username;

  const upcoming = [
    {
      icon: Shirt,
      title: 'Your wardrobe',
      body: 'Add a piece and it appears here. Tag, color-code, search.',
      eta: 'Coming soon',
    },
    {
      icon: Layers,
      title: 'Outfits',
      body: 'Combine your clothes into saved looks.',
      eta: 'Coming soon',
    },
    {
      icon: Sparkles,
      title: 'Try on, virtually',
      body: 'See how a piece looks on you.',
      eta: 'Coming soon',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="space-y-1.5">
        <p className="text-sm text-muted">Welcome back</p>
        <h1 className="font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em]">
          {greeting}
        </h1>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold tracking-tight">Your wardrobe is empty</h2>
          <p className="text-[15px] text-muted">
            Once you add a piece of clothing, it&apos;ll show up here. Wardrobe management is
            coming in the next update.
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.12em] text-muted">
          What&apos;s next
        </h3>
        <ul className="grid gap-4 sm:grid-cols-3">
          {upcoming.map(({ icon: Icon, title, body, eta }) => (
            <li key={title}>
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-fg">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{body}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                    {eta}
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
