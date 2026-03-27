import { ArrowLeft, ChevronLeft, ChevronRight, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { CssChallenge } from "../types"

interface CssTopBarProps {
  challenge: CssChallenge
  challengeIndex: number
  totalChallenges: number
  sessionXp: number
  completedIds: Set<string>
  onPrev: () => void
  onNext: () => void
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "#22c55e",
  intermediate: "#f59e0b",
  advanced: "#ef4444",
}

export default function CssTopBar({
  challenge,
  challengeIndex,
  totalChallenges,
  sessionXp,
  completedIds,
  onPrev,
  onNext,
}: CssTopBarProps) {
  const navigate = useNavigate()
  const topicColor = challenge.topic === "flexbox" ? "#6366f1" : "#06b6d4"
  const diffColor = DIFFICULTY_COLORS[challenge.difficulty]

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-border bg-(--bg-elevated) px-4">
      {/* Left: back + module name */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/modules")}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-(--text-secondary) transition-colors hover:bg-(--bg-surface) hover:text-foreground"
        >
          <ArrowLeft size={14} />
          <span className="font-grotesk font-semibold text-[13px]">CSS Layout</span>
        </button>

        <span className="text-(--border-hover)">›</span>

        {/* Topic badge */}
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em]"
          style={{ background: topicColor + "18", color: topicColor }}
        >
          {challenge.topic === "flexbox" ? "Flexbox" : "CSS Grid"}
        </span>
      </div>

      {/* Center: challenge nav */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={challengeIndex === 0}
          className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-secondary) transition-colors hover:bg-(--bg-surface) disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} />
        </button>

        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors ${completedIds.has(challenge.id) ? "bg-(--success)" : "bg-(--accent)"}`}
          />
          <span className="font-grotesk text-[13px] font-semibold text-foreground">
            {challenge.title}
          </span>
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase"
            style={{ background: diffColor + "18", color: diffColor }}
          >
            {challenge.difficulty}
          </span>
        </div>

        <button
          onClick={onNext}
          disabled={challengeIndex === totalChallenges - 1}
          className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-secondary) transition-colors hover:bg-(--bg-surface) disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={15} />
        </button>

        <span className="font-mono text-[11px] text-(--text-tertiary)">
          {challengeIndex + 1}/{totalChallenges}
        </span>
      </div>

      {/* Right: session XP */}
      <div className="flex items-center gap-2">
        {sessionXp > 0 && (
          <div className="flex items-center gap-1.5 rounded-lg bg-[rgba(99,102,241,0.1)] px-3 py-1.5">
            <Zap size={12} className="text-(--accent)" />
            <span className="font-mono text-[12px] font-bold text-(--accent)">
              +{sessionXp} XP
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
