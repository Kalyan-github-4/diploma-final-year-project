import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ComplexityMeta, DSAAlgorithm, DSAStep } from "@/types/dsa.types"

interface DSAWatchPanelProps {
  currentStep: DSAStep
  stepNumber: number
  totalSteps: number
  completionPercent: number
  resultLabel: string
  predictXp: number
  algorithm: DSAAlgorithm
  arrayInput: string
  targetInput: string
  inputError: string | null
  complexity: ComplexityMeta
  onArrayInputChange: (value: string) => void
  onTargetInputChange: (value: string) => void
  onApplyCustomInput: () => void
}

export function DSAWatchPanel({
  currentStep,
  stepNumber,
  totalSteps,
  completionPercent,
  resultLabel,
  predictXp,
  algorithm,
  arrayInput,
  targetInput,
  inputError,
  complexity,
  onArrayInputChange,
  onTargetInputChange,
  onApplyCustomInput,
}: DSAWatchPanelProps) {
  return (
    <>
      <h3 className="font-grotesk">Current Step</h3>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {currentStep.description}
        </motion.p>
      </AnimatePresence>

      <div className="dsa-panel__section">
        <h4 className="font-grotesk">Progress</h4>
        <p>
          Step {stepNumber} / {totalSteps}
        </p>
        <div className="dsa-progress-track">
          <motion.div
            className="dsa-progress-fill"
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      <div className="dsa-panel__section">
        <h4 className="font-grotesk">Result</h4>
        <p>{resultLabel}</p>
        <p>Predict XP: +{predictXp}</p>
      </div>

      <div className="dsa-panel__section">
        <h4 className="font-grotesk">Custom Input</h4>
        <label className="dsa-input-label font-grotesk">
          Array{algorithm === "binary-search" ? " (ascending)" : ""}
        </label>
        <Input
          value={arrayInput}
          onChange={(e) => onArrayInputChange(e.target.value)}
          placeholder={algorithm === "binary-search" ? "2, 5, 8, 12, 16" : "64, 34, 25, 12"}
        />

        {algorithm === "binary-search" && (
          <>
            <label className="dsa-input-label font-grotesk">Target</label>
            <Input
              value={targetInput}
              onChange={(e) => onTargetInputChange(e.target.value)}
              placeholder="23"
            />
          </>
        )}

        {inputError && <p className="dsa-input-error">{inputError}</p>}

        <Button className="dsa-apply-btn" onClick={onApplyCustomInput}>
          Apply & Re-run
        </Button>
      </div>

      <div className="dsa-panel__section">
        <h4 className="font-grotesk">Complexity</h4>
        <p>Best: {complexity.timeBest}</p>
        <p>Average: {complexity.timeAverage}</p>
        <p>Worst: {complexity.timeWorst}</p>
        <p>Space: {complexity.space}</p>
        {complexity.note && <p>{complexity.note}</p>}
      </div>
    </>
  )
}