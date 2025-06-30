"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  return <div className="relative inline-block text-left">{children}</div>
}

export function DropdownMenuTrigger({ asChild, children, ...props }) {
  return <div {...props}>{children}</div>
}

export function DropdownMenuContent({ className, align = "center", forceMount, children, ...props }) {
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md",
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

export function DropdownMenuItem({ className, asChild, children, ...props }) {
  const Component = asChild ? "div" : "button"

  return (
    <Component
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export function DropdownMenuSeparator({ className, ...props }) {
  return <div className={cn("-mx-1 my-1 h-px bg-gray-200", className)} {...props} />
}
