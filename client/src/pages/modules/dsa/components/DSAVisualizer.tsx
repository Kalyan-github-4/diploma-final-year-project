import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { BinarySearchSnapshot, BubbleSortSnapshot, DSAStep, StepQuestion } from "@/types/dsa.types"

interface DSAVisualizerProps {
  currentStep: DSAStep
  isBinaryMode: boolean
  predictOverlayResult: "correct" | "wrong" | null
  isPredictOverlayVisible: boolean
  activePredictQuestion: StepQuestion | null
  predictAnswered: boolean
  onSubmitPredictAnswer: (selectedIndex: number) => void
  predictOverlayMessage: string | null
}

export function DSAVisualizer({
  currentStep,
  isBinaryMode,
  predictOverlayResult,
  isPredictOverlayVisible,
  activePredictQuestion,
  predictAnswered,
  onSubmitPredictAnswer,
  predictOverlayMessage,
}: DSAVisualizerProps) {
  return (
    <div className={`dsa-card dsa-card--visualizer ${predictOverlayResult ? `dsa-card--predict-${predictOverlayResult}` : ""}`}>
      <div className={`dsa-array-canvas ${isBinaryMode ? "dsa-array-canvas--binary" : ""}`}>
        <div className={`dsa-array ${isBinaryMode ? "dsa-array--binary" : ""}`}>
          {currentStep.snapshot.array.map((value, index) => {
            const binarySnapshot = currentStep.snapshot as BinarySearchSnapshot
            const bubbleSnapshot = currentStep.snapshot as BubbleSortSnapshot

            const isFound = isBinaryMode && binarySnapshot.foundIndex === index
            const isMid = isBinaryMode && binarySnapshot.mid === index
            const isLow = isBinaryMode && binarySnapshot.low === index
            const isHigh = isBinaryMode && binarySnapshot.high === index
            const inWindow = isBinaryMode && index >= binarySnapshot.low && index <= binarySnapshot.high

            const isCompare = !isBinaryMode && bubbleSnapshot.compareIndices.includes(index)
            const isSwap = !isBinaryMode && bubbleSnapshot.swapIndices.includes(index)
            const isSorted = !isBinaryMode && index >= bubbleSnapshot.sortedFrom

            return (
              <motion.div
                key={`${index}-${value}`}
                layout
                initial={{ opacity: 0.8, y: 6 }}
                animate={{ opacity: 1, y: 0, scale: isSwap ? 1.04 : 1 }}
                transition={{ duration: 0.2 }}
                className={`dsa-array__item ${isBinaryMode ? "dsa-array__item--binary" : ""}`}
              >
                {isBinaryMode && <span className="dsa-array__index">index {index}</span>}

                <div
                  className={[
                    "dsa-array__cell",
                    inWindow ? "dsa-array__cell--window" : "",
                    isBinaryMode && !inWindow ? "dsa-array__cell--excluded" : "",
                    isLow ? "dsa-array__cell--low" : "",
                    isHigh ? "dsa-array__cell--high" : "",
                    isMid ? "dsa-array__cell--mid" : "",
                    isFound ? "dsa-array__cell--found" : "",
                    isCompare ? "dsa-array__cell--compare" : "",
                    isSwap ? "dsa-array__cell--swap" : "",
                    isSorted ? "dsa-array__cell--sorted" : "",
                  ].join(" ")}
                >
                  <span className="dsa-array__value">{value}</span>
                  {!isBinaryMode && (
                    <div className="dsa-array__meta">
                      {isCompare && <em>cmp</em>}
                      {isSwap && <em>swap</em>}
                      {isSorted && <em>sorted</em>}
                    </div>
                  )}
                </div>

                {isBinaryMode && (
                  <div className="dsa-array__pointers">
                    {isLow && (
                      <span className="dsa-array__pointer-pill">
                        <span aria-hidden="true">↑</span>
                        low
                      </span>
                    )}
                    {isMid && (
                      <span className="dsa-array__pointer-pill dsa-array__pointer-pill--mid">
                        <span aria-hidden="true">↑</span>
                        mid
                      </span>
                    )}
                    {isHigh && (
                      <span className="dsa-array__pointer-pill">
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
          <div className="dsa-array__legend" aria-label="Binary Search state legend">
            <span className="dsa-array__legend-pill dsa-array__legend-pill--pivot">Current Pivot</span>
            <span className="dsa-array__legend-pill">Unvisited</span>
            <span className="dsa-array__legend-pill dsa-array__legend-pill--excluded">Excluded</span>
          </div>
        )}

        <AnimatePresence>
          {isPredictOverlayVisible && activePredictQuestion && (
            <motion.div
              className="dsa-predict-overlay"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <p className="dsa-predict-overlay__eyebrow">Predict Mode</p>
              <h4 className="dsa-predict-overlay__title font-grotesk">What happens next?</h4>
              <p className="dsa-predict-overlay__question">{activePredictQuestion.text}</p>

              <div className="dsa-predict-overlay__options">
                {activePredictQuestion.options.map((option, index) => (
                  <Button
                    key={`${option}-${index}`}
                    className="dsa-predict-overlay__option"
                    disabled={predictAnswered}
                    onClick={() => onSubmitPredictAnswer(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {predictOverlayMessage && <p className="dsa-predict-overlay__feedback">{predictOverlayMessage}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}