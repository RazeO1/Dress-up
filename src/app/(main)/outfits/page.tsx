import { Palette } from "lucide-react";

export default function OutfitsPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Outfits</h1>
      <p className="text-text-secondary mb-8">Coming in Phase 4</p>
      <div className="bg-bg-elevated rounded-card p-12 text-center">
        <Palette size={48} className="mx-auto mb-4 text-text-tertiary" />
        <p className="text-text-secondary">Outfit builder coming soon</p>
      </div>
    </div>
  );
}
