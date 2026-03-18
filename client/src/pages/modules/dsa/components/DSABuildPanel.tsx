import { motion } from "framer-motion"

interface DSABuildPanelProps {
  algorithmLabel: string
  question: string
  progressPercent: number
  executionState: string
  currentPointerState: string
  runMessage: string | null
  runResult: "idle" | "success" | "error"
  xpEarned: number
}

export function DSABuildPanel({
  algorithmLabel,
  question,
  progressPercent,
  executionState,
  currentPointerState,
  runMessage,
  runResult,
  xpEarned,
}: DSABuildPanelProps) {
  const ringStyle = {
    background: `conic-gradient(var(--accent) ${progressPercent}%, var(--bg-elevated) ${progressPercent}% 100%)`,
  }

  return (
    <>
      <h3 className="font-grotesk">Code Mode</h3>
      <p className="dsa-panel__description">Write pseudocode, run safely, and watch the visualizer replay your execution.</p>

      <div className="dsa-panel__section">
        <h4 className="font-grotesk">Question</h4>
        <p>{algorithmLabel}</p>
        <p>{question}</p>
      </div>

      <div className="dsa-panel__section">
        <h4 className="font-grotesk">Realtime Progress</h4>
        <div className="dsa-runtime-progress">
          <div className="dsa-runtime-progress__ring" style={ringStyle}>
            <div className="dsa-runtime-progress__inner">{Math.round(progressPercent)}%</div>
          </div>
          <div className="dsa-runtime-progress__meta">
            <p>{executionState}</p>
            <p>{currentPointerState}</p>
          </div>
        </div>
      </div>

      {runMessage && (
        <motion.div
          className={`dsa-build-result dsa-build-result--${runResult === "success" ? "correct" : "wrong"}`}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className="font-grotesk dsa-build-result__title">
            {runResult === "success" ? "✅ Execution Passed" : "❌ Execution Failed"}
          </h4>
          <p className="dsa-build-result__reason">{runMessage}</p>
          <p className="dsa-build-result__step">XP earned this run: +{xpEarned}</p>
        </motion.div>
      )}
    </>
  )
}