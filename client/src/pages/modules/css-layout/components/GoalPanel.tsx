import { Lightbulb, SkipForward } from "lucide-react"
import type { CssChallenge } from "../types"
import LayoutPreview from "./LayoutPreview"

interface GoalPanelProps {
  challenge: CssChallenge
  matchPercent: number
  showHint: boolean
  onToggleHint: () => void
  onSkip: () => void
}

/* Thin SVG progress ring */
function ProgressRing({ percent }: { percent: number }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={88} height={88} className="-rotate-90">
        <circle cx={44} cy={44} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={5} />
        <circle
          cx={44}
          cy={44}
          r={r}
          fill="none"
          stroke={percent === 100 ? "var(--success)" : "var(--accent)"}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.3s ease" }}
        />
        <text
          x={44}
          y={44}
          fill={percent === 100 ? "var(--success)" : "var(--accent)"}
          fontFamily="JetBrains Mono, monospace"
          fontSize={17}
          fontWeight={700}
          textAnchor="middle"
          dominantBaseline="central"
          transform="rotate(90 44 44)"
        >
          {percent}%
        </text>
      </svg>
      <span className="font-mono text-[10px] text-(--text-tertiary)">Match</span>
    </div>
  )
}

export default function GoalPanel({
  challenge,
  matchPercent,
  showHint,
  onToggleHint,
  onSkip,
}: GoalPanelProps) {
  const topicColor = challenge.topic === "flexbox" ? "#6366f1" : "#06b6d4"
  const topicLabel = challenge.topic === "flexbox" ? "Flexbox" : "CSS Grid"

  return (
    <aside className="flex w-[30%] min-w-55 flex-col gap-4 overflow-y-auto border-l border-border bg-(--bg-elevated) p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="font-grotesk text-[15px] font-bold leading-snug text-foreground">
            {challenge.title}
          </h2>
          <span
            className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]"
            style={{ background: topicColor + "18", color: topicColor }}
          >
            {topicLabel}
          </span>
        </div>
        <span className="shrink-0 rounded-md bg-[rgba(99,102,241,0.1)] px-2 py-1 font-mono text-[11px] font-semibold text-(--accent)">
          +{challenge.xp} XP
        </span>
      </div>

      {/* Progress ring */}
      <div className="flex justify-center">
        <ProgressRing percent={matchPercent} />
      </div>

      {/* Challenge description */}
      <div className="rounded-xl border border-border bg-(--bg-surface) p-3.5">
        <p className="text-[12px] leading-relaxed text-(--text-secondary)">
          {challenge.description}
        </p>
      </div>

      {/* Goal preview */}
      <div className="flex flex-col gap-1.5 flex-1 min-h-0">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-(--text-tertiary)">
          Goal Layout
        </span>
        <div className="flex-1 min-h-45 overflow-hidden rounded-xl border border-border">
          <LayoutPreview html={challenge.htmlTemplate} css={challenge.goalCss} scale={0.5} />
        </div>
      </div>

      {/* Hint box */}
      {showHint && (
        <div className="rounded-xl border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.07)] p-3.5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-(--accent)">
              Hint
            </span>
            <button
              onClick={onToggleHint}
              className="text-base leading-none text-(--text-tertiary) hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-[12px] leading-relaxed text-(--text-secondary)">{challenge.hint}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={onToggleHint}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--bg-surface) px-3 py-2.5 text-[13px] text-(--text-secondary) transition-colors hover:bg-border"
        >
          <Lightbulb size={13} />
          {showHint ? "Hide Hint" : "Need a Hint?"}
        </button>
        <button
          onClick={onSkip}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-transparent px-3 py-2 text-xs text-(--text-tertiary) transition-colors hover:text-(--text-secondary)"
        >
          <SkipForward size={11} />
          Skip this mission
        </button>
      </div>
    </aside>
  )
}
