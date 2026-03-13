import type { MissionStep } from "@/lib/mission.utils"
import { Check } from "lucide-react"

interface StepListProps {
  steps: MissionStep[]
  currentStep: number
  completedSteps: string[]
}

export default function StepList({ steps, currentStep, completedSteps }: StepListProps) {
  return (
    <div>
      <div className="step-list__heading">Instructions</div>
      <div className="step-list__items">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isActive = index === currentStep && !isCompleted
          const status = isCompleted ? "completed" : isActive ? "active" : "pending"

          return (
            <div key={step.id} className="step-item">
              <div className={`step-item__indicator step-item__indicator--${status}`}>
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
                className={`step-item__text step-item__text--${status}`}
                dangerouslySetInnerHTML={{
                  __html: step.instruction.replace(
                    /`([^`]+)`/g,
                    "<code>$1</code>"
                  ),
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
