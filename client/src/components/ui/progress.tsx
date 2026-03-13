import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type ProgressProps =
  React.ComponentProps<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string
    indicatorColor?: string
  }

function Progress({
  className,
  indicatorClassName,
  indicatorColor,
  value,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-1 w-full items-center overflow-hidden rounded-full bg-(--border-subtle)",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "size-full flex-1 transition-all duration-500",
          indicatorClassName
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: indicatorColor
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }