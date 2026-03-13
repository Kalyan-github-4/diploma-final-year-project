import { Lightbulb } from "lucide-react"
import type { MissionStep } from "@/lib/mission.utils"
import ProgressCircle from "./ProgressCircle"
import StepList from "./StepList"
import HintBox from "./HintBox"
import "./MissionControl.css"

interface MissionControlProps {
  xp: number
  steps: MissionStep[]
  currentStep: number
  completedSteps: string[]
  showHint: boolean
  onToggleHint: () => void
  onSkip: () => void
}

export default function MissionControl({
  xp,
  steps,
  currentStep,
  completedSteps,
  showHint,
  onToggleHint,
  onSkip,
}: MissionControlProps) {
  const completed = completedSteps.length
  const total = steps.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  /* Current hint text */
  const currentHint = steps[currentStep]?.hint || "No hint available."

  return (
    <aside className="mission-control">
      {/* Header */}
      <div className="mission-control__header">
        <h2 className="mission-control__title">Mission Control</h2>
        <span className="mission-control__xp">{xp} XP</span>
      </div>

      {/* Progress */}
      <ProgressCircle percentage={percentage} completed={completed} total={total} />

      {/* Steps */}
      <StepList steps={steps} currentStep={currentStep} completedSteps={completedSteps} />

      {/* Hint */}
      {showHint && <HintBox hint={currentHint} onClose={onToggleHint} />}

      {/* Actions */}
      <div className="mission-control__actions">
        <button className="mission-control__hint-btn" onClick={onToggleHint}>
          <Lightbulb size={14} />
          {showHint ? "Hide Hint" : "Need a Hint?"}
        </button>
        <button className="mission-control__skip-btn" onClick={onSkip}>
          Skip This Mission
        </button>
      </div>
    </aside>
  )
}
