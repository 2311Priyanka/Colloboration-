import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gradient-to-b from-primary/90 to-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:from-primary hover:to-primary/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border-2 border-border bg-transparent hover:bg-muted text-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    }
    const sizes = {
      default: "h-11 px-6 py-2 rounded-xl",
      sm: "h-9 rounded-lg px-4 text-xs",
      lg: "h-12 rounded-2xl px-8 text-lg",
      icon: "h-11 w-11 rounded-xl flex items-center justify-center",
    }
    
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
