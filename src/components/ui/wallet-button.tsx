import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const walletButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-warm",
        connect: "bg-gradient-hero text-white hover:opacity-90 shadow-glow",
        outline: "border border-primary bg-background hover:bg-secondary text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface WalletButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof walletButtonVariants> {}

const WalletButton = React.forwardRef<HTMLButtonElement, WalletButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(walletButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
WalletButton.displayName = "WalletButton"

export { WalletButton, walletButtonVariants }