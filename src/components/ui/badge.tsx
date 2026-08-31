import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-normal uppercase tracking-wider border",
  {
    variants: {
      variant: {
        default: "bg-[#1A1A1A] text-[#FFF8F0] border-[#1A1A1A]",
        outline: "bg-transparent text-[#1A1A1A] border-[#1A1A1A]",
        tangerine: "bg-[#FF6B35] text-[#FFF8F0] border-[#1A1A1A]",
        accent: "bg-[#A8FF3E] text-[#1A1A1A] border-[#1A1A1A]",
        destructive: "bg-[#FF3366] text-[#FFF8F0] border-[#1A1A1A]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
