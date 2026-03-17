import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon, SearchIcon, XIcon } from "lucide-react"

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  placeholder,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      placeholder={placeholder}
      aria-label={typeof placeholder === "string" ? placeholder : undefined}
      {...props}
    />
  )
}
function SelectTrigger({
  className,
  size = "default",
  children,
  hasError,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
  hasError?: boolean
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-error={hasError}
      className={cn(
        "group/select flex w-fit items-center justify-between gap-1.5 rounded-xl border border-border bg-background py-2 pr-2 pl-3 text-sm whitespace-nowrap text-foreground shadow-[0_1px_0_rgba(255,255,255,0.02)] transition-all duration-200 outline-none select-none",
        "hover:border-(--border-hover) hover:bg-(--bg-surface)",
        "focus-visible:border-(--accent) focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklab,var(--accent)_18%,transparent)] focus-visible:outline-none",
        "data-[state=open]:border-(--accent) data-[state=open]:bg-(--bg-surface) data-[state=open]:shadow-[0_14px_34px_rgba(0,0,0,0.24)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[error=true]:border-(--danger) data-[error=true]:ring-4 data-[error=true]:ring-[color-mix(in_oklab,var(--danger)_16%,transparent)]",
        "data-placeholder:text-(--text-secondary)",
        "data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=sm]:rounded-lg",
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-(--text-secondary) transition-transform duration-200 group-data-[state=open]/select:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  showSearch = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  onSearch,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  showSearch?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  onSearch?: (value: string) => void
}) {
  const [searchValue, setSearchValue] = React.useState("")
  const searchRef = React.useRef<HTMLInputElement>(null)
  
  // Check if there are any visible items
  const hasItems = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === SelectItem
  )

  // Auto-focus search input when content opens
  React.useEffect(() => {
    if (showSearch && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [showSearch])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    onSearch?.(value)
  }

  const clearSearch = () => {
    setSearchValue("")
    onSearch?.("")
    searchRef.current?.focus()
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-40 origin-(--radix-select-content-transform-origin) overflow-hidden rounded-xl border border-border bg-(--bg-elevated) text-foreground shadow-[0_20px_60px_rgba(0,0,0,0.32)] ring-1 ring-black/6",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        
        {showSearch && (
          <div className="sticky top-0 z-10 border-b border-border bg-(--bg-elevated) p-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-(--text-secondary)" />
              <input
                ref={searchRef}
                type="text"
                value={searchValue}
                onChange={handleSearch}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-border bg-background py-2 pr-8 pl-8 text-sm outline-none transition-colors focus-visible:border-(--accent) focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--accent)_18%,transparent)]"
                aria-label={searchPlaceholder}
              />
              {searchValue && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-(--text-secondary) hover:bg-(--bg-surface) hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
                  aria-label="Clear search"
                >
                  <XIcon className="size-3" />
                </button>
              )}
            </div>
          </div>
        )}
        
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "p-1",
            "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            showSearch && "max-h-[calc(var(--radix-select-content-available-height)-4rem)]"
          )}
        >
          {hasItems ? children : (
            <div className="py-6 text-center text-sm text-(--text-secondary)">
              {emptyMessage}
            </div>
          )}
        </SelectPrimitive.Viewport>
        
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-[11px] font-medium tracking-[0.08em] text-(--text-secondary) uppercase",
        "select-none", // Prevent selection of labels
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  disabled,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      disabled={disabled}
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2 rounded-lg border border-transparent py-2 pr-8 pl-2.5 text-[13px] text-foreground outline-none select-none",
        "transition-colors duration-150", // Removed transform animation
        "data-highlighted:border-(--border-hover) data-highlighted:bg-(--bg-surface) data-highlighted:text-foreground",
        "data-[state=checked]:bg-(--accent)/5 data-[state=checked]:border-(--accent)/20", // Visual feedback for selected
        "focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-elevated)",
        "data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center text-(--accent)">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText className="flex-1">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center bg-(--bg-elevated) py-1 text-(--text-secondary) hover:bg-(--bg-surface) transition-colors",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon aria-hidden="true" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center bg-(--bg-elevated) py-1 text-(--text-secondary) hover:bg-(--bg-surface) transition-colors",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon aria-hidden="true" />
    </SelectPrimitive.ScrollDownButton>
  )
}

// New component for grouped items with better visual hierarchy
function SelectGroupHeading({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-(--text-secondary)",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupHeading,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}