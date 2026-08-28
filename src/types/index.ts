export type Category = "tops" | "bottoms" | "shoes" | "accessories" | "outerwear" | "dresses";
export type Season = "spring" | "summer" | "fall" | "winter";
export type Occasion = "casual" | "formal" | "work" | "party" | "sports" | "lounge";
export type BlendMode = "normal" | "multiply" | "overlay";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  user_id: string;
  name: string;
  category: Category;
  color: string | null;
  color_hex: string | null;
  pattern: string | null;
  season: Season[];
  occasion: Occasion[];
  image_url: string;
  thumbnail_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  item_ids: string[];
  occasion: Occasion | null;
  season: Season | null;
  is_favorite: boolean;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  items?: Item[];
}

export interface TryOnSnapshot {
  id: string;
  user_id: string;
  body_photo_url: string;
  composite_image_url: string;
  items_used: string[];
  adjustments: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
    opacity: number;
    blendMode: BlendMode;
  };
  created_at: string;
}

export interface FamilyGroup {
  id: string;
  name: string;
  created_by: string;
  invite_code: string;
  created_at: string;
}

export interface FamilyMember {
  group_id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
  profile?: Profile;
}

export interface OutfitShare {
  outfit_id: string;
  shared_with: string;
  shared_at: string;
  outfit?: Outfit;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
