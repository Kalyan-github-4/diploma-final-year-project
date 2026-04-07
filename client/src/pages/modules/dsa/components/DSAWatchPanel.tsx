import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ComplexityMeta, DSAAlgorithm, DSAStep } from "@/types/dsa.types"
import { STACK_DEFAULT_OPS, getStackOpLabel } from "@/lib/algorithms/stack"
import { QUEUE_DEFAULT_OPS, getQueueOpLabel } from "@/lib/algorithms/queue"

const BFS_NODE_OPTIONS = ["A", "B", "C", "D", "E", "F"]

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
  startNodeInput?: string
  inputError: string | null
  complexity: ComplexityMeta
  onArrayInputChange: (value: string) => void
  onTargetInputChange: (value: string) => void
  onStartNodeChange?: (node: string) => void
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
  startNodeInput,
  inputError,
  complexity,
  onArrayInputChange,
  onTargetInputChange,
  onStartNodeChange,
  onApplyCustomInput,
}: DSAWatchPanelProps) {
  const isBFS = algorithm === "bfs" || algorithm === "dijkstra"
  const isStackOrQueue = algorithm === "stack" || algorithm === "queue"
  // Step 1 = init, steps 2..n-1 = ops, last = complete
  const currentOpIndex = stepNumber - 2

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

      <div className="mt-3.5 flex flex-col gap-1.5">
        <h4 className="font-grotesk">Progress</h4>
        <p>
          Step {stepNumber} / {totalSteps}
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-(--bg-surface)">
          <motion.div
            className="h-full rounded-full bg-(--accent)"
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      <div className="mt-3.5 flex flex-col gap-1.5">
        <h4 className="font-grotesk">Result</h4>
        <p>{resultLabel}</p>
        <p>Predict XP: +{predictXp}</p>
        <p>{isGeneratingAiQuestions ? "AI: generating fresh predict questions..." : "AI: predict questions ready"}</p>
        {aiQuestionError && <p className="text-[hsl(0_75%_55%)]">{aiQuestionError}</p>}
      </div>

      <div className="mt-3.5 flex flex-col gap-1.5">
        <h4 className="font-grotesk">{isBFS ? "Start Node" : isStackOrQueue ? "Operations" : "Custom Input"}</h4>

        {isStackOrQueue ? (
          <>
            <p>Fixed sequence — watch each operation unfold.</p>
            <div className="flex max-h-48 flex-col gap-1 overflow-y-auto pr-1">
              {(algorithm === "stack" ? STACK_DEFAULT_OPS : QUEUE_DEFAULT_OPS).map((op, idx) => {
                const label =
                  algorithm === "stack"
                    ? getStackOpLabel(op as Parameters<typeof getStackOpLabel>[0], idx)
                    : getQueueOpLabel(op as Parameters<typeof getQueueOpLabel>[0], idx)
                const isCurrent = idx === currentOpIndex
                return (
                  <div
                    key={idx}
                    className="rounded-lg px-2.5 py-1.5 text-[12px] font-mono transition-colors duration-150"
                    style={{
                      background: isCurrent
                        ? "color-mix(in oklab, var(--accent) 18%, var(--bg-surface))"
                        : "var(--bg-surface)",
                      border: `1px solid ${isCurrent ? "color-mix(in oklab, var(--accent) 50%, var(--border-subtle))" : "var(--border-subtle)"}`,
                      color: isCurrent ? "var(--accent)" : "var(--text-secondary)",
                      fontWeight: isCurrent ? 600 : 400,
                    }}
                  >
                    {label}
                  </div>
                )
              })}
            </div>
          </>
        ) : isBFS ? (
          <>
            <p>Choose which node BFS starts from.</p>
            <div className="flex flex-wrap gap-1.5">
              {BFS_NODE_OPTIONS.map((node) => (
                <Button
                  key={node}
                  type="button"
                  onClick={() => onStartNodeChange?.(node)}
                  className={[
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg border text-[13px] font-bold font-grotesk transition-all duration-150",
                    startNodeInput === node
                      ? "border-(--accent) bg-[color-mix(in_oklab,var(--accent)_22%,var(--bg-surface))] text-(--accent)"
                      : "border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:border-(--border-hover) hover:text-foreground",
                  ].join(" ")}
                >
                  {node}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            <label className="text-[11px] text-foreground font-grotesk">
              Array{algorithm === "binary-search" ? " (ascending)" : ""}
            </label>
            <Input
              className="h-9 rounded-lg border-border bg-background px-2.5 text-[13px] text-foreground"
              value={arrayInput}
              onChange={(e) => onArrayInputChange(e.target.value)}
              placeholder={algorithm === "binary-search" ? "2, 5, 8, 12, 16" : "64, 34, 25, 12"}
            />

            {algorithm === "binary-search" && (
              <>
                <label className="text-[11px] text-foreground font-grotesk">Target</label>
                <Input
                  className="h-9 rounded-lg border-border bg-background px-2.5 text-[13px] text-foreground"
                  value={targetInput}
                  onChange={(e) => onTargetInputChange(e.target.value)}
                  placeholder="23"
                />
              </>
            )}

            {inputError && <p className="text-[hsl(0_75%_55%)]">{inputError}</p>}

            <Button
              className="mt-0.5 h-9 rounded-lg border border-border bg-(--accent) text-[13px] font-semibold text-white hover:opacity-95"
              onClick={onApplyCustomInput}
            >
              Apply
            </Button>
          </>
        )}
      </div>

      <div className="mt-3.5 flex flex-col gap-1.5">
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
