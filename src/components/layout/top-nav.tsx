"use client"

import { Button } from "@/components/ui/button"
import { useAppShell } from "@/components/layout/app-shell"

interface TopNavProps {
  title: string
  actions?: React.ReactNode
}

export function TopNav({ title, actions }: TopNavProps) {
  const { openSidebar } = useAppShell()
  return (
    <header className="sticky top-0 z-30 bg-[#FFF8F0] border-b-2 border-[#1A1A1A]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openSidebar}
            className="md:hidden"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </Button>

          {/* Page title */}
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[#1A1A1A]">
            {title}
          </h1>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
