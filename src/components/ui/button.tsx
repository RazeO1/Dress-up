"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#A8FF3E] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#A8FF3E] border-2 border-[#1A1A1A]",
        secondary:
          "bg-[#FF6B35] text-[#FFF8F0] hover:bg-[#1A1A1A] hover:text-[#FF6B35] border-2 border-[#1A1A1A]",
        destructive:
          "bg-[#FF3366] text-[#FFF8F0] hover:bg-[#1A1A1A] hover:text-[#FF3366] border-2 border-[#1A1A1A]",
        outline:
          "border-2 border-[#1A1A1A] bg-transparent hover:bg-[#1A1A1A] hover:text-[#FFF8F0]",
        ghost:
          "border-2 border-[#1A1A1A] bg-transparent hover:bg-[#F0EDE8] text-[#1A1A1A]",
        link:
          "text-[#1A1A1A] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
