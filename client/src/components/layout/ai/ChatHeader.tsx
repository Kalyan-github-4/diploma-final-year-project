import { Sparkles, Trash2, X } from "lucide-react"

interface ChatHeaderProps {
  model: string
  isLoading: boolean
  onClear: () => void
  onClose: () => void
}

export function ChatHeader({ model, isLoading, onClear, onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-(--bg-elevated) shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C47FF]/10">
          <Sparkles size={15} className="text-[#6C47FF]" />
        </div>
        <div>
          <h2 className="text-[13px] font-semibold text-foreground leading-none">AI Assistant</h2>
          <p className="text-[11px] text-(--text-tertiary) font-mono flex items-center gap-1.5 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${isLoading ? "bg-[#F59E0B] animate-pulse" : "bg-green-500"}`} />
            {model}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-tertiary) hover:text-(--text-secondary) hover:bg-(--bg-surface) transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Clear conversation"
          aria-label="Clear chat"
        >
          <Trash2 size={13} />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-tertiary) hover:text-(--text-secondary) hover:bg-(--bg-surface) transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
