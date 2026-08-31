"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useUser } from "@/hooks/use-user"

const NAV_ITEMS = [
  {
    href: "/wardrobe",
    label: "WARDROBE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        <path d="M3 9l2.5-6h13L21 9"/>
        <path d="M12 9v12"/>
      </svg>
    ),
  },
  {
    href: "/outfits",
    label: "OUTFITS",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <rect x="3" y="3" width="7" height="9"/>
        <rect x="14" y="3" width="7" height="9"/>
        <rect x="8" y="14" width="8" height="7"/>
      </svg>
    ),
  },
  {
    href: "/try-on",
    label: "TRY ON",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <circle cx="12" cy="7" r="4"/>
        <path d="M5 21v-2a7 7 0 0114 0v2"/>
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "SETTINGS",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#1A1A1A] border-r-2 border-[#1A1A1A]
          transform transition-transform duration-200 ease-out
          md:translate-x-0 md:static md:z-auto md:h-screen md:flex md:flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b-2 border-[#A8FF3E]/20">
          <div className="w-9 h-9 bg-[#A8FF3E] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18v2H3V6zm0 4h12v2H3v-2zm0 4h8v2H3v-2zm0 4h14v2H3v-2z" fill="#1A1A1A"/>
            </svg>
          </div>
          <span className="font-display text-xl text-[#FFF8F0] font-bold tracking-wider">
            TAG
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 text-sm font-label uppercase tracking-wider
                  transition-colors duration-100
                  ${isActive
                    ? "bg-[#A8FF3E] text-[#1A1A1A] font-bold"
                    : "text-[#FFF8F0]/70 hover:bg-[#FFF8F0]/10 hover:text-[#FFF8F0]"
                  }
                `}
              >
                <span className={isActive ? "text-[#1A1A1A]" : "text-[#A8FF3E]"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User info at bottom */}
        <div className="border-t-2 border-[#A8FF3E]/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF6B35] flex items-center justify-center text-[#FFF8F0] font-label text-xs font-bold">
              {user?.email?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#FFF8F0]/70 font-label truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST" className="mt-3">
            <button
              type="submit"
              className="w-full text-left px-2 py-1.5 text-xs font-label uppercase tracking-wider text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors"
            >
              LOG OUT
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
