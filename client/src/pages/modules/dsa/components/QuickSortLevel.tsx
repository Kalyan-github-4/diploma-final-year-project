import { useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { generateQuickSortSteps, QUICK_SORT_DEFAULT_ARRAY } from "@/lib/algorithms/quickSort"
import {
  QUICK_SORT_TRACE_QUESTIONS,
  QUICK_SORT_SOLVE_PROBLEMS,
  LEVEL_TOTAL_XP,
} from "@/lib/algorithms/quickSortChallenges"
import type { QuickSortSnapshot } from "@/types/dsa.types"
import type { DSAStep } from "@/types/dsa.types"
import DSAAlgorithmLevel from "./DSAAlgorithmLevel"

export default function QuickSortLevel() {
  const { steps } = useMemo(() => generateQuickSortSteps({ array: QUICK_SORT_DEFAULT_ARRAY }), [])

  const renderVisualizer = useCallback((step: DSAStep) => {
    const snap = step.snapshot as QuickSortSnapshot

    return (
      <div className="flex flex-col items-center gap-5 w-full">
        {/* Array bars */}
        <div className="flex items-end gap-3">
          {snap.array.map((value, index) => {
            const isPivot = snap.pivotIndex === index
            const isCompare = snap.compareIndex === index
            const isBoundary = snap.boundaryIndex === index
            const isSorted = snap.sortedIndices.includes(index)
            const inActiveRange =
              snap.activeRange !== null &&
              index >= snap.activeRange[0] &&
              index <= snap.activeRange[1]
            const isInactive = snap.activeRange !== null && !inActiveRange && !isSorted

            return (
              <div key={index} className="flex flex-col items-center gap-2.5">
                <span className="text-[11px] font-mono text-(--text-tertiary)">{index}</span>
                <motion.div
                  animate={{
                    scale: isPivot ? 1.1 : isCompare ? 1.05 : 1,
                    y: isPivot ? -6 : isCompare ? -3 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={[
                    "flex h-15 w-15 items-center justify-center rounded-2xl border text-xl font-bold transition-colors duration-200",
                    isSorted
                      ? "border-green-500/40 bg-green-500/8 text-white"
                      : isPivot
                        ? "border-[#F59E0B]/70 bg-[#F59E0B]/12 text-[#F59E0B] shadow-[0_4px_24px_rgba(245,158,11,0.2)]"
                        : isCompare
                          ? "border-[#6C47FF]/60 bg-[#6C47FF]/10 text-[#6C47FF] shadow-[0_4px_20px_rgba(108,71,255,0.15)]"
                          : inActiveRange
                            ? "border-border bg-(--bg-surface) text-white"
                            : isInactive
                              ? "border-border/40 bg-(--bg-elevated)/40 text-(--text-tertiary) opacity-50"
                              : "border-border bg-(--bg-surface) text-white",
                  ].join(" ")}
                >
                  {value}
                </motion.div>

                {/* Label row */}
                <div className="flex flex-col items-center gap-1 min-h-10">
                  {isPivot && (
                    <span className="rounded-md bg-[#F59E0B]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#F59E0B]">
                      PIVOT
                    </span>
                  )}
                  {isCompare && !isPivot && (
                    <span className="rounded-md bg-[#6C47FF]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#6C47FF]">
                      CMP
                    </span>
                  )}
                  {isBoundary && !isPivot && !isCompare && (
                    <span className="rounded-md bg-[#EC4899]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#EC4899]">
                      i
                    </span>
                  )}
                  {isSorted && !isPivot && !isCompare && (
                    <span className="rounded-md bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium text-green-500">
                      done
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-(--text-tertiary)">Pivot</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#6C47FF]" />
            <span className="text-(--text-tertiary)">Comparing</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-(--text-tertiary)">Sorted</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
            <span className="text-(--text-tertiary)">Boundary (i)</span>
          </span>
        </div>

        {/* Active partition info */}
        {snap.activeRange && (
          <p className="text-[12px] text-(--text-tertiary) font-mono">
            partition [{snap.activeRange[0]}..{snap.activeRange[1]}]
            {snap.pivotIndex !== null ? ` · pivot = ${snap.array[snap.pivotIndex]}` : ""}
          </p>
        )}
      </div>
    )
  }, [])

  return (
    <DSAAlgorithmLevel
      title="Quick Sort"
      levelNumber={7}
      totalXp={LEVEL_TOTAL_XP}
      steps={steps}
      traceQuestions={QUICK_SORT_TRACE_QUESTIONS}
      solveProblems={QUICK_SORT_SOLVE_PROBLEMS}
      renderVisualizer={renderVisualizer}
    />
  )
}
