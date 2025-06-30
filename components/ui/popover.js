"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Popover({ open, onOpenChange, children }) {
  const [isOpen, setIsOpen] = useState(open || false)

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen)
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  return <div className="relative inline-block">{children}</div>
}

export function PopoverTrigger({ asChild, children, ...props }) {
  return <div {...props}>{children}</div>
}

export function PopoverContent({ className, align = "center", children, ...props }) {
  return (
    <div
      className={cn(
        "absolute z-50 w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none",
        align === "end" && "right-0",
        align === "start" && "left-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
