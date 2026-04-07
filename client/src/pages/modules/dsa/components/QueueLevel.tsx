import { useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { generateQueueSteps } from "@/lib/algorithms/queue"
import {
  QUEUE_TRACE_QUESTIONS,
  QUEUE_SOLVE_PROBLEMS,
  LEVEL_TOTAL_XP,
} from "@/lib/algorithms/queueChallenges"
import type { QueueSnapshot } from "@/types/dsa.types"
import type { DSAStep } from "@/types/dsa.types"
import DSAAlgorithmLevel from "./DSAAlgorithmLevel"

export default function QueueLevel() {
  const { steps } = useMemo(() => generateQueueSteps(), [])

  const renderVisualizer = useCallback((step: DSAStep) => {
    const snap = step.snapshot as QueueSnapshot

    return (
      <div className="flex flex-col items-center gap-3">
        {/* Front / Rear labels + items */}
        <div className="flex items-center gap-2">
          {snap.items.length > 0 && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-(--text-tertiary) mr-1">front</span>
          )}

          {snap.items.map((value, index) => {
            const isFront = index === 0
            const isRear = index === snap.items.length - 1
            const isLastOp =
              (snap.lastOp === "enqueue" && isRear && snap.lastValue === value) ||
              (snap.lastOp === "dequeue" && isFront)

            return (
              <motion.div
                key={`${index}-${value}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={[
                  "flex h-[52px] w-[52px] items-center justify-center rounded-2xl border text-lg font-bold transition-colors duration-200",
                  isLastOp && snap.lastOp === "enqueue"
                    ? "border-[#6C47FF]/60 bg-[#6C47FF]/10 text-[#6C47FF] shadow-[0_2px_12px_rgba(108,71,255,0.15)]"
                    : isFront
                      ? "border-[#F59E0B]/40 bg-[#F59E0B]/8 text-[#F59E0B]"
                      : "border-border bg-(--bg-surface) text-foreground",
                ].join(" ")}
              >
                {value}
              </motion.div>
            )
          })}

          {snap.items.length > 0 && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-(--text-tertiary) ml-1">rear</span>
          )}
        </div>

        {/* Empty state */}
        {snap.items.length === 0 && (
          <div className="flex h-[52px] w-[160px] items-center justify-center rounded-2xl border border-dashed border-border text-[13px] text-(--text-tertiary)">
            empty queue
          </div>
        )}

        {/* Last operation */}
        {snap.lastOp && (
          <div className="rounded-lg bg-(--bg-surface) px-3 py-1.5 text-[12px] font-mono text-(--text-secondary)">
            {snap.lastOp}({snap.lastValue !== null ? snap.lastValue : ""})
          </div>
        )}
      </div>
    )
  }, [])

  return (
    <DSAAlgorithmLevel
      title="Queue: Enqueue & Dequeue"
      levelNumber={5}
      totalXp={LEVEL_TOTAL_XP}
      steps={steps}
      traceQuestions={QUEUE_TRACE_QUESTIONS}
      solveProblems={QUEUE_SOLVE_PROBLEMS}
      renderVisualizer={renderVisualizer}
    />
  )
}
