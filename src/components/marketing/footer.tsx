import Link from 'next/link';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-content flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-xs text-muted">Your private wardrobe, online.</p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <Link href="/login" className="transition-colors hover:text-fg">Sign in</Link>
          <Link href="/register" className="transition-colors hover:text-fg">Get started</Link>
          <Link href="/forgot-password" className="transition-colors hover:text-fg">Reset password</Link>
        </nav>
        <p className="text-xs text-muted">© {new Date().getFullYear()} Wardrobe.</p>
      </div>
    </footer>
  );
}
