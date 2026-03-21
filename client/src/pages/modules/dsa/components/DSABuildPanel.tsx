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
      <p className="my-0 mt-1 mb-2 text-xs text-(--text-secondary)">Write pseudocode, run safely, and watch the visualizer replay your execution.</p>

      <div className="mt-3.5 flex flex-col gap-1.5">
        <h4 className="font-grotesk">Question</h4>
        <p>{algorithmLabel}</p>
        <p>{question}</p>
      </div>

      <div className="mt-3.5 flex flex-col gap-1.5">
        <h4 className="font-grotesk">Realtime Progress</h4>
        <div className="mt-1.5 flex items-center gap-3">
          <div className="flex h-20.5 w-20.5 shrink-0 items-center justify-center rounded-full" style={ringStyle}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-[13px] font-bold text-foreground">{Math.round(progressPercent)}%</div>
          </div>
          <div className="flex flex-col gap-1">
            <p>{executionState}</p>
            <p>{currentPointerState}</p>
          </div>
        </div>
      </div>

      {runMessage && (
        <motion.div
          className={`mt-3 rounded-lg border-2 p-3 ${runResult === "success" ? "border-[hsl(127_71%_55%)] bg-[color-mix(in_oklab,hsl(127_71%_55%)_8%,var(--bg-primary))]" : "border-[hsl(0_75%_55%)] bg-[color-mix(in_oklab,hsl(0_75%_55%)_8%,var(--bg-primary))]"}`}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className={`m-0 mb-2 text-[13px] font-semibold font-grotesk ${runResult === "success" ? "text-[hsl(127_71%_55%)]" : "text-[hsl(0_75%_55%)]"}`}>
            {runResult === "success" ? "✅ Execution Passed" : "❌ Execution Failed"}
          </h4>
          <p className="m-0 mb-1 text-xs leading-normal text-foreground">{runMessage}</p>
          <p className="m-0 text-[11px] font-medium text-foreground">XP earned this run: +{xpEarned}</p>
        </motion.div>
      )}
    </>
  )
}