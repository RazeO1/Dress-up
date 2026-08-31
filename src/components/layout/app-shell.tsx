"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Sidebar } from "@/components/layout/sidebar"

interface AppShellContextValue {
  openSidebar: () => void
}

const AppShellContext = createContext<AppShellContextValue>({ openSidebar: () => {} })

export function useAppShell() {
  return useContext(AppShellContext)
}

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AppShellContext.Provider value={{ openSidebar: () => setSidebarOpen(true) }}>
      <div className="flex h-screen overflow-hidden bg-[#FFF8F0]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </AppShellContext.Provider>
  )
}
