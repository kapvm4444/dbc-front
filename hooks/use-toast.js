"use client"
import { useState, useCallback } from "react"

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, title, description, variant }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg max-w-sm ${
            toast.variant === "destructive" ? "bg-red-600 text-white" : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{toast.title}</h4>
              {toast.description && <p className="text-sm mt-1 opacity-90">{toast.description}</p>}
            </div>
            <button onClick={() => dismiss(toast.id)} className="ml-4 text-lg leading-none hover:opacity-70">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
