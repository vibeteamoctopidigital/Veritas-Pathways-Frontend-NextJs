import * as React from "react"
import { cn } from "@/lib/utils"

const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80"
          onClick={() => onOpenChange(false)}
        />
      )}
      {children}
    </>
  )
}

const SheetTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <button ref={ref} className={cn(className)} {...props}>
    {children}
  </button>
))
SheetTrigger.displayName = "SheetTrigger"

const SheetContent = React.forwardRef(({ className, children, side = "left", open, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out",
      side === "left" && "inset-y-0 left-0 h-full w-64",
      side === "right" && "inset-y-0 right-0 h-full w-64",
      open ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
SheetContent.displayName = "SheetContent"

export { Sheet, SheetTrigger, SheetContent }
