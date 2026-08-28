"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const features = [
  { emoji: "👕", title: "Organize Your Wardrobe", desc: "Upload and categorize your clothes" },
  { emoji: "✨", title: "Create Outfits", desc: "Mix and match items effortlessly" },
  { emoji: "📸", title: "Virtual Try-On", desc: "See how outfits look on you" },
];

export default function OnboardingPage() {
  const router = useRouter();

  const handleSkip = async () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-primary">
      <ThemeToggle className="absolute top-4 right-4" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Wardrobe!</h1>
          <p className="text-text-secondary">Your virtual closet awaits</p>
        </div>

        <div className="space-y-4 mb-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 bg-bg-elevated rounded-card"
            >
              <span className="text-3xl">{f.emoji}</span>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-text-secondary">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Button fullWidth onClick={handleSkip}>
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}
