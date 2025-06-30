"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export function Select({ value, onValueChange, disabled, children }) {
  const [isOpen, setIsOpen] = useState(false)
  return <div className="relative">{children}</div>
}

export function SelectTrigger({ className, children, ...props }) {
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectValue({ placeholder, ...props }) {
  return <span {...props}>{placeholder}</span>
}

export function SelectContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SelectItem({ className, value, children, ...props }) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
