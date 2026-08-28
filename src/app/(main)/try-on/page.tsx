"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import {
  Camera, Plus, Sliders
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTryOnStore } from "@/stores/outfit-builder";
import type { Item, TryOnSnapshot } from "@/types";

type BlendMode = "normal" | "multiply" | "overlay";

const blendModes: { value: BlendMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "overlay", label: "Overlay" },
];

export default function TryOnPage() {
  const store = useTryOnStore();
  const [step, setStep] = useState<"upload" | "select" | "edit">("upload");

  const { data: items = [] } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from("items").select("*").order("created_at", { ascending: false });
      return data as Item[];
    },
  });

  const { data: snapshots = [] } = useQuery({
    queryKey: ["try-on-snapshots"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from("try_on_snapshots").select("*").order("created_at", { ascending: false }).limit(12);
      return (data || []) as TryOnSnapshot[];
    },
  });

  // Upload body photo
  const handleBodyUpload = useCallback(async (file: File) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bucket: "body-photos",
        fileName: file.name,
        contentType: file.type,
      }),
    });
    const { data: uploadData } = await res.json();

    const arrayBuffer = await file.arrayBuffer();
    await fetch(uploadData.signedUrl, {
      method: "PUT",
      body: arrayBuffer,
      headers: { "Content-Type": file.type },
    });

    const publicUrl = supabase.storage.from("body-photos").getPublicUrl(uploadData.path).data.publicUrl;
    store.setBodyPhoto(publicUrl);
    setStep("select");
  }, [store]);

  const { getRootProps: bodyProps, getInputProps: bodyInputProps, isDragActive: bodyDragging } = useDropzone({
    onDrop: (files) => files[0] && handleBodyUpload(files[0]),
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: false,
  });

  const addItemToTryOn = (item: Item) => {
    store.addItem({ id: item.id, imageUrl: item.image_url });
    setStep("edit");
  };

  const selectedItem = store.layeredItems.find((i) => i.itemId === store.selectedItemId);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Virtual Try-On</h1>
        <p className="text-text-secondary">Overlay clothing on your body</p>
      </header>

      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <div
              {...bodyProps()}
              className={`p-12 border-2 border-dashed rounded-card text-center cursor-pointer transition-colors ${
                bodyDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent"
              }`}
            >
              <input {...bodyInputProps()} />
              <Camera size={48} className="mx-auto mb-4 text-text-tertiary" />
              <p className="font-medium">Upload your body photo</p>
              <p className="text-sm text-text-tertiary mt-1">JPG, PNG, WebP</p>
            </div>

            {/* Gallery */}
            {snapshots.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold mb-4">Past Try-Ons</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {snapshots.map((s) => (
                    <Card key={s.id} hover className="overflow-hidden cursor-pointer">
                      <div className="relative aspect-square">
                        <Image src={s.composite_image_url} alt="Try-on" fill className="object-cover" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("upload")}>
                ← Back
              </Button>
              <p className="text-text-secondary">Select an item to try on</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  hover
                  className="cursor-pointer overflow-hidden"
                  onClick={() => addItemToTryOn(item)}
                >
                  <div className="relative aspect-square">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {step === "edit" && store.bodyPhoto && (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("select")}>
                ← Add More
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { store.clear(); setStep("upload"); }}>
                Start Over
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Canvas */}
              <div className="lg:col-span-2">
                <div className="relative bg-bg-secondary rounded-card overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src={store.bodyPhoto}
                    alt="Body"
                    fill
                    className="object-contain"
                  />
                  {store.layeredItems.map((layer) => (
                    <div
                      key={layer.itemId}
                      className="absolute cursor-move"
                      style={{
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        width: "40%",
                        aspectRatio: "1",
                        transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                        opacity: layer.opacity,
                        mixBlendMode: layer.blendMode,
                      }}
                      onClick={() => store.selectItem(layer.itemId)}
                    >
                      <Image
                        src={layer.imageUrl}
                        alt=""
                        fill
                        className={`object-contain pointer-events-none ${store.selectedItemId === layer.itemId ? "ring-2 ring-accent" : ""}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Sliders size={18} /> Controls
                  </h3>

                  {selectedItem ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-text-secondary mb-2 block">Position</label>
                        <div className="flex gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={selectedItem.x}
                            onChange={(e) => store.updateItem(selectedItem.itemId, { x: Number(e.target.value) })}
                            className="flex-1"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={selectedItem.y}
                            onChange={(e) => store.updateItem(selectedItem.itemId, { y: Number(e.target.value) })}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-text-secondary mb-2 block">Scale: {selectedItem.scale.toFixed(1)}x</label>
                        <input
                          type="range"
                          min="0.1"
                          max="3"
                          step="0.1"
                          value={selectedItem.scale}
                          onChange={(e) => store.updateItem(selectedItem.itemId, { scale: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-text-secondary mb-2 block">Rotation: {selectedItem.rotation}°</label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={selectedItem.rotation}
                          onChange={(e) => store.updateItem(selectedItem.itemId, { rotation: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-text-secondary mb-2 block">Opacity: {Math.round(selectedItem.opacity * 100)}%</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={selectedItem.opacity}
                          onChange={(e) => store.updateItem(selectedItem.itemId, { opacity: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-text-secondary mb-2 block">Blend Mode</label>
                        <select
                          value={selectedItem.blendMode}
                          onChange={(e) => store.updateItem(selectedItem.itemId, { blendMode: e.target.value as BlendMode })}
                          className="w-full px-3 py-2 bg-bg-secondary rounded-btn"
                        >
                          {blendModes.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                      </div>

                      <Button
                        variant="danger"
                        fullWidth
                        size="sm"
                        onClick={() => store.removeItem(selectedItem.itemId)}
                      >
                        Remove Item
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-text-tertiary text-center py-4">
                      Click an item on the canvas to adjust
                    </p>
                  )}
                </Card>

                <Button fullWidth onClick={() => setStep("select")}>
                  <Plus size={16} className="mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
