"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Shirt, Palette, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [stats, setStats] = useState({ items: 0, outfits: 0, favorites: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setUser({
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "there",
        email: user.email || "",
      });

      const [items, outfits, favorites] = await Promise.all([
        supabase.from("items").select("id", { count: "exact", head: true }),
        supabase.from("outfits").select("id", { count: "exact", head: true }),
        supabase.from("outfits").select("id", { count: "exact", head: true }).eq("is_favorite", true),
      ]);

      setStats({
        items: items.count || 0,
        outfits: outfits.count || 0,
        favorites: favorites.count || 0,
      });
      setLoading(false);
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hi, {user?.name || "there"} 👋</h1>
          <p className="text-text-secondary">Welcome to your wardrobe</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={18} />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        {[
          { label: "Items", value: stats.items, icon: Shirt, color: "bg-blue-500" },
          { label: "Outfits", value: stats.outfits, icon: Palette, color: "bg-purple-500" },
          { label: "Favorites", value: stats.favorites, icon: Heart, color: "bg-pink-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4">
              <div className={`w-10 h-10 rounded-btn ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold">
                {loading ? <Skeleton className="h-7 w-12" /> : stat.value}
              </p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/wardrobe">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Card hover className="p-6 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-btn bg-accent flex items-center justify-center">
                  <Shirt size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">My Wardrobe</h3>
                  <p className="text-sm text-text-secondary">View & manage your items</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Link>

        <Link href="/outfits">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Card hover className="p-6 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-btn bg-purple-500 flex items-center justify-center">
                  <Palette size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Create Outfit</h3>
                  <p className="text-sm text-text-secondary">Mix and match items</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Link>
      </div>

      <Link href="/outfits">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center z-30"
        >
          <Plus size={24} />
        </motion.button>
      </Link>
    </div>
  );
}
