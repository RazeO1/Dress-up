import { ScanFace } from "lucide-react";

export default function TryOnPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Virtual Try-On</h1>
      <p className="text-text-secondary mb-8">Coming in Phase 5</p>
      <div className="bg-bg-elevated rounded-card p-12 text-center">
        <ScanFace size={48} className="mx-auto mb-4 text-text-tertiary" />
        <p className="text-text-secondary">Virtual try-on coming soon</p>
      </div>
    </div>
  );
}
