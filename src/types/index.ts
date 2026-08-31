export type Category =
  | "tops"
  | "bottoms"
  | "dresses"
  | "outerwear"
  | "shoes"
  | "accessories"

export type Season = "spring" | "summer" | "fall" | "winter" | "all-season"

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "tops", label: "TOPS" },
  { value: "bottoms", label: "BOTTOMS" },
  { value: "dresses", label: "DRESSES" },
  { value: "outerwear", label: "OUTERWEAR" },
  { value: "shoes", label: "SHOES" },
  { value: "accessories", label: "ACCESSORIES" },
]

export const SEASONS: { value: Season; label: string }[] = [
  { value: "spring", label: "SPRING" },
  { value: "summer", label: "SUMMER" },
  { value: "fall", label: "FALL" },
  { value: "winter", label: "WINTER" },
  { value: "all-season", label: "ALL-SEASON" },
]

export interface WardrobeItem {
  id: string
  user_id: string
  name: string
  category: Category
  color: string | null
  color_hex: string | null
  pattern: string | null
  season: Season[]
  occasion: string[]
  image_url: string
  thumbnail_url: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type WardrobeItemInsert = Omit<
  WardrobeItem,
  "id" | "user_id" | "created_at" | "updated_at"
> & {
  user_id?: string
}
