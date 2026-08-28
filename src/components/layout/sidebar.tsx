"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Shirt,
  Palette,
  ScanFace,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/wardrobe", icon: Shirt, label: "Wardrobe" },
  { href: "/outfits", icon: Palette, label: "Outfits" },
  { href: "/try-on", icon: ScanFace, label: "Try On" },
  { href: "/family", icon: Users, label: "Family" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-bg-secondary border-r border-border p-4">
      <div className="flex items-center gap-3 px-3 py-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
          <span className="text-white text-xl">👗</span>
        </div>
        <span className="text-xl font-bold">Wardrobe</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-btn transition-colors",
                  isActive ? "bg-accent text-white" : "hover:bg-bg-tertiary text-text-secondary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
                  />
                )}
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border">
        <ThemeToggle />
      </div>
    </aside>
  );
}
