import { LogoutButton } from '@/components/auth/logout-button';
import { Logo } from '@/components/marketing/logo';

export function Topbar({ userLabel, compact = false }: { userLabel: string; compact?: boolean }) {
  return (
    <header
      className={
        compact
          ? 'flex items-center justify-between border-b border-border px-4 py-4 md:border-b-0 md:px-6 md:pt-6'
          : 'flex items-center justify-between border-b border-border bg-bg px-6 py-4'
      }
    >
      <Logo />
      <div className="flex items-center gap-3">
        {!compact && (
          <span className="hidden text-sm text-muted md:inline">Signed in as {userLabel}</span>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
