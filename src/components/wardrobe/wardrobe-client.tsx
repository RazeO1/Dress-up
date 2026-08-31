"use client"

import { useWardrobeStore } from "@/stores/wardrobe"
import { useWardrobeItems } from "@/hooks/use-wardrobe-items"
import { CategoryTabs } from "@/components/wardrobe/category-tabs"
import { ItemCard } from "@/components/wardrobe/item-card"
import { EmptyState } from "@/components/wardrobe/empty-state"
import { AddItemSheet } from "@/components/wardrobe/add-item-sheet"
import { ItemDetailSheet } from "@/components/wardrobe/item-detail-sheet"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types"

export function WardrobeClient() {
  const activeCategory = useWardrobeStore((s) => s.activeCategory)
  const setAddItemSheetOpen = useWardrobeStore((s) => s.setAddItemSheetOpen)
  const { data: items, isLoading } = useWardrobeItems(
    activeCategory === "all" ? undefined : (activeCategory as Category)
  )

  // Compute category counts
  const counts: Partial<Record<Category | "all", number>> = {}
  if (items) {
    counts.all = items.length
    for (const item of items) {
      counts[item.category] = (counts[item.category] ?? 0) + 1
    }
  }

  return (
    <>
      <CategoryTabs counts={counts} />

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-2 border-[#1A1A1A]">
                <div className="aspect-square bg-[#F0E8DC] animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-[#E8E0D0] animate-pulse w-3/4" />
                  <div className="h-3 bg-[#E8E0D0] animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !items?.length ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-20">
        <Button
          size="icon"
          className="w-14 h-14 shadow-[6px_6px_0_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#1A1A1A] transition-all"
          onClick={() => setAddItemSheetOpen(true)}
          aria-label="Add item"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Button>
      </div>

      {/* Sheets */}
      <AddItemSheet />
      <ItemDetailSheet />
    </>
  )
}
