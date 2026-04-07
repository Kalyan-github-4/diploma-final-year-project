import { useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { generateBubbleSortSteps } from "@/lib/algorithms/bubbleSort"
import {
  BUBBLE_SORT_TRACE_QUESTIONS,
  BUBBLE_SORT_SOLVE_PROBLEMS,
  LEVEL_TOTAL_XP,
} from "@/lib/algorithms/bubbleSortChallenges"
import type { BubbleSortSnapshot } from "@/types/dsa.types"
import type { DSAStep } from "@/types/dsa.types"
import DSAAlgorithmLevel from "./DSAAlgorithmLevel"

const ARRAY = [64, 34, 25, 12, 22, 11, 90]

export default function BubbleSortLevel() {
  const { steps } = useMemo(() => generateBubbleSortSteps({ array: ARRAY }), [])

  const renderVisualizer = useCallback((step: DSAStep) => {
    const snap = step.snapshot as BubbleSortSnapshot
    return (
      <div className="flex items-start gap-4">
        {snap.array.map((value, index) => {
          const isComparing = snap.compareIndices.includes(index)
          const isSwapping = snap.swapIndices.includes(index)
          const isSorted = index >= snap.sortedFrom

          return (
            <div key={index} className="flex flex-col items-center gap-2.5">
              <span className="text-[11px] font-mono text-(--text-tertiary)">{index}</span>
              <motion.div
                animate={{
                  scale: isSwapping ? 1.08 : 1,
                  y: isSwapping ? -4 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={[
                  "flex h-[60px] w-[60px] items-center justify-center rounded-2xl border text-xl font-bold transition-colors duration-200",
                  isSorted
                    ? "border-green-500/40 bg-green-500/8 text-green-500"
                    : isSwapping
                      ? "border-[#F59E0B]/60 bg-[#F59E0B]/10 text-[#F59E0B] shadow-[0_4px_20px_rgba(245,158,11,0.15)]"
                      : isComparing
                        ? "border-[#6C47FF]/60 bg-[#6C47FF]/10 text-[#6C47FF] shadow-[0_4px_20px_rgba(108,71,255,0.15)]"
                        : "border-border bg-(--bg-surface) text-foreground",
                ].join(" ")}
              >
                {value}
              </motion.div>
              <div className="min-h-5">
                {isComparing && !isSwapping && (
                  <span className="rounded-md bg-[#6C47FF]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#6C47FF]">CMP</span>
                )}
                {isSwapping && (
                  <span className="rounded-md bg-[#F59E0B]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#F59E0B]">SWAP</span>
                )}
                {isSorted && !isComparing && !isSwapping && (
                  <span className="rounded-md bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium text-green-500">done</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }, [])

  return (
    <DSAAlgorithmLevel
      title="Bubble Sort"
      levelNumber={2}
      totalXp={LEVEL_TOTAL_XP}
      steps={steps}
      traceQuestions={BUBBLE_SORT_TRACE_QUESTIONS}
      solveProblems={BUBBLE_SORT_SOLVE_PROBLEMS}
      renderVisualizer={renderVisualizer}
    />
  )
}
