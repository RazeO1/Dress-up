import Link from 'next/link';
import { Logo } from '@/components/marketing/logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="container-content flex items-center justify-between py-5">
        <Logo />
        <Link
          href="/"
          className="text-sm text-muted transition-colors duration-200 ease-apple hover:text-fg"
        >
          ← Back home
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </main>
      <footer className="container-content py-6 text-xs text-muted">
        Protected by your private session.
      </footer>
    </div>
  );
}
