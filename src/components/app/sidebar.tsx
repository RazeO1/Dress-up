'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shirt, Layers, Sparkles, Users, UserRound, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Home', icon: UserRound },
  { href: '/wardrobe', label: 'Wardrobe', icon: Shirt, soon: true },
  { href: '/outfits', label: 'Outfits', icon: Layers, soon: true },
  { href: '/try-on', label: 'Try On', icon: Sparkles, soon: true },
  { href: '/connections', label: 'Connections', icon: Users, soon: true },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary">
      <ul className="flex flex-col gap-0.5">
        {items.map(({ href, label, icon: Icon, soon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <li key={href}>
              <Link
                href={soon ? '#' : href}
                aria-disabled={soon || undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ease-apple',
                  active
                    ? 'bg-surface-2 text-fg'
                    : 'text-muted hover:bg-surface-2 hover:text-fg',
                  soon && 'pointer-events-none opacity-50',
                )}
                onClick={(e) => soon && e.preventDefault()}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="flex-1">{label}</span>
                {soon && (
                  <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    Soon
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
