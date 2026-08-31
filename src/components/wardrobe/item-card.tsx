"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Item } from "@/types"
import { useWardrobeStore } from "@/stores/wardrobe"

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const setDetailItemId = useWardrobeStore((s) => s.setDetailItemId)
  const setDetailSheetOpen = useWardrobeStore((s) => s.setDetailSheetOpen)

  const handleClick = () => {
    setDetailItemId(item.id)
    setDetailSheetOpen(true)
  }

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer group relative overflow-hidden p-0 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1A1A1A]"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#F0E8DC] border-b-2 border-[#1A1A1A] overflow-hidden">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8A8A7A] text-xs font-label">
            NO IMAGE
          </div>
        )}

        {/* Category stamp */}
        <div className="absolute top-2 left-2 bg-[#A8FF3E] border-2 border-[#1A1A1A] px-2 py-0.5 text-[10px] font-label font-bold uppercase tracking-wider text-[#1A1A1A]">
          {item.category}
        </div>
      </div>

      {/* Meta */}
      <div className="p-3 space-y-2">
        <h3 className="font-display text-base font-bold uppercase tracking-wider text-[#1A1A1A] truncate">
          {item.name}
        </h3>

        <div className="flex items-center gap-1.5 flex-wrap">
          {item.color && (
            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
              {item.color}
            </Badge>
          )}
          {item.color_hex && (
            <div
              className="w-3 h-3 border border-[#1A1A1A]"
              style={{ backgroundColor: item.color_hex }}
              aria-label={`Color: ${item.color_hex}`}
            />
          )}
        </div>
      </div>
    </Card>
  )
}
