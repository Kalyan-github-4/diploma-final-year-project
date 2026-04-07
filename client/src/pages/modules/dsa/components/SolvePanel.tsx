import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Play, Clock } from "lucide-react"
import type { SolveProblem } from "@/lib/algorithms/binarySearchChallenges"
import { useTimer } from "../../../../hooks/useTimer"

interface SolvePanelProps {
  problems: SolveProblem[]
  onXpChange: (xp: number) => void
  onComplete: () => void
}

export function SolvePanel({ problems, onXpChange, onComplete }: SolvePanelProps) {
  const timer = useTimer()

  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [xpEarned, setXpEarned] = useState(0)

  const problem = problems[currentIndex]
  const isLast = currentIndex === problems.length - 1
  const allDone = Object.keys(results).length === problems.length
  const hasArrayDisplay = problem.array.length > 0

  const handleStart = () => {
    setStarted(true)
    timer.start()
  }

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowResult(true)

    const isCorrect = index === problem.correct
    const newResults = { ...results, [problem.id]: isCorrect }
    setResults(newResults)

    if (isCorrect) {
      const newXp = xpEarned + problem.xp
      setXpEarned(newXp)
      onXpChange(newXp)
    }

    if (Object.keys(newResults).length === problems.length) {
      timer.stop()
      setTimeout(() => onComplete(), 1500)
    } else if (!isLast) {
      setTimeout(() => {
        setCurrentIndex((i) => i + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      }, 2200)
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[12px]">
          <span className="text-(--text-tertiary)">
            {currentIndex + 1}/{problems.length} problems
          </span>
          <span className="text-(--text-tertiary)">&middot;</span>
          <span className="font-medium text-[#F59E0B]">{xpEarned} XP</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-md bg-(--bg-surface) px-2 py-0.5 text-[11px] tabular-nums text-(--text-tertiary)">
            <Clock size={11} /> {timer.formatted}
          </span>
          {/* Step indicators */}
          <div className="flex gap-1.5">
            {problems.map((p, i) => {
              const answered = results[p.id] !== undefined
              const correct = results[p.id] === true
              return (
                <div
                  key={p.id}
                  className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "bg-[#6C47FF]"
                      : answered
                        ? correct ? "bg-green-500" : "bg-red-500/60"
                        : "bg-border"
                  }`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Problem card */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-(--bg-elevated)">
        <AnimatePresence mode="wait">
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 flex-col"
          >
            {/* Problem header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <span className="text-[12px] font-semibold text-(--text-secondary)">
                Problem {currentIndex + 1}
              </span>
              <span className="rounded-md bg-[#F59E0B]/10 px-2 py-0.5 text-[11px] font-bold text-[#F59E0B]">
                +{problem.xp} XP
              </span>
            </div>

            <div className="flex flex-1 flex-col px-5 py-5">
              {/* Array display (only for array-based algorithms) */}
              {hasArrayDisplay && (
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  {problem.array.map((val, i) => (
                    <span
                      key={i}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-(--bg-surface) text-[13px] font-mono font-bold text-foreground"
                    >
                      {val}
                    </span>
                  ))}
                  {problem.target !== 0 && (
                    <span className="ml-2 rounded-md bg-(--bg-surface) px-2 py-1 text-[12px] text-(--text-tertiary)">
                      target = <span className="font-semibold text-(--text-secondary)">{problem.target}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Question */}
              <p className="text-[15px] font-medium text-foreground leading-relaxed mb-6">
                {problem.question}
              </p>

              {/* Options */}
              <div className="flex flex-col gap-2">
                {problem.options.map((option, i) => {
                  const isSelected = selectedAnswer === i
                  const isCorrect = i === problem.correct

                  let base = "border-border bg-(--bg-surface) text-(--text-secondary) hover:border-(--border-hover) hover:bg-(--bg-surface)/80 cursor-pointer"
                  if (showResult) {
                    if (isCorrect) base = "border-green-500/50 bg-green-500/8 text-green-500"
                    else if (isSelected) base = "border-red-500/50 bg-red-500/8 text-red-400"
                    else base = "border-border/30 bg-(--bg-surface)/30 text-(--text-tertiary)/50 cursor-default"
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={!started || selectedAnswer !== null}
                      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[13px] transition-all duration-150 disabled:cursor-default ${base}`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold transition-colors ${
                        showResult && isCorrect ? "bg-green-500/15 text-green-500" :
                        showResult && isSelected ? "bg-red-500/15 text-red-400" :
                        "bg-(--bg-elevated) text-(--text-tertiary) group-hover:text-(--text-secondary)"
                      }`}>
                        {showResult && isCorrect ? <CheckCircle2 size={13} /> :
                         showResult && isSelected ? <XCircle size={13} /> :
                         String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-medium">{option}</span>
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 rounded-xl border border-border bg-(--bg-surface) px-4 py-3"
                  >
                    <p className="text-[13px] text-(--text-secondary) leading-relaxed">
                      {problem.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-end pt-5">
                {allDone && (
                  <span className="flex items-center gap-1.5 text-[13px] font-medium text-green-500">
                    <CheckCircle2 size={14} /> All problems completed
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Start overlay ── */}
        <AnimatePresence>
          {!started && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 rounded-xl bg-(--bg-elevated)/90 backdrop-blur-[2px]"
            >
              <p className="text-[14px] font-medium text-(--text-secondary)">
                {problems.length} problems to solve
              </p>
              <Button onClick={handleStart} className="gap-2">
                <Play size={14} /> Start Solving
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
