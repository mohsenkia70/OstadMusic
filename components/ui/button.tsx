import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  {
    variants: {
      variant: {
        gold: "bg-gradient-to-br from-gold to-[#0f766e] text-[#181209] shadow-[0_6px_24px_rgba(13,148,136,0.28)] hover:shadow-[0_10px_34px_rgba(13,148,136,0.42)] hover:-translate-y-0.5",
        glass:
          "bg-ink/[0.04] text-ink border border-ink/10 backdrop-blur-md hover:bg-ink/[0.07] hover:border-ink/20 hover:-translate-y-0.5",
        ghost: "text-ink/80 hover:text-ink",
        outline: "border border-line text-ink hover:border-gold/40 hover:bg-surface",
        danger: "bg-red-500/10 text-red-700 border border-red-500/25 hover:bg-red-500/15",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
