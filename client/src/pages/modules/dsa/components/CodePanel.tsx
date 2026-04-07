import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Play, Pause, SkipForward, RotateCcw, CheckCircle2, XCircle,
  Terminal, AlertTriangle, Zap, Clock,
} from "lucide-react"
import { BINARY_SEARCH_REFERENCE_CODE } from "@/lib/algorithms/binarySearch"
import { runSafeBinarySearchPseudocode } from "@/lib/algorithms/safePseudocodeRunner"
import { CODE_XP } from "@/lib/algorithms/binarySearchChallenges"
import type { BinarySearchSnapshot } from "@/types/dsa.types"
import type { DSAStep } from "@/types/dsa.types"
import { useTimer } from "../../../../hooks/useTimer"

const TEST_CASES = [
  { array: [2, 5, 8, 12, 16, 23, 38], target: 23, expected: 5 },
  { array: [1, 3, 5, 7, 9, 11], target: 7, expected: 3 },
  { array: [10, 20, 30, 40, 50], target: 35, expected: -1 },
]

const SPEED_MS = 600

interface CodePanelProps {
  onXpChange: (xp: number) => void
  onComplete: () => void
}

type TestResult = { passed: boolean; input: string; expected: number; got: number }

export function CodePanel({ onXpChange, onComplete }: CodePanelProps) {
  const timer = useTimer()
  const [code, setCode] = useState("")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle")
  const [xpEarned, setXpEarned] = useState(0)
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Custom array visualization state
  const [customArray, setCustomArray] = useState("2, 5, 8, 12, 16, 23, 38")
  const [customTarget, setCustomTarget] = useState("23")
  const [vizSteps, setVizSteps] = useState<DSAStep[]>([])
  const [vizStep, setVizStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [vizError, setVizError] = useState<string | null>(null)
  const [vizSafetyStopped, setVizSafetyStopped] = useState(false)
  const [vizMode, setVizMode] = useState(false) // true = showing visualization

  const maxStep = vizSteps.length - 1

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      setVizStep((prev) => {
        if (prev >= maxStep) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, SPEED_MS)
    
    return () => clearTimeout(timer)
  }, [isPlaying, vizStep, maxStep])

  const runVisualization = useCallback(() => {
    const arrayParsed = customArray
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n))
    const targetParsed = parseInt(customTarget.trim(), 10)

    if (arrayParsed.length === 0) {
      setVizError("Enter a valid comma-separated array of numbers.")
      return
    }
    if (isNaN(targetParsed)) {
      setVizError("Enter a valid target number.")
      return
    }

    // Check if array is sorted
    for (let i = 1; i < arrayParsed.length; i++) {
      if (arrayParsed[i] < arrayParsed[i - 1]) {
        setVizError("Array must be sorted in ascending order for binary search.")
        return
      }
    }

    if (!code.trim()) {
      setVizError("Write your code first, then run the visualization.")
      return
    }

    const result = runSafeBinarySearchPseudocode({
      source: code,
      array: arrayParsed,
      target: targetParsed,
    })

    setVizError(result.error || null)
    setVizSafetyStopped(!!result.safetyStopped)
    setVizSteps(result.steps)
    setVizStep(0)
    setIsPlaying(false)
    setVizMode(true)
  }, [code, customArray, customTarget])

  const runTests = () => {
    const results: TestResult[] = []

    for (const tc of TEST_CASES) {
      const run = runSafeBinarySearchPseudocode({
        source: code,
        array: tc.array,
        target: tc.target,
      })

      results.push({
        passed: run.ok && run.resultIndex === tc.expected,
        input: `[${tc.array.join(", ")}], target=${tc.target}`,
        expected: tc.expected,
        got: run.ok ? run.resultIndex : -999,
      })
    }

    setTestResults(results)
    const allPassed = results.every((r) => r.passed)

    if (allPassed) {
      setStatus("pass")
      timer.stop()
      if (!hasCompletedOnce) {
        setXpEarned(CODE_XP)
        onXpChange(CODE_XP)
        setHasCompletedOnce(true)
        onComplete()
      }
    } else {
      setStatus("fail")
    }
  }

  const handleReset = () => {
    setCode("")
    setTestResults([])
    setStatus("idle")
    setVizSteps([])
    setVizStep(0)
    setVizMode(false)
    setVizError(null)
    setVizSafetyStopped(false)
    setIsPlaying(false)
    timer.reset()
  }

  const closeViz = () => {
    setVizMode(false)
    setVizSteps([])
    setVizStep(0)
    setIsPlaying(false)
    setVizError(null)
    setVizSafetyStopped(false)
  }

  const currentSnapshot = vizSteps.length > 0
    ? (vizSteps[Math.min(vizStep, maxStep)].snapshot as BinarySearchSnapshot)
    : null

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[12px]">
          <span className="text-(--text-tertiary)">
            {TEST_CASES.length} test cases
          </span>
          <span className="text-(--text-tertiary)">&middot;</span>
          <span className="font-medium text-[#F59E0B]">{xpEarned} XP</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-md bg-(--bg-surface) px-2 py-0.5 text-[11px] tabular-nums text-(--text-tertiary)">
            <Clock size={11} /> {timer.formatted}
          </span>
          {status === "pass" && (
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-medium text-green-500">
              <CheckCircle2 size={12} /> Complete
            </span>
          )}
        </div>
      </div>

      {/* Instructions card */}
      <div className="rounded-xl border border-border bg-(--bg-elevated) px-5 py-3.5">
        <p className="text-[13px] text-foreground font-medium mb-1">
          Implement binary search
        </p>
        <p className="text-[12px] text-(--text-secondary) leading-relaxed">
          Variables <code className="rounded bg-[#6C47FF]/8 px-1.5 py-px text-[11px] font-mono text-[#6C47FF]">arr</code> and
          {" "}<code className="rounded bg-[#6C47FF]/8 px-1.5 py-px text-[11px] font-mono text-[#6C47FF]">target</code> are
          available. Return the index when found, or <code className="rounded bg-[#6C47FF]/8 px-1.5 py-px text-[11px] font-mono text-[#6C47FF]">-1</code> when not.
          Use <strong>Run Tests</strong> to earn XP, or <strong>Visualize</strong> to step through your code on a custom array.
        </p>
      </div>

      {/* Custom array + target inputs */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-[11px] font-medium text-(--text-tertiary)">Array (sorted, comma-separated)</label>
          <input
            type="text"
            value={customArray}
            onChange={(e) => setCustomArray(e.target.value)}
            placeholder="2, 5, 8, 12, 16, 23, 38"
            className="w-full rounded-lg border border-border bg-(--bg-surface) px-3 py-2 font-mono text-[13px] text-foreground placeholder:text-(--text-tertiary)/40 focus:border-[#6C47FF]/40 focus:outline-none transition-colors"
          />
        </div>
        <div className="w-28">
          <label className="mb-1 block text-[11px] font-medium text-(--text-tertiary)">Target</label>
          <input
            type="text"
            value={customTarget}
            onChange={(e) => setCustomTarget(e.target.value)}
            placeholder="23"
            className="w-full rounded-lg border border-border bg-(--bg-surface) px-3 py-2 font-mono text-[13px] text-foreground placeholder:text-(--text-tertiary)/40 focus:border-[#6C47FF]/40 focus:outline-none transition-colors"
          />
        </div>
        <Button
          size="sm"
          onClick={runVisualization}
          disabled={!code.trim()}
          className="gap-1.5 shrink-0"
        >
          <Zap size={12} /> Visualize
        </Button>
      </div>

      {/* Visualization panel */}
      <AnimatePresence>
        {vizMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-(--bg-elevated)">
              {/* Viz header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div className="flex items-center gap-2">
                  {vizSafetyStopped ? (
                    <AlertTriangle size={14} className="text-[#F59E0B]" />
                  ) : vizError && vizSteps.length === 0 ? (
                    <XCircle size={14} className="text-red-400" />
                  ) : (
                    <Terminal size={14} className="text-(--text-tertiary)" />
                  )}
                  <p className="text-[13px] font-medium text-foreground">
                    {vizSteps.length > 0
                      ? vizSteps[Math.min(vizStep, maxStep)].description
                      : vizError || "No steps generated"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {vizSteps.length > 0 && (
                    <span className="rounded-md bg-(--bg-surface) px-2 py-0.5 text-[11px] text-(--text-tertiary) tabular-nums">
                      {vizStep + 1} / {vizSteps.length}
                    </span>
                  )}
                  <button
                    onClick={closeViz}
                    className="text-[11px] text-(--text-tertiary) hover:text-foreground transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Safety / error banner */}
              {vizSafetyStopped && (
                <div className="flex items-center gap-2.5 border-b border-[#F59E0B]/20 bg-[#F59E0B]/5 px-5 py-2.5">
                  <AlertTriangle size={14} className="shrink-0 text-[#F59E0B]" />
                  <p className="text-[12px] text-[#F59E0B] leading-relaxed">
                    <strong>Infinite loop detected.</strong> Execution was stopped after {vizSteps.length} steps. Check your while condition and pointer updates.
                  </p>
                </div>
              )}
              {vizError && !vizSafetyStopped && vizSteps.length === 0 && (
                <div className="flex items-center gap-2.5 border-b border-red-500/20 bg-red-500/5 px-5 py-2.5">
                  <XCircle size={14} className="shrink-0 text-red-400" />
                  <p className="text-[12px] text-red-400 leading-relaxed">{vizError}</p>
                </div>
              )}

              {/* Array cells visualization */}
              {currentSnapshot && (
                <div className="flex items-center justify-center px-6 py-8">
                  <div className="flex items-start gap-4 flex-wrap justify-center">
                    {currentSnapshot.array.map((value, index) => {
                      const isLow = currentSnapshot.low === index
                      const isHigh = currentSnapshot.high === index
                      const isMid = currentSnapshot.mid === index
                      const isFound = currentSnapshot.foundIndex === index
                      const inWindow = index >= currentSnapshot.low && index <= currentSnapshot.high

                      return (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <span className="text-[11px] font-mono text-(--text-tertiary)">{index}</span>
                          <motion.div
                            animate={{ scale: isMid || isFound ? 1.08 : 1, y: isMid || isFound ? -2 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={[
                              "flex h-[52px] w-[52px] items-center justify-center rounded-2xl border text-lg font-bold transition-colors duration-200",
                              isFound
                                ? "border-green-500/60 bg-green-500/12 text-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.15)]"
                                : isMid
                                  ? "border-[#6C47FF]/60 bg-[#6C47FF]/10 text-[#6C47FF] shadow-[0_4px_20px_rgba(108,71,255,0.15)]"
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
              )}

              {/* Target + result label */}
              {currentSnapshot && (
                <div className="border-t border-border px-5 py-2 text-center flex items-center justify-center gap-4">
                  <span className="text-[11px] text-(--text-tertiary)">target = <span className="font-semibold text-(--text-secondary)">{currentSnapshot.target}</span></span>
                  {currentSnapshot.foundIndex !== null && (
                    <span className="text-[11px] font-medium text-green-500">Found at index {currentSnapshot.foundIndex}</span>
                  )}
                </div>
              )}

              {/* Playback controls */}
              {vizSteps.length > 0 && (
                <div className="flex items-center justify-end border-t border-border px-5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => { setVizStep(0); setIsPlaying(false) }}
                    >
                      <RotateCcw size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={vizStep >= maxStep}
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setVizStep((s) => Math.min(s + 1, maxStep))}
                      disabled={vizStep >= maxStep}
                    >
                      <SkipForward size={14} />
                    </Button>
                  </div>

                  {/* Step dots */}
                  {/* <div className="flex items-center gap-1 flex-wrap max-w-[60%] justify-end">
                    {vizSteps.map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ width: i === vizStep ? 16 : 6 }}
                        className={`h-1.5 rounded-full cursor-pointer transition-colors duration-200 ${
                          i === vizStep ? "bg-[#6C47FF]" : i < vizStep ? "bg-[#6C47FF]/30" : "bg-border"
                        }`}
                        onClick={() => { setVizStep(i); setIsPlaying(false) }}
                      />
                    ))}
                  </div> */}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor + Reference */}
      <div className="grid flex-1 grid-cols-1 gap-3 xl:grid-cols-2">
        {/* Editor */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-(--bg-elevated)">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Terminal size={13} className="text-(--text-tertiary)" />
              <span className="text-[11px] font-semibold text-(--text-tertiary)">Your Code</span>
            </div>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="icon-xs" onClick={handleReset}><RotateCcw size={12} /></Button>
              <Button
                size="xs"
                onClick={runTests}
                disabled={!code.trim()}
                className="gap-1"
              >
                <Play size={11} /> Run Tests
              </Button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              if (!timer.running && !hasCompletedOnce) timer.start()
              setCode(e.target.value)
            }}
            placeholder={"let low = 0\nlet high = arr.length - 1\nwhile (low <= high) {\n  let mid = Math.floor((low + high) / 2)\n  if (arr[mid] === target) {\n    return mid\n  }\n  if (arr[mid] < target) {\n    low = mid + 1\n  } else {\n    high = mid - 1\n  }\n}\nreturn -1"}
            spellCheck={false}
            className="flex-1 resize-none bg-[#0C0C0F] px-4 py-3 font-mono text-[13px] leading-[1.7] text-foreground placeholder:text-(--text-tertiary)/40 focus:outline-none min-h-[240px]"
          />
        </div>

        {/* Reference */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-(--bg-elevated)">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <span className="text-[11px] font-semibold text-(--text-tertiary)">Reference</span>
          </div>
          <div className="flex-1 overflow-auto bg-[#0C0C0F] px-4 py-3">
            <pre className="font-mono text-[13px] leading-[1.7]">
              {BINARY_SEARCH_REFERENCE_CODE.map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 inline-block w-3 text-right text-[11px] text-(--text-tertiary)/40 select-none">{i + 1}</span>
                  <span className="text-(--text-secondary)">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>

      {/* Test results */}
      <AnimatePresence>
        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-(--bg-elevated) overflow-hidden"
          >
            {/* Result header */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              {status === "pass"
                ? <CheckCircle2 size={14} className="text-green-500" />
                : <XCircle size={14} className="text-red-400" />
              }
              <span className={`text-[12px] font-semibold ${status === "pass" ? "text-green-500" : "text-red-400"}`}>
                {status === "pass" ? `All tests passed — +${CODE_XP} XP` : "Some tests failed"}
              </span>
            </div>

            {/* Individual results */}
            <div className="divide-y divide-border">
              {testResults.map((r, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 text-[12px]">
                  <span className="font-mono text-(--text-secondary)">{r.input}</span>
                  <span className={`font-medium ${r.passed ? "text-green-500" : "text-red-400"}`}>
                    {r.passed ? "Pass" : `Expected ${r.expected}, got ${r.got === -999 ? "error" : r.got}`}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
