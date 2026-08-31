"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("[&_tr]:border-b-2 [&_tr]:border-[#1A1A1A]", className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot className={cn("border-t-2 border-[#1A1A1A] bg-[#F0EDE8] font-medium", className)} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b-2 border-[#1A1A1A] transition-colors hover:bg-[#F0EDE8]", className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle text-[11px] font-normal uppercase tracking-wider text-[#8A8A7A] [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn("px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption className={cn("mt-4 text-sm text-[#8A8A7A]", className)} {...props} />
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
