import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { BinarySearchSnapshot, BubbleSortSnapshot, BFSSnapshot, DijkstraSnapshot, DSAAlgorithm, DSAStep, StackSnapshot, QueueSnapshot, StepQuestion } from "@/types/dsa.types"
import { BFSVisualizer } from "./BFSVisualizer"
import { StackVisualizer } from "./StackVisualizer"
import { QueueVisualizer } from "./QueueVisualizer"
import { DijkstraVisualizer } from "./DijkstraVisualizer"

interface DSAVisualizerProps {
  currentStep: DSAStep
  algorithm: DSAAlgorithm
  predictOverlayResult: "correct" | "wrong" | null
  isPredictOverlayVisible: boolean
  activePredictQuestion: StepQuestion | null
  predictAnswered: boolean
  onSubmitPredictAnswer: (selectedIndex: number) => void
  predictOverlayMessage: string | null
}

export function DSAVisualizer({
  currentStep,
  algorithm,
  predictOverlayResult,
  isPredictOverlayVisible,
  activePredictQuestion,
  predictAnswered,
  onSubmitPredictAnswer,
  predictOverlayMessage,
}: DSAVisualizerProps) {
  const isBinaryMode = algorithm === "binary-search"
  const isGraphMode = algorithm === "bfs"
  const isStackMode = algorithm === "stack"
  const isQueueMode = algorithm === "queue"
  const isDijkstraMode = algorithm === "dijkstra"

  return (
    <div
      className={`relative flex items-center justify-center overflow-auto rounded-xl border border-(--card-border) bg-card p-3 ${predictOverlayResult === "correct" ? "shadow-[0_0_0_2px_color-mix(in_oklab,var(--success)_42%,transparent)]" : ""} ${predictOverlayResult === "wrong" ? "shadow-[0_0_0_2px_color-mix(in_oklab,var(--danger)_42%,transparent)]" : ""}`}
    >
      {isGraphMode ? (
        <BFSVisualizer snapshot={currentStep.snapshot as BFSSnapshot} />
      ) : isDijkstraMode ? (
        <DijkstraVisualizer snapshot={currentStep.snapshot as DijkstraSnapshot} />
      ) : isStackMode ? (
        <StackVisualizer snapshot={currentStep.snapshot as StackSnapshot} />
      ) : isQueueMode ? (
        <QueueVisualizer snapshot={currentStep.snapshot as QueueSnapshot} />
      ) : (
        <div className={`w-full ${isBinaryMode ? "flex min-h-full flex-col items-center justify-center gap-3.5" : ""}`}>
          <div className={`${isBinaryMode ? "flex w-max max-w-full items-start justify-center gap-3.5 overflow-x-auto px-2 py-1" : "grid w-full grid-cols-7 gap-2"}`}>
            {(currentStep.snapshot as BinarySearchSnapshot | BubbleSortSnapshot).array.map((value, index) => {
              const binarySnapshot = currentStep.snapshot as BinarySearchSnapshot
              const bubbleSnapshot = currentStep.snapshot as BubbleSortSnapshot

              const isFound = isBinaryMode && binarySnapshot.foundIndex === index
              const isMid = isBinaryMode && binarySnapshot.mid === index
              const isLow = isBinaryMode && binarySnapshot.low === index
              const isHigh = isBinaryMode && binarySnapshot.high === index
              const inWindow = isBinaryMode && index >= binarySnapshot.low && index <= binarySnapshot.high
              const isChecked = isBinaryMode && !isFound && !isMid && binarySnapshot.checkedIndices?.includes(index)

              const isCompare = !isBinaryMode && bubbleSnapshot.compareIndices.includes(index)
              const isSwap = !isBinaryMode && bubbleSnapshot.swapIndices.includes(index)
              const isSorted = !isBinaryMode && index >= bubbleSnapshot.sortedFrom

              return (
                <motion.div
                  key={`${index}-${value}`}
                  layout
                  initial={{ opacity: 0.95, y: 6 }}
                  animate={{ opacity: 1, y: 0, scale: isSwap ? 1.04 : 1 }}
                  transition={{ duration: 0.2 }}
                  className={`${isBinaryMode ? "flex min-w-0 flex-col items-center gap-1.75" : "min-w-0"}`}
                >
                  {isBinaryMode && <span className="text-[11px] leading-none text-(--text-secondary)">index {index}</span>}

                  <div
                    className={[
                      "flex min-h-19 flex-col items-center justify-center gap-1.5 rounded-[10px] border border-border bg-(--bg-surface) transition-all duration-200",
                      isBinaryMode ? "w-21 min-h-21 rounded-xl" : "",
                      inWindow ? "border-[color-mix(in_oklab,var(--accent)_50%,var(--border-subtle))] bg-[color-mix(in_oklab,var(--accent)_12%,var(--bg-surface))]" : "",
                      isBinaryMode && !inWindow ? "border-[color-mix(in_oklab,var(--text-tertiary)_24%,var(--border-subtle))] bg-[color-mix(in_oklab,var(--bg-elevated)_28%,var(--bg-surface))] opacity-75" : "",
                      isLow ? "shadow-[0_0_0_1px_color-mix(in_oklab,var(--text-secondary)_35%,transparent)]" : "",
                      isHigh ? "shadow-[0_0_0_1px_color-mix(in_oklab,var(--text-secondary)_35%,transparent)]" : "",
                      isMid ? "border-(--accent) bg-[color-mix(in_oklab,var(--accent)_58%,var(--bg-surface))] shadow-[0_0_0_2px_color-mix(in_oklab,var(--accent)_52%,transparent)]" : "",
                      isCompare ? "border-[color-mix(in_oklab,var(--accent)_45%,var(--border-subtle))] bg-[color-mix(in_oklab,var(--accent)_24%,var(--bg-surface))]" : "",
                      isSwap ? "border-(--warning) bg-[color-mix(in_oklab,var(--warning)_44%,var(--bg-surface))] shadow-[0_0_0_2px_color-mix(in_oklab,var(--warning)_42%,transparent)]" : "",
                      isSorted ? "border-[color-mix(in_oklab,var(--success)_55%,var(--border-subtle))] bg-[color-mix(in_oklab,var(--success)_94%,var(--bg-surface))]" : "",
                    ].join(" ")}
                    style={
                      isFound
                        ? { backgroundColor: "#22C55E", borderColor: "#22C55E", boxShadow: "0 0 0 2px rgba(34,197,94,0.35)" }
                        : isChecked
                          ? { backgroundColor: "#F97316", borderColor: "#F97316", boxShadow: "0 0 0 2px rgba(249,115,22,0.3)" }
                          : undefined
                    }
                  >
                    <span className="text-[19px] font-semibold text-foreground" style={isFound || isChecked ? { color: "#fff" } : undefined}>{value}</span>
                    {!isBinaryMode && (
                      <div className="flex gap-1">
                        {isCompare && <em className="rounded-full bg-(--bg-elevated) px-1.5 py-px text-[10px] not-italic text-(--text-secondary)">cmp</em>}
                        {isSwap && <em className="rounded-full bg-(--bg-elevated) px-1.5 py-px text-[10px] not-italic text-(--text-secondary)">swap</em>}
                        {isSorted && <em className="rounded-full bg-(--bg-elevated) px-1.5 py-px text-[10px] not-italic text-(--text-secondary)">sorted</em>}
                      </div>
                    )}
                  </div>

                  {isBinaryMode && (
                    <div className="flex min-h-5.5 flex-wrap items-center justify-center gap-1">
                      {isLow && (
                        <span className="inline-flex items-center gap-0.75 rounded-full border border-[color-mix(in_oklab,var(--border-subtle)_72%,transparent)] bg-(--bg-elevated) px-1.75 py-1 text-[10px] font-semibold leading-none text-(--text-secondary)">
                          <span aria-hidden="true">↑</span>
                          low
                        </span>
                      )}
                      {isMid && (
                        <span className="inline-flex items-center gap-0.75 rounded-full border border-[color-mix(in_oklab,var(--accent)_50%,var(--border-subtle))] bg-[color-mix(in_oklab,var(--accent)_26%,var(--bg-surface))] px-1.75 py-1 text-[10px] font-semibold leading-none text-foreground">
                          <span aria-hidden="true">↑</span>
                          mid
                        </span>
                      )}
                      {isHigh && (
                        <span className="inline-flex items-center gap-0.75 rounded-full border border-[color-mix(in_oklab,var(--border-subtle)_72%,transparent)] bg-(--bg-elevated) px-1.75 py-1 text-[10px] font-semibold leading-none text-(--text-secondary)">
                          <span aria-hidden="true">↑</span>
                          high
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {isBinaryMode && (
            <div className="flex w-full flex-wrap items-center justify-center gap-1.5" aria-label="Binary Search state legend">
              <span className="rounded-full border border-[color-mix(in_oklab,var(--accent)_50%,var(--border-subtle))] bg-[color-mix(in_oklab,var(--accent)_26%,var(--bg-surface))] px-2.5 py-1.25 text-[11px] leading-none text-foreground">Current Pivot</span>
              <span className="rounded-full border border-[color-mix(in_oklab,var(--border-subtle)_72%,transparent)] bg-(--bg-elevated) px-2.5 py-1.25 text-[11px] leading-none text-(--text-secondary)">Unvisited</span>
              <span className="rounded-full border border-[color-mix(in_oklab,var(--border-subtle)_72%,transparent)] bg-(--bg-elevated) px-2.5 py-1.25 text-[11px] leading-none text-(--text-secondary) opacity-65">Excluded</span>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isPredictOverlayVisible && activePredictQuestion && (
          <motion.div
            className="absolute top-1/2 left-1/2 z-5 flex w-[min(560px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-2.5 rounded-[14px] border border-border bg-[color-mix(in_oklab,var(--bg-elevated)_92%,black_8%)] p-3.5 shadow-[0_24px_50px_rgba(0,0,0,0.35)] backdrop-blur-xs"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <p className="m-0 text-[11px] uppercase tracking-[0.08em] text-(--text-secondary)">Predict Mode</p>
            <h4 className="m-0 text-base text-foreground font-grotesk">What happens next?</h4>
            <p className="m-0 text-[13px] text-(--text-secondary)">{activePredictQuestion.text}</p>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {activePredictQuestion.options.map((option, index) => (
                <Button
                  key={`${option}-${index}`}
                  className="min-h-9 justify-start"
                  disabled={predictAnswered}
                  onClick={() => onSubmitPredictAnswer(index)}
                >
                  {option}
                </Button>
              ))}
            </div>

            {predictOverlayMessage && <p className="m-0 text-xs text-foreground">{predictOverlayMessage}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
