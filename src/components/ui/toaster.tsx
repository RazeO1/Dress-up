'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'bg-surface text-fg border border-border rounded-lg',
          description: 'text-muted',
          actionButton: 'bg-fg text-bg',
        },
      }}
    />
  );
}
