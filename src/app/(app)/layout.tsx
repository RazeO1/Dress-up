import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { Sidebar } from '@/components/app/sidebar';
import { Topbar } from '@/components/app/topbar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect('/login');

  const label = user.displayName ?? user.username;

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] md:grid-cols-[260px_1fr] md:grid-rows-1">
      <aside className="flex flex-col border-b border-border bg-bg md:border-b-0 md:border-r">
        <Topbar userLabel={label} compact />
        <div className="hidden flex-1 p-4 md:block">
          <Sidebar />
        </div>
      </aside>
      <main className="px-6 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
