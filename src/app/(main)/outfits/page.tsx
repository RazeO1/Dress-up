"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  useDroppable,
} from "@dnd-kit/core";
import {
  Plus, Save, X, Heart, Trash2, ChevronUp, ChevronDown, ImagePlus
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useOutfitBuilderStore, type CanvasItemState } from "@/stores/outfit-builder";
import type { Item, Outfit } from "@/types";

export default function OutfitsPage() {
  const [building, setBuilding] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from("items").select("*").order("created_at", { ascending: false });
      return data as Item[];
    },
  });

  const { data: outfits = [] } = useQuery({
    queryKey: ["outfits"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from("outfits").select("*").order("created_at", { ascending: false });
      return (data || []) as Outfit[];
    },
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Outfits</h1>
          <p className="text-text-secondary">{outfits.length} saved</p>
        </div>
        <Button onClick={() => setBuilding(true)}>
          <Plus size={20} className="mr-2" />
          New Outfit
        </Button>
      </header>

      {outfits.length === 0 ? (
        <div className="text-center py-16">
          <ImagePlus size={48} className="mx-auto mb-4 text-text-tertiary" />
          <p className="text-text-secondary mb-4">No outfits yet</p>
          <Button onClick={() => setBuilding(true)}>Create Your First Outfit</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {outfits.map((outfit) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card hover className="cursor-pointer overflow-hidden">
                <div className="relative aspect-square bg-bg-secondary">
                  {outfit.cover_image_url ? (
                    <Image
                      src={outfit.cover_image_url}
                      alt={outfit.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImagePlus size={32} className="text-text-tertiary" />
                    </div>
                  )}
                  {outfit.is_favorite && (
                    <Heart size={20} className="absolute top-2 right-2 fill-red-500 text-red-500" />
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium truncate">{outfit.name}</p>
                  <p className="text-xs text-text-tertiary">{outfit.item_ids.length} items</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {building && (
          <OutfitBuilder items={items} onClose={() => { setBuilding(false); useOutfitBuilderStore.getState().clear(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

function OutfitBuilder({ items, onClose }: { items: Item[]; onClose: () => void }) {
  const builder = useOutfitBuilderStore();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    if (!name || builder.items.length === 0) return;
    setSaving(true);

    const itemIds = builder.items.map((i) => i.item.id);

    await fetch("/api/outfits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || null,
        item_ids: itemIds,
      }),
    });

    setSaving(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-bg-primary flex flex-col"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onClose} className="p-2">
          <X size={20} />
        </button>
        <h2 className="font-bold">New Outfit</h2>
        <Button size="sm" onClick={handleSave} disabled={!name || builder.items.length === 0 || saving}>
          <Save size={16} className="mr-1" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Items */}
        <div className="w-32 md:w-48 bg-bg-secondary border-r border-border overflow-y-auto p-2">
          <p className="text-xs font-semibold text-text-secondary px-2 py-1">Items</p>
          <div className="space-y-2">
            {items.map((item) => (
              <DraggableItem key={item.id} item={item} onAdd={() => builder.addItem(item)} />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <DroppableCanvas />

        {/* Right Sidebar - Settings */}
        <div className="w-64 bg-bg-secondary border-l border-border p-4 overflow-y-auto">
          <div className="space-y-3">
            <Input
              label="Name"
              placeholder="My Outfit"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              label="Description"
              placeholder="Notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2 px-1">Background</p>
              <div className="flex gap-2">
                {["#ffffff", "#f2f2f7", "#e5e5ea", "#000000"].map((color) => (
                  <button
                    key={color}
                    onClick={() => builder.setBackground(color)}
                    className="w-8 h-8 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DraggableItem({ item, onAdd }: { item: Item; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="relative aspect-square w-full bg-bg-elevated rounded-img overflow-hidden hover:ring-2 hover:ring-accent transition-all"
    >
      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="100px" />
      <div className="absolute top-1 right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
        <Plus size={12} className="text-white" />
      </div>
    </button>
  );
}

function DroppableCanvas() {
  const builder = useOutfitBuilderStore();
  const { setNodeRef } = useDroppable({ id: "canvas" });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 relative overflow-hidden transition-colors"
      style={{ backgroundColor: builder.background }}
      onClick={() => builder.selectItem(null)}
    >
      {builder.items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-text-tertiary">
          <div className="text-center">
            <ImagePlus size={48} className="mx-auto mb-2" />
            <p>Click items to add them to your outfit</p>
          </div>
        </div>
      )}

      {builder.items.map((canvasItem) => (
        <CanvasItem key={canvasItem.item.id} canvasItem={canvasItem} />
      ))}
    </div>
  );
}

function CanvasItem({ canvasItem }: { canvasItem: CanvasItemState }) {
  const [dragging, setDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0, mouseX: 0, mouseY: 0 });
  const builder = useOutfitBuilderStore();
  const isSelected = builder.selectedId === canvasItem.item.id;

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    builder.selectItem(canvasItem.item.id);
    setDragging(true);
    startPos.current = {
      x: canvasItem.x,
      y: canvasItem.y,
      mouseX: e.clientX,
      mouseY: e.clientY,
    };
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - startPos.current.mouseX;
      const dy = e.clientY - startPos.current.mouseY;
      builder.updateItem(canvasItem.item.id, {
        x: startPos.current.x + dx,
        y: startPos.current.y + dy,
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, canvasItem.item.id, builder]);

  return (
    <div
      onMouseDown={onMouseDown}
      className={`absolute cursor-move select-none ${isSelected ? "ring-2 ring-accent rounded-img" : ""}`}
      style={{
        left: canvasItem.x,
        top: canvasItem.y,
        zIndex: canvasItem.zIndex,
        transform: `rotate(${canvasItem.rotation}deg) scale(${canvasItem.scale})`,
        transformOrigin: "center",
      }}
    >
      <Image
        src={canvasItem.item.image_url}
        alt={canvasItem.item.name}
        width={150}
        height={150}
        className="w-32 h-32 md:w-40 md:h-40 object-contain pointer-events-none"
        draggable={false}
      />
      {isSelected && (
        <div className="absolute -top-10 left-0 flex gap-1 bg-bg-elevated rounded-full shadow-md p-1">
          <button
            onClick={(e) => { e.stopPropagation(); builder.bringForward(canvasItem.item.id); }}
            className="p-1.5 hover:bg-bg-secondary rounded-full"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); builder.sendBackward(canvasItem.item.id); }}
            className="p-1.5 hover:bg-bg-secondary rounded-full"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); builder.removeItem(canvasItem.item.id); }}
            className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-full"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
