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
  isGeneratingAiQuestions: boolean
  aiQuestionError: string | null
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
  isGeneratingAiQuestions,
  aiQuestionError,
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

      <div className="mt-[14px] flex flex-col gap-1.5">
        <h4 className="font-grotesk">Progress</h4>
        <p>
          Step {stepNumber} / {totalSteps}
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      <div className="mt-[14px] flex flex-col gap-1.5">
        <h4 className="font-grotesk">Result</h4>
        <p>{resultLabel}</p>
        <p>Predict XP: +{predictXp}</p>
        <p>{isGeneratingAiQuestions ? "AI: generating fresh predict questions..." : "AI: predict questions ready"}</p>
        {aiQuestionError && <p className="text-[hsl(0_75%_55%)]">{aiQuestionError}</p>}
      </div>

      <div className="mt-[14px] flex flex-col gap-1.5">
        <h4 className="font-grotesk">Custom Input</h4>
        <label className="text-[11px] text-[var(--text-primary)] font-grotesk">
          Array{algorithm === "binary-search" ? " (ascending)" : ""}
        </label>
        <Input
          className="h-9 rounded-lg border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 text-[13px] text-[var(--text-primary)]"
          value={arrayInput}
          onChange={(e) => onArrayInputChange(e.target.value)}
          placeholder={algorithm === "binary-search" ? "2, 5, 8, 12, 16" : "64, 34, 25, 12"}
        />

        {algorithm === "binary-search" && (
          <>
            <label className="text-[11px] text-[var(--text-primary)] font-grotesk">Target</label>
            <Input
              className="h-9 rounded-lg border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 text-[13px] text-[var(--text-primary)]"
              value={targetInput}
              onChange={(e) => onTargetInputChange(e.target.value)}
              placeholder="23"
            />
          </>
        )}

        {inputError && <p className="text-[hsl(0_75%_55%)]">{inputError}</p>}

        <Button className="mt-0.5 h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--accent)] text-[13px] font-semibold text-white hover:opacity-95" onClick={onApplyCustomInput}>
          Apply & Re-run
        </Button>
      </div>

      <div className="mt-[14px] flex flex-col gap-1.5">
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