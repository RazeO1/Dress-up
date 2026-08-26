import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2 group', className)}>
      <span
        aria-hidden
        className="grid h-7 w-7 place-items-center rounded-md bg-fg text-bg transition-transform duration-300 ease-apple group-hover:scale-[1.04]"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v11A1.5 1.5 0 0 1 11.5 15h-7A1.5 1.5 0 0 1 3 13.5v-11Zm1.5-.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-7ZM5 3.5h6v1H5v-1Zm0 3h6v1H5v-1Zm0 3h4v1H5v-1Z" />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight">Wardrobe</span>
    </Link>
  );
}
