import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  LayoutDashboard,
  BookOpen,
  Code2,
  TrendingUp,
  Target,
  Trophy,
  Clock,
} from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Modules", icon: BookOpen, path: "/modules" },
  { label: "Playground", icon: Code2, path: "/playground" },
  { label: "Progress", icon: TrendingUp, path: "/progress" },
  { label: "Missions", icon: Target, path: "/missions" },
  { label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
]

const recentItems = [
  { label: "Binary Search Mission", icon: Clock },
  { label: "JavaScript Basics", icon: Clock },
]

export default function SearchCommand() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (path: string) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-(--border-subtle) bg-(--bg-surface) hover:border-(--border-hover) hover:bg-(--bg-elevated) transition-all cursor-pointer"
      >
        <Search className="w-4 h-4 text-(--text-tertiary)" />
        <span className="text-(--text-tertiary)">Search...</span>
        <kbd className="ml-8 text-[11px] text-(--text-tertiary) border border-(--border-subtle) bg-(--bg-primary) px-1.5 py-0.5 rounded font-mono">
          Ctrl K
        </kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="bg-(--bg-elevated)">
          <CommandInput placeholder="Type to search..." />

          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-4">
                <Search className="w-8 h-8 text-(--text-tertiary) opacity-40" />
                <p className="text-(--text-tertiary)">No results found.</p>
              </div>
            </CommandEmpty>

            <CommandGroup heading="Pages">
              {navItems.map((item) => (
                <CommandItem
                  key={item.path}
                  onSelect={() => handleSelect(item.path)}
                >
                  <item.icon className="size-4 text-(--text-tertiary)" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator className="mx-2 bg-(--border-subtle)" />

            <CommandGroup heading="Recent">
              {recentItems.map((item) => (
                <CommandItem key={item.label}>
                  <item.icon className="size-4 text-(--text-tertiary)" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-(--border-subtle) px-4 py-2.5 text-[11px] text-(--text-tertiary)">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-(--border-subtle) bg-(--bg-surface) font-mono text-[10px]">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-(--border-subtle) bg-(--bg-surface) font-mono text-[10px]">↵</kbd>
                select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-(--border-subtle) bg-(--bg-surface) font-mono text-[10px]">esc</kbd>
              close
            </span>
          </div>
        </Command>
      </CommandDialog>
    </>
  )
}