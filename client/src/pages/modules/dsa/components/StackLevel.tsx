import { useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { generateStackSteps } from "@/lib/algorithms/stack"
import {
  STACK_TRACE_QUESTIONS,
  STACK_SOLVE_PROBLEMS,
  LEVEL_TOTAL_XP,
} from "@/lib/algorithms/stackChallenges"
import type { StackSnapshot } from "@/types/dsa.types"
import type { DSAStep } from "@/types/dsa.types"
import DSAAlgorithmLevel from "./DSAAlgorithmLevel"

export default function StackLevel() {
  const { steps } = useMemo(() => generateStackSteps(), [])

  const renderVisualizer = useCallback((step: DSAStep) => {
    const snap = step.snapshot as StackSnapshot
    const items = [...snap.items]
    const reversed = [...items].reverse() // top → bottom for display

    return (
      <div className="flex flex-col items-center gap-1">
        {/* Top label */}
        <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-(--text-tertiary)">
          {items.length === 0 ? "empty" : "top"}
        </span>

        {/* Stack items (top at top) */}
        {reversed.map((value, displayIdx) => {
          const isTop = displayIdx === 0
          const isLastOp =
            (snap.lastOp === "push" && isTop && snap.lastValue === value) ||
            (snap.lastOp === "pop" && isTop)

          return (
            <motion.div
              key={`${displayIdx}-${value}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={[
                "flex h-[48px] w-[100px] items-center justify-center rounded-xl border text-lg font-bold transition-colors duration-200",
                isLastOp && snap.lastOp === "push"
                  ? "border-[#6C47FF]/60 bg-[#6C47FF]/10 text-[#6C47FF] shadow-[0_2px_12px_rgba(108,71,255,0.15)]"
                  : isTop
                    ? "border-[#F59E0B]/40 bg-[#F59E0B]/8 text-[#F59E0B]"
                    : "border-border bg-(--bg-surface) text-foreground",
              ].join(" ")}
            >
              {value}
            </motion.div>
          )
        })}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex h-[48px] w-[100px] items-center justify-center rounded-xl border border-dashed border-border text-[13px] text-(--text-tertiary)">
            empty
          </div>
        )}

        {/* Bottom label */}
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-(--text-tertiary)">
          {items.length > 0 ? "bottom" : ""}
        </span>

        {/* Last operation */}
        {snap.lastOp && (
          <div className="mt-3 rounded-lg bg-(--bg-surface) px-3 py-1.5 text-[12px] font-mono text-(--text-secondary)">
            {snap.lastOp}({snap.lastValue !== null ? snap.lastValue : ""})
          </div>
        )}
      </div>
    )
  }, [])

  return (
    <DSAAlgorithmLevel
      title="Stack: Push & Pop"
      levelNumber={4}
      totalXp={LEVEL_TOTAL_XP}
      steps={steps}
      traceQuestions={STACK_TRACE_QUESTIONS}
      solveProblems={STACK_SOLVE_PROBLEMS}
      renderVisualizer={renderVisualizer}
    />
  )
}
