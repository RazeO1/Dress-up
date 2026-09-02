import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  function Input({ className, type, ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full border-2 border-[#1A1A1A] bg-[#FFF8F0] px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-[#8A8A7A] focus:border-[#A8FF3E] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)

export { Input }
