"use client"

import { useWardrobeStore } from "@/stores/wardrobe"
import { CATEGORIES, type Category } from "@/types"
import { cn } from "@/lib/utils"

interface CategoryTabsProps {
  counts?: Partial<Record<Category | "all", number>>
}

export function CategoryTabs({ counts = {} }: CategoryTabsProps) {
  const activeCategory = useWardrobeStore((s) => s.activeCategory)
  const setActiveCategory = useWardrobeStore((s) => s.setActiveCategory)

  const tabs: { value: Category | "all"; label: string }[] = [
    { value: "all", label: "ALL" },
    ...CATEGORIES,
  ]

  return (
    <div className="border-b-2 border-[#1A1A1A] bg-[#FFF8F0] overflow-x-auto">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.value
          const count = counts[tab.value]
          return (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={cn(
                "px-4 py-3 text-xs font-label uppercase tracking-wider border-r-2 border-[#1A1A1A] transition-colors whitespace-nowrap",
                isActive
                  ? "bg-[#1A1A1A] text-[#A8FF3E] font-bold"
                  : "bg-[#FFF8F0] text-[#1A1A1A] hover:bg-[#F0E8DC]"
              )}
            >
              {tab.label}
              {count !== undefined && (
                <span
                  className={cn(
                    "ml-2 px-1.5 py-0.5 text-[10px] font-bold",
                    isActive
                      ? "bg-[#A8FF3E] text-[#1A1A1A]"
                      : "bg-[#1A1A1A] text-[#FFF8F0]"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
