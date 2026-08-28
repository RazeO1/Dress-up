"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  hover?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ hover, className, children, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "bg-bg-elevated rounded-card shadow-sm overflow-hidden",
        className
      )}
      onClick={props.onClick}
    >
      {children}
    </motion.div>
  );
}
