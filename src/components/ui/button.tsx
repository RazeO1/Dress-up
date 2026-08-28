"use client";

import { type ReactNode, type MouseEventHandler } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "bg-bg-secondary text-text-primary hover:bg-bg-tertiary",
  ghost: "bg-transparent text-text-primary hover:bg-bg-secondary",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-[10px]",
  md: "px-5 py-3 text-base rounded-btn",
  lg: "px-6 py-4 text-lg rounded-btn",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  onClick,
  disabled,
  type = "button",
  ariaLabel,
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
      className={cn(
        "font-semibold transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </motion.button>
  );
}
