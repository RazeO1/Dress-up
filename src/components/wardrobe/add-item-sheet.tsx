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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useWardrobeStore } from "@/stores/wardrobe"
import { useCreateItem } from "@/hooks/use-wardrobe-items"
import { CATEGORIES, SEASONS, type Season } from "@/types"

const itemSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  category: z.enum(["tops", "bottoms", "dresses", "outerwear", "shoes", "accessories"]),
  color: z.string().max(50).optional().or(z.literal("")),
  color_hex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use hex like #FF0000")
    .optional()
    .or(z.literal("")),
  pattern: z.string().max(50).optional().or(z.literal("")),
  seasons: z.array(z.enum(["spring", "summer", "fall", "winter", "all-season"])).min(0),
  occasions: z.array(z.string()).min(0),
})

type ItemForm = z.infer<typeof itemSchema>

const PRESET_OCCASIONS = ["casual", "work", "formal", "sport", "party"]

export function AddItemSheet() {
  const open = useWardrobeStore((s) => s.addItemSheetOpen)
  const setOpen = useWardrobeStore((s) => s.setAddItemSheetOpen)
  const addToast = useWardrobeStore((s) => s.addToast)

  const createItem = useCreateItem()

  const [file, setFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      category: "tops",
      color: "",
      color_hex: "",
      pattern: "",
      seasons: [],
      occasions: [],
    },
  })

  const category = watch("category")
  const seasons = watch("seasons")
  const occasions = watch("occasions")

  // Reset everything when sheet closes
  React.useEffect(() => {
    if (!open) {
      // Delay reset so the close animation doesn't show empty form
      const t = setTimeout(() => {
        setFile(null)
        setPreviewUrl(null)
        setUploadedUrl(null)
        setUploadError(null)
        setUploading(false)
        reset()
      }, 200)
      return () => clearTimeout(t)
    }
  }, [open, reset])

  const handleFile = async (selected: File) => {
    setFile(selected)
    setUploadError(null)
    setPreviewUrl(URL.createObjectURL(selected))
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", selected)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Upload failed")
      setUploadedUrl(data.imageUrl)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) handleFile(selected)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) handleFile(dropped)
  }

  const toggleSeason = (s: Season) => {
    const next = seasons.includes(s) ? seasons.filter((x) => x !== s) : [...seasons, s]
    setValue("seasons", next, { shouldValidate: true })
  }

  const toggleOccasion = (o: string) => {
    const next = occasions.includes(o)
      ? occasions.filter((x) => x !== o)
      : [...occasions, o]
    setValue("occasions", next, { shouldValidate: true })
  }

  const onSubmit = async (data: ItemForm) => {
    if (!uploadedUrl) {
      setUploadError("Upload an image first")
      return
    }

    try {
      await createItem.mutateAsync({
        name: data.name,
        category: data.category,
        color: data.color || null,
        color_hex: data.color_hex || null,
        pattern: data.pattern || null,
        season: data.seasons,
        occasion: data.occasions,
        image_url: uploadedUrl,
        thumbnail_url: null,
        metadata: {},
      })
      addToast("ITEM TAGGED", "success")
      setOpen(false)
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to save", "error")
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl font-bold uppercase tracking-wider">
            NEW TAG
          </SheetTitle>
          <SheetDescription>
            Snap it. Strip the background. Categorize it.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
          {/* Image upload */}
          <div className="space-y-2">
            <Label>PHOTO</Label>
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#1A1A1A] bg-[#F0E8DC] aspect-square w-full flex items-center justify-center cursor-pointer hover:bg-[#E8DFD0] transition-colors relative overflow-hidden"
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center px-4">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mx-auto mb-2 text-[#1A1A1A]"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="font-label text-xs uppercase tracking-wider text-[#1A1A1A]">
                    DROP IMAGE OR CLICK
                  </p>
                  <p className="text-[10px] text-[#8A8A7A] mt-1">Background auto-removed</p>
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-[#FFF8F0]/90 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-8 w-8 animate-spin border-4 border-[#1A1A1A] border-t-[#A8FF3E] mx-auto" />
                    <p className="mt-2 font-label text-xs uppercase tracking-wider text-[#1A1A1A]">
                      STRIPPING BG...
                    </p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            {uploadError && (
              <p className="text-xs text-[#FF3366]">{uploadError}</p>
            )}
            {file && !uploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null)
                  setPreviewUrl(null)
                  setUploadedUrl(null)
                  setUploadError(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="w-full"
              >
                REPLACE IMAGE
              </Button>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">NAME</Label>
            <Input
              id="name"
              placeholder="Vintage band tee"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-[#FF3366]">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>CATEGORY</Label>
            <Select
              value={category}
              onValueChange={(v) =>
                setValue("category", v as ItemForm["category"], { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="color">COLOR</Label>
              <Input id="color" placeholder="Red" {...register("color")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color_hex">HEX</Label>
              <Input
                id="color_hex"
                placeholder="#FF0000"
                {...register("color_hex")}
              />
              {errors.color_hex && (
                <p className="text-xs text-[#FF3366]">{errors.color_hex.message}</p>
              )}
            </div>
          </div>

          {/* Pattern */}
          <div className="space-y-1.5">
            <Label htmlFor="pattern">PATTERN</Label>
            <Input id="pattern" placeholder="Solid, striped..." {...register("pattern")} />
          </div>

          {/* Season chips */}
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

          {/* Occasion chips */}
          <div className="space-y-1.5">
            <Label>OCCASION</Label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_OCCASIONS.map((o) => {
                const active = occasions.includes(o)
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
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              disabled={!uploadedUrl || uploading || createItem.isPending}
              className="flex-1"
            >
              {createItem.isPending ? "TAGGING..." : "TAG IT"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
