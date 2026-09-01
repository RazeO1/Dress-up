"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { useWardrobeStore } from "@/stores/wardrobe"
import { useWardrobeItems, useUpdateItem, useDeleteItem } from "@/hooks/use-wardrobe-items"
import { CATEGORIES, SEASONS, type Season, type WardrobeItem } from "@/types"

const editSchema = z.object({
  name: z.string().min(1).max(255),
  category: z.enum(["tops", "bottoms", "dresses", "outerwear", "shoes", "accessories"]),
  color: z.string().max(50).optional().or(z.literal("")),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal("")),
  pattern: z.string().max(50).optional().or(z.literal("")),
  seasons: z.array(z.enum(["spring", "summer", "fall", "winter", "all-season"])).min(0),
})

type EditForm = z.infer<typeof editSchema>

const PRESET_OCCASIONS = ["casual", "work", "formal", "sport", "party"]

export function ItemDetailSheet() {
  const open = useWardrobeStore((s) => s.detailSheetOpen)
  const setOpen = useWardrobeStore((s) => s.setDetailSheetOpen)
  const detailItemId = useWardrobeStore((s) => s.detailItemId)
  const setDetailItemId = useWardrobeStore((s) => s.setDetailItemId)
  const addToast = useWardrobeStore((s) => s.addToast)

  const { data: items } = useWardrobeItems()
  const item = items?.find((i) => i.id === detailItemId)

  const updateItem = useUpdateItem(detailItemId ?? "")
  const deleteItem = useDeleteItem()

  const [mode, setMode] = React.useState<"view" | "edit">("view")
  const [selectedOccasions, setSelectedOccasions] = React.useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: "",
      category: "tops",
      color: "",
      color_hex: "",
      pattern: "",
      seasons: [],
    },
  })

  const category = watch("category")
  const seasons = watch("seasons")

  // Populate form when item loads
  React.useEffect(() => {
    if (item && mode === "edit") {
      reset({
        name: item.name,
        category: item.category,
        color: item.color ?? "",
        color_hex: item.color_hex ?? "",
        pattern: item.pattern ?? "",
        seasons: item.season ?? [],
      })
      setSelectedOccasions(item.occasion ?? [])
    } else if (!item) {
      setOpen(false)
      setDetailItemId(null)
    }
  }, [item, mode, reset, setOpen, setDetailItemId])

  const toggleSeason = (s: Season) => {
    const next = seasons.includes(s) ? seasons.filter((x) => x !== s) : [...seasons, s]
    setValue("seasons", next, { shouldValidate: true })
  }

  const toggleOccasion = (o: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]
    )
  }

  const onUpdate = async (data: EditForm) => {
    if (!item) return
    try {
      await updateItem.mutateAsync({
        ...data,
        color: data.color || null,
        color_hex: data.color_hex || null,
        pattern: data.pattern || null,
        season: data.seasons,
        occasion: selectedOccasions,
      })
      addToast("UPDATED", "success")
      setMode("view")
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Update failed", "error")
    }
  }

  const onDelete = async () => {
    if (!item) return
    if (!confirm("DELETE THIS TAG? CANNOT UNDO.")) return
    try {
      await deleteItem.mutateAsync(item.id)
      addToast("DELETED", "success")
      setOpen(false)
      setDetailItemId(null)
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Delete failed", "error")
    }
  }

  if (!item) return null

  const categoryLabel = CATEGORIES.find((c) => c.value === item.category)?.label ?? item.category

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          {mode === "edit" ? (
            <SheetTitle className="font-display text-2xl font-bold uppercase tracking-wider">
              EDIT TAG
            </SheetTitle>
          ) : (
            <SheetTitle className="font-display text-2xl font-bold uppercase tracking-wider">
              {item.name}
            </SheetTitle>
          )}
          <SheetDescription>
            {mode === "edit"
              ? "Update details"
              : `${categoryLabel} · ${item.season?.join(", ") ?? "—"}`}
          </SheetDescription>
        </SheetHeader>

        {mode === "view" ? (
          // VIEW MODE
          <div className="mt-4 space-y-4">
            {/* Image */}
            <div className="aspect-square bg-[#F0E8DC] border-2 border-[#1A1A1A] relative overflow-hidden">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8A8A7A] text-xs font-label">
                  NO IMAGE
                </div>
              )}
              <div className="absolute top-2 left-2 bg-[#A8FF3E] border-2 border-[#1A1A1A] px-2 py-0.5 text-[10px] font-label font-bold uppercase tracking-wider text-[#1A1A1A]">
                {categoryLabel}
              </div>
            </div>

            <Separator />

            {/* Meta grid */}
            <div className="space-y-3">
              {item.color && (
                <div className="flex items-center gap-2">
                  <span className="font-label text-xs uppercase tracking-wider text-[#8A8A7A] w-24">COLOR</span>
                  <span className="font-bold text-[#1A1A1A]">{item.color}</span>
                  {item.color_hex && (
                    <div
                      className="w-5 h-5 border border-[#1A1A1A]"
                      style={{ backgroundColor: item.color_hex }}
                    />
                  )}
                </div>
              )}
              {item.pattern && (
                <div className="flex items-center gap-2">
                  <span className="font-label text-xs uppercase tracking-wider text-[#8A8A7A] w-24">PATTERN</span>
                  <span className="font-bold text-[#1A1A1A]">{item.pattern}</span>
                </div>
              )}
              {(item.season?.length ?? 0) > 0 && (
                <div className="flex items-start gap-2">
                  <span className="font-label text-xs uppercase tracking-wider text-[#8A8A7A] w-24">SEASONS</span>
                  <div className="flex flex-wrap gap-1">
                    {item.season.map((s) => (
                      <Badge key={s} variant="outline" className="text-[10px] py-0 px-1.5">
                        {SEASONS.find((x) => x.value === s)?.label ?? s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {(item.occasion?.length ?? 0) > 0 && (
                <div className="flex items-start gap-2">
                  <span className="font-label text-xs uppercase tracking-wider text-[#8A8A7A] w-24">OCCASIONS</span>
                  <div className="flex flex-wrap gap-1">
                    {item.occasion.map((o) => (
                      <Badge key={o} variant="outline" className="text-[10px] py-0 px-1.5">
                        {o}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMode("edit")}
                className="flex-1"
              >
                EDIT
              </Button>
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={deleteItem.isPending}
                className="flex-1"
              >
                {deleteItem.isPending ? "DELETING..." : "DELETE"}
              </Button>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <form onSubmit={handleSubmit(onUpdate)} className="mt-4 space-y-5">
            {/* Image (read-only in edit) */}
            <div className="aspect-square bg-[#F0E8DC] border-2 border-[#1A1A1A] relative overflow-hidden">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8A8A7A] text-xs font-label">
                  NO IMAGE
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label htmlFor="name">NAME</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-[#FF3366]">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>CATEGORY</Label>
              <select
                {...register("category")}
                className="w-full h-10 border-2 border-[#1A1A1A] bg-[#FFF8F0] px-3 text-sm uppercase tracking-wider text-[#1A1A1A] focus:border-[#A8FF3E] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="color">COLOR</Label>
                <Input id="color" {...register("color")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="color_hex">HEX</Label>
                <Input id="color_hex" {...register("color_hex")} />
                {errors.color_hex && <p className="text-xs text-[#FF3366]">{errors.color_hex.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pattern">PATTERN</Label>
              <Input id="pattern" {...register("pattern")} />
            </div>

            <div className="space-y-1.5">
              <Label>SEASON</Label>
              <div className="flex flex-wrap gap-1.5">
                {SEASONS.map((s) => {
                  const active = seasons.includes(s.value)
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => toggleSeason(s.value)}
                      className={`px-2.5 py-1 text-[10px] font-label uppercase tracking-wider border-2 border-[#1A1A1A] transition-colors ${
                        active
                          ? "bg-[#A8FF3E] text-[#1A1A1A]"
                          : "bg-[#FFF8F0] text-[#1A1A1A] hover:bg-[#F0E8DC]"
                      }`}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>OCCASION</Label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_OCCASIONS.map((o) => {
                  const active = selectedOccasions.includes(o)
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => toggleOccasion(o)}
                      className={`px-2.5 py-1 text-[10px] font-label uppercase tracking-wider border-2 border-[#1A1A1A] transition-colors ${
                        active
                          ? "bg-[#FF6B35] text-[#FFF8F0]"
                          : "bg-[#FFF8F0] text-[#1A1A1A] hover:bg-[#F0E8DC]"
                      }`}
                    >
                      {o}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("view")}
                className="flex-1"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                disabled={updateItem.isPending}
                className="flex-1"
              >
                {updateItem.isPending ? "SAVING..." : "SAVE"}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}