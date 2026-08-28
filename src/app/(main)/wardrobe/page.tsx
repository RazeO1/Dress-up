"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import {
  Upload, Search, X, Trash2, Image as ImageIcon
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { extractDominantColor } from "@/lib/utils/color";
import { validateImage } from "@/lib/utils/image";
import type { Item, Category } from "@/types";

const categories: { value: Category | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "✨" },
  { value: "tops", label: "Tops", emoji: "👕" },
  { value: "bottoms", label: "Bottoms", emoji: "👖" },
  { value: "dresses", label: "Dresses", emoji: "👗" },
  { value: "outerwear", label: "Outerwear", emoji: "🧥" },
  { value: "shoes", label: "Shoes", emoji: "👟" },
  { value: "accessories", label: "Accessories", emoji: "👜" },
];

export default function WardrobePage() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["items", selectedCategory, search],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      const { data } = await query;
      return data as Item[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      await supabase.from("items").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setSelectedItem(null);
    },
  });

  // Upload handler
  const handleUpload = useCallback(async (files: File[]) => {
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const file of files) {
      const validation = validateImage(file);
      if (!validation.valid) {
        alert(validation.error);
        continue;
      }

      try {
        // Get signed upload URL
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bucket: "wardrobe-images",
            fileName: file.name,
            contentType: file.type,
          }),
        });
        const { data: uploadData } = await res.json();

        // Upload file
        const arrayBuffer = await file.arrayBuffer();
        await fetch(uploadData.signedUrl, {
          method: "PUT",
          body: arrayBuffer,
          headers: { "Content-Type": file.type },
        });

        // Extract dominant color
        const colorHex = await extractDominantColor(uploadData.path);

        // Create item
        const publicUrl = supabase.storage
          .from("wardrobe-images")
          .getPublicUrl(uploadData.path).data.publicUrl;

        await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name.replace(/\.[^/.]+$/, ""),
            category: "tops",
            image_url: publicUrl,
            color_hex: colorHex,
          }),
        });
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    queryClient.invalidateQueries({ queryKey: ["items"] });
    setUploading(false);
  }, [queryClient]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: true,
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Wardrobe</h1>
          <p className="text-text-secondary">{items.length} items</p>
        </div>
      </header>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
        <input
          type="text"
          placeholder="Search your wardrobe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-bg-secondary rounded-btn text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === cat.value
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            <span className="mr-1.5">{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`mb-6 p-8 border-2 border-dashed rounded-card text-center cursor-pointer transition-colors ${
          isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent"
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={32} className="mx-auto mb-2 text-text-tertiary" />
        <p className="font-medium">
          {isDragActive ? "Drop images here" : "Drag & drop or click to upload"}
        </p>
        <p className="text-sm text-text-tertiary mt-1">JPG, PNG, WebP up to 10MB</p>
        {uploading && <p className="text-accent mt-2">Uploading...</p>}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-img" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon size={48} className="mx-auto mb-4 text-text-tertiary" />
          <p className="text-text-secondary">Your wardrobe is empty</p>
          <p className="text-sm text-text-tertiary mt-1">Upload some items to get started</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Card
                  hover
                  className="cursor-pointer overflow-hidden"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {item.color_hex && (
                      <div
                        className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: item.color_hex }}
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-text-tertiary capitalize">{item.category}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </div>
  );
}

// Item Detail Modal
function ItemDetailModal({
  item,
  onClose,
  onDelete,
}: {
  item: Item | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  if (!item) return null;

  return (
    <Modal open={!!item} onClose={onClose} size="md">
      <div className="relative">
        <Image
          src={item.image_url}
          alt={item.name}
          width={600}
          height={600}
          className="w-full aspect-square object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{item.name}</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-bg-secondary rounded-full text-sm capitalize">
            {item.category}
          </span>
          {item.color_hex && (
            <span
              className="w-6 h-6 rounded-full border border-border"
              style={{ backgroundColor: item.color_hex }}
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="danger" onClick={() => onDelete(item.id)} className="flex-1">
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
