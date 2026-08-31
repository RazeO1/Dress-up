"use client"

import { cn } from "@/lib/utils"

interface LoaderProps {
  variant?: "full" | "inline"
  label?: string
  className?: string
}

export function Loader({ variant = "full", label, className }: LoaderProps) {
  if (variant === "inline") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2",
          className
        )}
        role="status"
        aria-label={label || "Loading"}
      >
        <TagStampIcon className="h-4 w-4 animate-tag-stamp text-[#A8FF3E]" />
        {label && <span className="font-label text-xs uppercase tracking-widest">{label}</span>}
      </span>
    )
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]",
        className
      )}
      role="status"
      aria-label={label || "Loading"}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="animate-tag-stamp">
          <TagStampIcon className="h-16 w-16 text-[#A8FF3E]" />
        </div>
        {label && (
          <p className="font-label text-xs uppercase tracking-widest text-[#A8FF3E]">
            {label}
          </p>
        )}
      </div>
    </div>
  )
}

function TagStampIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
    >
      <path d="M5 3h11l4 4v14H5z" />
      <circle cx="14" cy="7" r="1.5" fill="currentColor" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="14" x2="15" y2="14" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  )
}
