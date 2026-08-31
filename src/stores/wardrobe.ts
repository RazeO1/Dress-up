import { create } from "zustand"
import type { Category } from "@/types"

interface Toast {
  id: string
  message: string
  type: "success" | "error"
}

interface WardrobeStore {
  activeCategory: Category | "all"
  setActiveCategory: (cat: Category | "all") => void
  addItemSheetOpen: boolean
  setAddItemSheetOpen: (open: boolean) => void
  detailItemId: string | null
  setDetailItemId: (id: string | null) => void
  detailSheetOpen: boolean
  setDetailSheetOpen: (open: boolean) => void
  toasts: Toast[]
  addToast: (message: string, type: "success" | "error") => void
  removeToast: (id: string) => void
}

export const useWardrobeStore = create<WardrobeStore>((set) => ({
  activeCategory: "all",
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  addItemSheetOpen: false,
  setAddItemSheetOpen: (open) => set({ addItemSheetOpen: open }),
  detailItemId: null,
  setDetailItemId: (id) => set({ detailItemId: id }),
  detailSheetOpen: false,
  setDetailSheetOpen: (open) => set({ detailSheetOpen: open }),
  toasts: [],
  addToast: (message, type) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))
