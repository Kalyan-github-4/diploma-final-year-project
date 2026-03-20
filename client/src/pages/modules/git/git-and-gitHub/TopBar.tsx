import AIAssistant from "@/components/layout/ai/ai-assistant"

interface TopBarProps {
  missionTitle: string
  timer: number
  onRunTest: () => void
  onGenerateNewSet?: () => void
  isGenerating?: boolean
  module?: string
  topic?: string
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

export default function TopBar({ missionTitle, timer, onRunTest, onGenerateNewSet, isGenerating, module, topic }: TopBarProps) {
  return (
    <div className="flex min-h-14 items-center justify-between border-b border-border bg-(--bg-elevated) px-6 py-3">
      {/* Left */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-(--text-secondary)">Mission:</span>
        <span className="text-base font-bold text-foreground font-grotesk">{missionTitle}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(99,102,241,0.12)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.5px] text-(--accent)">
          <span className="size-1.5 animate-pulse rounded-full bg-(--accent)" />
          Live Session
        </span>
      </div>

      {/* Center */}
      <div className="font-mono text-sm text-foreground">
        <span className="mr-1 text-(--text-secondary)">Time:</span>
        {formatTime(timer)}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <AIAssistant module={module} topic={topic} />
        <button
          className="rounded-lg border border-border bg-(--bg-surface) px-4 py-2 font-mono text-[12px] text-foreground transition-colors hover:bg-(--bg-elevated) disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onGenerateNewSet}
          disabled={!onGenerateNewSet || !!isGenerating}
        >
          {isGenerating ? "Generating..." : "New Mission Set"}
        </button>
        <button
          className="rounded-lg bg-(--accent) px-5 py-2 font-mono text-[13px] text-white transition-colors hover:bg-(--accent-hover)"
          onClick={onRunTest}
        >
          Run Test
        </button>
      </div>
    </div>
  )
}
