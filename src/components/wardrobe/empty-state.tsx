"use client"

import { useWardrobeStore } from "@/stores/wardrobe"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  const setAddItemSheetOpen = useWardrobeStore((s) => s.setAddItemSheetOpen)

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Brutalist tag illustration */}
      <div className="relative mb-6">
        <div className="w-32 h-40 bg-[#A8FF3E] border-2 border-[#1A1A1A] flex flex-col items-center justify-center p-4 shadow-[8px_8px_0_#1A1A1A] rotate-[-3deg]">
          <div className="w-6 h-6 bg-[#1A1A1A] mb-3" />
          <div className="font-display text-2xl font-bold uppercase tracking-wider text-[#1A1A1A]">
            TAG
          </div>
          <div className="w-12 h-0.5 bg-[#1A1A1A] my-2" />
          <div className="text-[10px] font-label uppercase tracking-wider text-[#1A1A1A]">
            empty
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 w-32 h-40 bg-[#FF6B35] border-2 border-[#1A1A1A] -z-10 rotate-[3deg]" />
      </div>

      <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
        NO TAGS YET
      </h2>
      <p className="text-sm text-[#8A8A7A] max-w-md mb-6">
        Start building your wardrobe. Snap a photo of any garment, and we'll strip the background.
      </p>

      <Button
        size="lg"
        onClick={() => setAddItemSheetOpen(true)}
        className="shadow-[4px_4px_0_#1A1A1A]"
      >
        ADD FIRST ITEM
      </Button>
    </div>
  )
}
