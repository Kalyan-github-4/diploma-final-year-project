import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, RotateCcw, CheckCircle2, XCircle, Clock } from "lucide-react"
import { generateBinarySearchSteps } from "@/lib/algorithms/binarySearch"
import { BINARY_SEARCH_TRACE_QUESTIONS } from "@/lib/algorithms/binarySearchChallenges"
import type { TraceQuestion } from "@/lib/algorithms/binarySearchChallenges"
import type { BinarySearchSnapshot } from "@/types/dsa.types"
import { useTimer } from "../../../../hooks/useTimer"

const ARRAY = [2, 5, 8, 12, 16, 23, 38]
const TARGET = 23
const SPEED_MS = 700

interface TracePanelProps {
  onXpChange: (xp: number) => void
  onComplete: () => void
}

export function TracePanel({ onXpChange, onComplete }: TracePanelProps) {
  const { steps } = useMemo(() => generateBinarySearchSteps({ array: ARRAY, target: TARGET }), [])
  const timer = useTimer()

  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<TraceQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({})
  const [xpEarned, setXpEarned] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [completed, setCompleted] = useState(false)

  const maxStep = steps.length - 1
  const step = steps[Math.min(currentStep, maxStep)]
  const snapshot = step.snapshot as BinarySearchSnapshot
  const answeredCount = Object.keys(answeredQuestions).length

  const completedRef = useRef(completed)
  const answeredRef = useRef(answeredQuestions)

  useEffect(() => { completedRef.current = completed }, [completed])
  useEffect(() => { answeredRef.current = answeredQuestions }, [answeredQuestions])

  const handleStart = () => {
    setStarted(true)
    timer.start()
    if (!checkForQuestion(0)) {
      setIsPlaying(true)
    }
  }

  // Check for question at a given step — called imperatively, not from an effect
  const checkForQuestion = useCallback((stepIndex: number) => {
    const question = BINARY_SEARCH_TRACE_QUESTIONS.find(
      (q) => q.pauseAfterStep === stepIndex && !answeredRef.current[q.id]
    )
    if (question) {
      setIsPlaying(false)
      setActiveQuestion(question)
      setSelectedAnswer(null)
      setShowResult(false)
      return true
    }
    return false
  }, [])

  // Advance one step — used by playback timer and skip button
  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, maxStep)
      queueMicrotask(() => checkForQuestion(next))
      return next
    })
  }, [maxStep, checkForQuestion])

  // Playback timer
  useEffect(() => {
    if (!isPlaying || activeQuestion || currentStep >= maxStep) return
    const t = setTimeout(() => advanceStep(), SPEED_MS)
    return () => clearTimeout(t)
  }, [isPlaying, currentStep, maxStep, activeQuestion, advanceStep])

  const markComplete = useCallback(() => {
    if (!completedRef.current) {
      setCompleted(true)
      timer.stop()
      onComplete()
    }
  }, [onComplete, timer])

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowResult(true)

    const isCorrect = index === activeQuestion!.correct
    if (isCorrect) {
      const newXp = xpEarned + activeQuestion!.xp
      setXpEarned(newXp)
      onXpChange(newXp)
    }
    const newAnswered = { ...answeredQuestions, [activeQuestion!.id]: isCorrect }
    setAnsweredQuestions(newAnswered)

    if (Object.keys(newAnswered).length === BINARY_SEARCH_TRACE_QUESTIONS.length) {
      markComplete()
    }

    setTimeout(() => {
      setActiveQuestion(null)
      setSelectedAnswer(null)
      setShowResult(false)
      if (currentStep < maxStep) {
        setCurrentStep((s) => Math.min(s + 1, maxStep))
        setIsPlaying(true)
      }
    }, 2200)
  }

  const handleRestart = () => {
    setStarted(false)
    setCurrentStep(0)
    setIsPlaying(false)
    setActiveQuestion(null)
    setSelectedAnswer(null)
    setShowResult(false)
    setAnsweredQuestions({})
    setXpEarned(0)
    setCompleted(false)
    timer.reset()
    onXpChange(0)
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {/* ── Status bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[12px]">
          <span className="text-(--text-tertiary)">
            {answeredCount}/{BINARY_SEARCH_TRACE_QUESTIONS.length} answered
          </span>
          <span className="text-(--text-tertiary)">&middot;</span>
          <span className="font-medium text-[#F59E0B]">{xpEarned} XP</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Timer */}
          <span className="flex items-center gap-1.5 rounded-md bg-(--bg-surface) px-2 py-0.5 text-[11px] tabular-nums text-(--text-tertiary)">
            <Clock size={11} /> {timer.formatted}
          </span>
          {completed && (
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-medium text-green-500">
              <CheckCircle2 size={12} /> Complete
            </span>
          )}
        </div>
      </div>

      {/* ── Visualizer card ── */}
      <div className="relative flex flex-1 flex-col rounded-xl border border-border bg-(--bg-elevated)">

        {/* Step description */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <p className="text-[13px] text-foreground font-medium">{step.description}</p>
          <span className="shrink-0 rounded-md bg-(--bg-surface) px-2 py-0.5 text-[11px] text-(--text-tertiary) tabular-nums">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Array cells */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="flex items-start gap-5">
            {snapshot.array.map((value, index) => {
              const isLow = snapshot.low === index
              const isHigh = snapshot.high === index
              const isMid = snapshot.mid === index
              const isFound = snapshot.foundIndex === index
              const inWindow = index >= snapshot.low && index <= snapshot.high
              const isChecked = snapshot.checkedIndices?.includes(index)

              return (
                <div key={index} className="flex flex-col items-center gap-2.5">
                  <span className="text-[11px] font-mono text-(--text-tertiary)">{index}</span>
                  <motion.div
                    animate={{ scale: isMid || isFound ? 1.08 : 1, y: isMid || isFound ? -2 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={[
                      "flex h-[60px] w-[60px] items-center justify-center rounded-2xl border text-xl font-bold transition-colors duration-200",
                      isFound
                        ? "border-green-500/60 bg-green-500/12 text-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.15)]"
                        : isMid
                          ? "border-[#6C47FF]/60 bg-[#6C47FF]/10 text-[#6C47FF] shadow-[0_4px_20px_rgba(108,71,255,0.15)]"
                          : isChecked
                            ? "border-[#F59E0B]/25 bg-[#F59E0B]/5 text-[#F59E0B]/40"
                            : inWindow
                              ? "border-border bg-(--bg-surface) text-foreground"
                              : "border-transparent bg-(--bg-surface)/50 text-(--text-tertiary)/30",
                    ].join(" ")}
                  >
                    {value}
                  </motion.div>
                  <div className="flex min-h-5 gap-1">
                    {isLow && <span className="rounded-md bg-(--bg-surface) px-1.5 py-0.5 text-[10px] font-medium text-(--text-secondary)">L</span>}
                    {isMid && <span className="rounded-md bg-[#6C47FF]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#6C47FF]">M</span>}
                    {isHigh && <span className="rounded-md bg-(--bg-surface) px-1.5 py-0.5 text-[10px] font-medium text-(--text-secondary)">H</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Target label */}
        <div className="border-t border-border px-5 py-2 text-center">
          <span className="text-[11px] text-(--text-tertiary)">target = <span className="font-semibold text-(--text-secondary)">{TARGET}</span></span>
        </div>

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
                Trace the binary search step by step
              </p>
              <Button onClick={handleStart} className="gap-2">
                <Play size={14} /> Start Tracing
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Question overlay ── */}
        <AnimatePresence>
          {activeQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#111114]/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="mx-6 w-full max-w-[480px] rounded-2xl border border-border bg-(--bg-elevated) shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              >
                {/* Question header */}
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <span className="text-[12px] font-semibold text-(--text-secondary)">
                    Question {answeredCount + 1} of {BINARY_SEARCH_TRACE_QUESTIONS.length}
                  </span>
                  <span className="rounded-md bg-[#F59E0B]/10 px-2 py-0.5 text-[11px] font-bold text-[#F59E0B]">
                    +{activeQuestion.xp} XP
                  </span>
                </div>

                {/* Question body */}
                <div className="px-5 py-5">
                  <p className="text-[15px] font-medium text-foreground leading-relaxed mb-5">
                    {activeQuestion.text}
                  </p>

                  <div className="flex flex-col gap-2">
                    {activeQuestion.options.map((option, i) => {
                      const isSelected = selectedAnswer === i
                      const isCorrect = i === activeQuestion.correct

                      let base = "border-border bg-(--bg-surface) text-(--text-secondary) hover:bg-(--bg-surface)/80 hover:border-(--border-hover)"
                      if (showResult) {
                        if (isCorrect) base = "border-green-500/50 bg-green-500/8 text-green-500"
                        else if (isSelected) base = "border-red-500/50 bg-red-500/8 text-red-400"
                        else base = "border-border/30 bg-(--bg-surface)/30 text-(--text-tertiary)/50"
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={selectedAnswer !== null}
                          className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[13px] transition-all duration-150 cursor-pointer disabled:cursor-default ${base}`}
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
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t border-border px-5 py-4"
                    >
                      <p className="text-[13px] text-(--text-secondary) leading-relaxed">
                        {activeQuestion.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon-sm" onClick={handleRestart}><RotateCcw size={14} /></Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!started || !!activeQuestion || currentStep >= maxStep}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setCurrentStep((s) => Math.min(s + 1, maxStep))}
            disabled={!started || !!activeQuestion || currentStep >= maxStep}
          >
            <SkipForward size={14} />
          </Button>
        </div>

        <span className="rounded-md bg-(--bg-surface) px-2 py-0.5 text-[11px] tabular-nums text-(--text-tertiary)">
          Step {currentStep + 1} / {steps.length}
        </span>
      </div>
    </div>
  )
}
