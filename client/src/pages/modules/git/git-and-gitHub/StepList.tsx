import type { MissionStep } from "@/lib/mission.utils"
import { Check } from "lucide-react"

interface StepListProps {
  steps: MissionStep[]
  currentStep: number
  completedSteps: string[]
}

function renderInstruction(instruction: string) {
  const parts = instruction.split(/`([^`]+)`/g)

  return parts.map((part, index) => {
    const isCode = index % 2 === 1
    return isCode ? <code key={`${part}-${index}`} className="rounded bg-[rgba(99,102,241,0.08)] px-1.5 py-px font-mono text-xs text-(--accent)">{part}</code> : part
  })
}

export default function StepList({ steps, currentStep, completedSteps }: StepListProps) {
  return (
    <div>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-(--text-tertiary)">Instructions</div>
      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isActive = index === currentStep && !isCompleted
          const status = isCompleted ? "completed" : isActive ? "active" : "pending"

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div
                className={`mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  status === "completed"
                    ? "bg-(--success)"
                    : status === "active"
                      ? "animate-pulse bg-(--accent)"
                      : "border-2 border-border bg-transparent"
                }`}
              >
                {isCompleted && <Check size={12} />}
                {isActive && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "white",
                    }}
                  />
                )}
              </div>
              <span
                className={`text-[13px] leading-normal ${
                  status === "completed"
                    ? "text-(--text-tertiary)"
                    : status === "active"
                      ? "text-foreground"
                      : "text-(--text-secondary)"
                }`}
              >
                {renderInstruction(step.instruction)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
