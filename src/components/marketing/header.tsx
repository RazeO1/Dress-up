import Link from 'next/link';
import { Logo } from './logo';

export function MarketingHeader() {
  return (
    <header className="container-content flex items-center justify-between py-5">
      <Logo />
      <nav className="flex items-center gap-1">
        <Link
          href="/login"
          className="rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors duration-200 ease-apple hover:text-fg"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="ml-1 rounded-full bg-fg px-4 py-1.5 text-sm font-medium text-bg transition-all duration-200 ease-apple hover:opacity-90 active:scale-[0.98]"
        >
          Get started
        </Link>
      </nav>
    </header>
  );
}
