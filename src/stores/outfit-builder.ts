import { create } from "zustand";
import type { Item, BlendMode } from "@/types";

interface CanvasItem {
  item: Item;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

interface OutfitBuilderState {
  items: CanvasItem[];
  selectedId: string | null;
  background: string;
  setBackground: (bg: string) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CanvasItem>) => void;
  selectItem: (id: string | null) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  clear: () => void;
}

export const useOutfitBuilderStore = create<OutfitBuilderState>((set, get) => ({
  items: [],
  selectedId: null,
  background: "#ffffff",
  setBackground: (bg) => set({ background: bg }),
  addItem: (item) => {
    const state = get();
    const newItem: CanvasItem = {
      item,
      x: 100,
      y: 100,
      scale: 1,
      rotation: 0,
      zIndex: state.items.length,
    };
    set({ items: [...state.items, newItem], selectedId: item.id });
  },
  removeItem: (id) => {
    set((s) => ({
      items: s.items.filter((i) => i.item.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
  },
  updateItem: (id, updates) => {
    set((s) => ({
      items: s.items.map((i) => (i.item.id === id ? { ...i, ...updates } : i)),
    }));
  },
  selectItem: (id) => set({ selectedId: id }),
  bringForward: (id) => {
    set((s) => ({
      items: s.items.map((i) =>
        i.item.id === id ? { ...i, zIndex: i.zIndex + 1 } : i
      ),
    }));
  },
  sendBackward: (id) => {
    set((s) => ({
      items: s.items.map((i) =>
        i.item.id === id ? { ...i, zIndex: i.zIndex - 1 } : i
      ),
    }));
  },
  clear: () => set({ items: [], selectedId: null }),
}));

interface TryOnItem {
  itemId: string;
  imageUrl: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  blendMode: BlendMode;
}

interface TryOnState {
  bodyPhoto: string | null;
  layeredItems: TryOnItem[];
  selectedItemId: string | null;
  setBodyPhoto: (url: string | null) => void;
  addItem: (item: { id: string; imageUrl: string }) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<TryOnItem>) => void;
  selectItem: (id: string | null) => void;
  clear: () => void;
}

export const useTryOnStore = create<TryOnState>((set) => ({
  bodyPhoto: null,
  layeredItems: [],
  selectedItemId: null,
  setBodyPhoto: (url) => set({ bodyPhoto: url }),
  addItem: ({ id, imageUrl }) => {
    const newItem: TryOnItem = {
      itemId: id,
      imageUrl,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      opacity: 1,
      blendMode: "normal",
    };
    set((s) => ({
      layeredItems: [...s.layeredItems, newItem],
      selectedItemId: id,
    }));
  },
  removeItem: (id) => {
    set((s) => ({
      layeredItems: s.layeredItems.filter((i) => i.itemId !== id),
      selectedItemId: s.selectedItemId === id ? null : s.selectedItemId,
    }));
  },
  updateItem: (id, updates) => {
    set((s) => ({
      layeredItems: s.layeredItems.map((i) =>
        i.itemId === id ? { ...i, ...updates } : i
      ),
    }));
  },
  selectItem: (id) => set({ selectedItemId: id }),
  clear: () => set({ bodyPhoto: null, layeredItems: [], selectedItemId: null }),
}));
