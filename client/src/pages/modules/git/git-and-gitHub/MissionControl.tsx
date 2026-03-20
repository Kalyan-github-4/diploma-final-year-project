import { Lightbulb } from "lucide-react"
import type { MissionStep } from "@/lib/mission.utils"
import ProgressCircle from "./ProgressCircle"
import StepList from "./StepList"
import HintBox from "./HintBox"

interface MissionControlProps {
  xp: number
  steps: MissionStep[]
  currentStep: number
  completedSteps: string[]
  showHint: boolean
  teamSync?: {
    branch: string
    upstream: string | null
    aheadBy: number
    behindBy: number
    remoteBranches: string[]
  }
  prStatus?: {
    id: number
    fromBranch: string
    toBranch: string
    checks: "pending" | "passed" | "failed"
    reviewStatus: "pending" | "changes-requested" | "approved"
    status: "open" | "closed" | "merged"
  } | null
  coachingTips?: string[]
  onToggleHint: () => void
  onSkip: () => void
}

export default function MissionControl({
  xp,
  steps,
  currentStep,
  completedSteps,
  showHint,
  teamSync,
  prStatus,
  coachingTips,
  onToggleHint,
  onSkip,
}: MissionControlProps) {
  const completed = completedSteps.length
  const total = steps.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  /* Current hint text */
  const currentHint = steps[currentStep]?.hint || "No hint available."

  return (
    <aside className="flex w-[300px] min-w-[300px] flex-col gap-6 overflow-y-auto border-l border-border bg-(--bg-elevated) p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground font-grotesk">Mission Control</h2>
        <span className="rounded-md bg-[rgba(99,102,241,0.12)] px-2.5 py-1 font-mono text-xs font-semibold text-(--accent)">{xp} XP</span>
      </div>

      {/* Progress */}
      <ProgressCircle percentage={percentage} completed={completed} total={total} />

      {/* Steps */}
      <StepList steps={steps} currentStep={currentStep} completedSteps={completedSteps} />

      {/* Local vs Remote Sync */}
      {teamSync && teamSync.remoteBranches.length > 0 && (
        <section className="rounded-xl border border-border bg-(--bg-surface) p-3.5">
          <h3 className="m-0 mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-(--text-secondary) font-mono">
            Local vs Remote
          </h3>
          <p className="m-0 text-xs text-foreground">
            Branch: <strong>{teamSync.branch}</strong>
          </p>
          <p className="mt-1 text-xs text-(--text-secondary)">
            Upstream: <strong>{teamSync.upstream ?? "Not set"}</strong>
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border bg-(--bg-elevated) px-2 py-1.5 text-xs">
              <span className="text-(--text-secondary)">Ahead</span>
              <p className="m-0 font-semibold text-foreground">{teamSync.aheadBy}</p>
            </div>
            <div className="rounded-lg border border-border bg-(--bg-elevated) px-2 py-1.5 text-xs">
              <span className="text-(--text-secondary)">Behind</span>
              <p className="m-0 font-semibold text-foreground">{teamSync.behindBy}</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="m-0 mb-1 text-[11px] uppercase tracking-[0.04em] text-(--text-tertiary)">
              Remote refs
            </p>
            <ul className="m-0 list-disc pl-4 text-xs text-(--text-secondary)">
              {teamSync.remoteBranches.slice(0, 4).map((ref) => (
                <li key={ref}>{ref}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {prStatus && (
        <section className="rounded-xl border border-border bg-(--bg-surface) p-3.5">
          <h3 className="m-0 mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-(--text-secondary) font-mono">
            Pull Request
          </h3>
          <p className="m-0 text-xs text-foreground">
            PR #{prStatus.id} {prStatus.fromBranch} → {prStatus.toBranch}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border bg-(--bg-elevated) px-2 py-1.5">
              <span className="text-(--text-secondary)">Checks</span>
              <p className="m-0 font-semibold text-foreground">{prStatus.checks}</p>
            </div>
            <div className="rounded-lg border border-border bg-(--bg-elevated) px-2 py-1.5">
              <span className="text-(--text-secondary)">Review</span>
              <p className="m-0 font-semibold text-foreground">{prStatus.reviewStatus}</p>
            </div>
          </div>
          <p className="mt-2 mb-0 text-xs text-(--text-secondary)">Status: <strong>{prStatus.status}</strong></p>
        </section>
      )}

      {coachingTips && coachingTips.length > 0 && (
        <section className="rounded-xl border border-border bg-(--bg-surface) p-3.5">
          <h3 className="m-0 mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-(--text-secondary) font-mono">
            Coach Suggestions
          </h3>
          <ul className="m-0 list-disc pl-4 text-xs text-(--text-secondary)">
            {coachingTips.slice(0, 3).map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Hint */}
      {showHint && <HintBox hint={currentHint} onClose={onToggleHint} />}

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-2">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--bg-surface) px-2.5 py-2.5 text-[13px] text-(--text-secondary) transition-colors hover:bg-border" onClick={onToggleHint}>
          <Lightbulb size={14} />
          {showHint ? "Hide Hint" : "Need a Hint?"}
        </button>
        <button className="w-full rounded-lg bg-transparent px-2.5 py-2.5 text-xs text-(--text-tertiary) transition-colors hover:text-(--text-secondary)" onClick={onSkip}>
          Skip This Mission
        </button>
      </div>
    </aside>
  )
}
