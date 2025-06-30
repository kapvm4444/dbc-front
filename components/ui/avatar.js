import { cn } from "@/lib/utils"

export function Avatar({ className, children, ...props }) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}>
      {children}
    </div>
  )
}

export function AvatarImage({ className, src, alt, ...props }) {
  return (
    <img
      className={cn("aspect-square h-full w-full object-cover", className)}
      src={src || "/placeholder.svg"}
      alt={alt}
      {...props}
    />
  )
}

export function AvatarFallback({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
