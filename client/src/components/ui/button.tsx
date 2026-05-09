import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[0.5rem] text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#6C47FF] to-[#5639CC] text-white border border-[#5639CC] shadow-[0_1px_2px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.16)] hover:from-[#7C5AFF] hover:to-[#6344E5] hover:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] focus-visible:ring-2 focus-visible:ring-[#6C47FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
        outline:
          "border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-[var(--bg-surface)] hover:border-[var(--border-hover)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1)] focus-visible:ring-2 focus-visible:ring-[#6C47FF]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
        secondary:
          "bg-[#6C47FF]/10 text-[#6C47FF] border border-[#6C47FF]/15 hover:bg-[#6C47FF]/18 hover:border-[#6C47FF]/25 focus-visible:ring-2 focus-visible:ring-[#6C47FF]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-[#6C47FF]/30",
        destructive:
          "bg-gradient-to-b from-[#EF4444] to-[#DC2626] text-white border border-[#DC2626] shadow-[0_1px_2px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.16)] hover:from-[#F87171] hover:to-[#EF4444] focus-visible:ring-2 focus-visible:ring-[#EF4444]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
        link: "text-[#6C47FF] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xl: "h-11 gap-2 px-5 text-base font-medium has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
