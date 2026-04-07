import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { trackDSAEvent } from "@/lib/analytics/dsa-events"
import { BINARY_SEARCH_COMPLEXITY, BINARY_SEARCH_REFERENCE_CODE, generateBinarySearchSteps } from "@/lib/algorithms/binarySearch"
import { BUBBLE_SORT_COMPLEXITY, BUBBLE_SORT_REFERENCE_CODE, generateBubbleSortSteps } from "@/lib/algorithms/bubbleSort"
import { BFS_COMPLEXITY, BFS_REFERENCE_CODE, generateBFSSteps } from "@/lib/algorithms/bfs"
import { STACK_COMPLEXITY, STACK_REFERENCE_CODE, generateStackSteps } from "@/lib/algorithms/stack"
import { QUEUE_COMPLEXITY, QUEUE_REFERENCE_CODE, generateQueueSteps } from "@/lib/algorithms/queue"
import { DIJKSTRA_COMPLEXITY, DIJKSTRA_REFERENCE_CODE, generateDijkstraSteps } from "@/lib/algorithms/dijkstra"
import { runSafeBinarySearchPseudocode } from "@/lib/algorithms/safePseudocodeRunner"
import { generateAIDSAQuestions } from "@/services/dsa-ai.service"
import type { ComplexityMeta, DSAAlgorithm, PlaybackState, DSAStep, StepQuestion } from "@/types/dsa.types"
import { DSAHeaderControls } from "./components/DSAHeaderControls"
import { DSAVisualizer } from "./components/DSAVisualizer"
import { DSAReferenceCode } from "./components/DSAReferenceCode"
import { DSABuildPanel } from "./components/DSABuildPanel"
import { DSAWatchPanel } from "./components/DSAWatchPanel"

const BINARY_DEFAULT_ARRAY = [2, 5, 8, 12, 16, 23, 38]
const BINARY_DEFAULT_TARGET = 23
const BUBBLE_DEFAULT_ARRAY = [64, 34, 25, 12, 22, 11, 90]
const BFS_DEFAULT_START = "A"
const PREDICT_XP_PER_CORRECT = 15
const CODE_XP_REWARD = 35
const PREDICT_CONTINUE_DELAY_MS = 1500

interface BinarySearchInputConfig {
  array: number[]
  target: number
  startNode?: string
}

interface AlgorithmRuntime {
  algorithmLabel: string
  steps: DSAStep[]
  resultLabel: string
  complexity: ComplexityMeta
  referenceCode: string[]
  expectedResultIndex?: number
}

function parseArrayInput(raw: string): number[] | null {
  const values = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number(value))

  if (!values.length || values.some((value) => Number.isNaN(value))) {
    return null
  }

  return values
}

function isSortedAscending(values: number[]): boolean {
  for (let index = 1; index < values.length; index += 1) {
    if (values[index - 1] > values[index]) {
      return false
    }
  }
  return true
}

const ALGORITHM_BY_LEVEL: Record<string, DSAAlgorithm> = {
  "1": "binary-search",
  "2": "bubble-sort",
  "3": "bfs",
  "4": "stack",
  "5": "queue",
  "6": "dijkstra",
}

export default function DSALearningPage() {
  const { levelId } = useParams<{ levelId: string }>()
  const algorithm: DSAAlgorithm = ALGORITHM_BY_LEVEL[levelId ?? ""] ?? "binary-search"

  const defaultArray = algorithm === "binary-search" ? BINARY_DEFAULT_ARRAY : BUBBLE_DEFAULT_ARRAY
  const defaultTarget = algorithm === "binary-search" ? BINARY_DEFAULT_TARGET : 0

  const [inputConfig, setInputConfig] = useState<BinarySearchInputConfig>({
    array: defaultArray,
    target: defaultTarget,
    startNode: BFS_DEFAULT_START,
  })
  const [arrayInput, setArrayInput] = useState(defaultArray.join(", "))
  const [targetInput, setTargetInput] = useState(String(defaultTarget))
  const [startNodeInput, setStartNodeInput] = useState(BFS_DEFAULT_START)
  const [inputError, setInputError] = useState<string | null>(null)
  const [predictAnswered, setPredictAnswered] = useState(false)
  const [predictOverlayResult, setPredictOverlayResult] = useState<"correct" | "wrong" | null>(null)
  const [predictOverlayMessage, setPredictOverlayMessage] = useState<string | null>(null)
  const [predictXp, setPredictXp] = useState(0)
  const [codeEditorValue, setCodeEditorValue] = useState("")
  const [codeRunSteps, setCodeRunSteps] = useState<DSAStep[] | null>(null)
  const [codeRunMessage, setCodeRunMessage] = useState<string | null>(null)
  const [codeRunStatus, setCodeRunStatus] = useState<"idle" | "success" | "error">("idle")
  const [codeRunXp, setCodeRunXp] = useState(0)
  const [aiQuestionMap, setAiQuestionMap] = useState<Record<string, StepQuestion>>({})
  const [isGeneratingAiQuestions, setIsGeneratingAiQuestions] = useState(false)
  const [aiQuestionError, setAiQuestionError] = useState<string | null>(null)

  const startedSignatureRef = useRef("")
  const completedSignatureRef = useRef("")
  const predictContinueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [playback, setPlayback] = useState<PlaybackState>({
    currentStep: 0,
    isPlaying: false,
    speedMs: 900,
    mode: "watch",
  })

  const runtime = useMemo<AlgorithmRuntime>(() => {
    if (algorithm === "binary-search") {
      const { steps, resultIndex } = generateBinarySearchSteps({
        array: inputConfig.array,
        target: inputConfig.target,
      })

      return {
        algorithmLabel: "Binary Search",
        steps,
        resultLabel: resultIndex >= 0 ? `Found at index ${resultIndex}` : "Not found",
        complexity: BINARY_SEARCH_COMPLEXITY,
        referenceCode: BINARY_SEARCH_REFERENCE_CODE,
        expectedResultIndex: resultIndex,
      }
    }

    if (algorithm === "bfs") {
      const { steps, visitedOrder } = generateBFSSteps({
        startNode: inputConfig.startNode ?? BFS_DEFAULT_START,
      })
      return {
        algorithmLabel: "Breadth-First Search",
        steps,
        resultLabel: `Visited: ${visitedOrder.join(" → ")}`,
        complexity: BFS_COMPLEXITY,
        referenceCode: BFS_REFERENCE_CODE,
      }
    }

    if (algorithm === "stack") {
      const { steps, finalItems } = generateStackSteps()
      return {
        algorithmLabel: "Stack (LIFO)",
        steps,
        resultLabel: `Final stack (bottom→top): [${finalItems.join(", ") || "empty"}]`,
        complexity: STACK_COMPLEXITY,
        referenceCode: STACK_REFERENCE_CODE,
      }
    }

    if (algorithm === "queue") {
      const { steps, finalItems } = generateQueueSteps()
      return {
        algorithmLabel: "Queue (FIFO)",
        steps,
        resultLabel: `Final queue (front→rear): [${finalItems.join(", ") || "empty"}]`,
        complexity: QUEUE_COMPLEXITY,
        referenceCode: QUEUE_REFERENCE_CODE,
      }
    }

    if (algorithm === "dijkstra") {
      const { steps, shortestDistances } = generateDijkstraSteps({
        startNode: inputConfig.startNode ?? "A",
      })
      return {
        algorithmLabel: "Dijkstra's Shortest Path",
        steps,
        resultLabel: `Shortest: ${Object.entries(shortestDistances).map(([n, d]) => `${n}=${d === 9999 ? "∞" : d}`).join(", ")}`,
        complexity: DIJKSTRA_COMPLEXITY,
        referenceCode: DIJKSTRA_REFERENCE_CODE,
      }
    }

    const { steps, resultArray } = generateBubbleSortSteps({
      array: inputConfig.array,
    })

    return {
      algorithmLabel: "Bubble Sort",
      steps,
      resultLabel: `Sorted output: [${resultArray.join(", ")}]`,
      complexity: BUBBLE_SORT_COMPLEXITY,
      referenceCode: BUBBLE_SORT_REFERENCE_CODE,
    }
  }, [algorithm, inputConfig.array, inputConfig.target])

  const { resultLabel, complexity, referenceCode, algorithmLabel } = runtime

  const runtimeStepsWithAI = useMemo(
    () =>
      runtime.steps.map((step) => {
        const aiQuestion = aiQuestionMap[step.id]
        if (!aiQuestion) {
          return step
        }

        return {
          ...step,
          question: aiQuestion,
        }
      }),
    [runtime.steps, aiQuestionMap]
  )

  const activeSteps = useMemo(() => {
    if (playback.mode === "build" && codeRunSteps?.length) {
      return codeRunSteps
    }
    return runtimeStepsWithAI
  }, [playback.mode, codeRunSteps, runtimeStepsWithAI])

  const maxStepIndex = Math.max(activeSteps.length - 1, 0)
  const currentStep = activeSteps[Math.min(playback.currentStep, maxStepIndex)]
  const stepNumber = Math.min(playback.currentStep + 1, activeSteps.length)
  const completionPercent =
    playback.mode === "build" && !codeRunSteps?.length
      ? 0
      : activeSteps.length > 0
        ? Math.round((stepNumber / activeSteps.length) * 100)
        : 0
  const runSignature = `${algorithm}:${inputConfig.array.join(",")}:${inputConfig.target}`

  const questionStepIndices = useMemo(
    () =>
      runtimeStepsWithAI
        .map((step, index) => (step.question ? index : -1))
        .filter((index) => index >= 0 && index < runtimeStepsWithAI.length - 1),
    [runtimeStepsWithAI]
  )

  const predictPauseStep = useMemo(() => {
    if (playback.mode !== "predict" || !questionStepIndices.length) {
      return null
    }

    const seed = `${runSignature}:predict`
    let hash = 0
    for (let index = 0; index < seed.length; index += 1) {
      hash = (hash << 5) - hash + seed.charCodeAt(index)
      hash |= 0
    }

    const selectedIndex = Math.abs(hash) % questionStepIndices.length
    return questionStepIndices[selectedIndex]
  }, [playback.mode, questionStepIndices, runSignature])

  const activePredictQuestion =
    playback.mode === "predict" &&
    predictPauseStep !== null &&
    playback.currentStep === predictPauseStep
      ? (runtimeStepsWithAI[predictPauseStep]?.question ?? null)
      : null

  const isPredictOverlayVisible =
    playback.mode === "predict" &&
    activePredictQuestion !== null &&
    (!predictAnswered || Boolean(predictOverlayMessage))

  useEffect(() => {
    let cancelled = false

    const aiCandidateSteps = runtime.steps
      .filter((step) => Boolean(step.question))
      .map((step) => ({
        stepId: step.id,
        type: step.type,
        description: step.description,
        codeLine: step.codeLine,
        snapshot: step.snapshot as unknown as Record<string, unknown>,
      }))

    async function loadAIQuestions() {
      setAiQuestionMap({})
      setAiQuestionError(null)

      if (!aiCandidateSteps.length) {
        setIsGeneratingAiQuestions(false)
        return
      }

      setIsGeneratingAiQuestions(true)

      try {
        const generated = await generateAIDSAQuestions({
          algorithm,
          context:
            algorithm === "binary-search"
              ? { array: inputConfig.array, target: inputConfig.target }
              : { array: inputConfig.array },
          steps: aiCandidateSteps,
        })

        if (cancelled) {
          return
        }

        const map = generated.reduce<Record<string, StepQuestion>>((accumulator, item) => {
          if (
            item &&
            typeof item.stepId === "string" &&
            typeof item.text === "string" &&
            Array.isArray(item.options) &&
            Number.isInteger(item.correct) &&
            item.correct >= 0 &&
            item.correct < item.options.length &&
            typeof item.explanation === "string" &&
            item.options.length === 4
          ) {
            accumulator[item.stepId] = {
              text: item.text,
              options: item.options,
              correct: item.correct,
              explanation: item.explanation,
            }
          }

          return accumulator
        }, {})

        setAiQuestionMap(map)
      } catch {
        if (cancelled) {
          return
        }

        setAiQuestionError("AI questions unavailable. Using built-in questions.")
      } finally {
        if (!cancelled) {
          setIsGeneratingAiQuestions(false)
        }
      }
    }

    loadAIQuestions()

    return () => {
      cancelled = true
    }
  }, [algorithm, inputConfig.array, inputConfig.target, runtime.steps])

  useEffect(() => {
    const startedSignature = `${runSignature}:${playback.mode}`

    if (startedSignatureRef.current === startedSignature) {
      return
    }

    startedSignatureRef.current = startedSignature
    completedSignatureRef.current = ""

    trackDSAEvent("started", {
      algorithm,
      mode: playback.mode,
      step: 1,
      totalSteps: activeSteps.length,
      details: algorithmLabel,
    })
  }, [algorithm, algorithmLabel, playback.mode, runSignature, activeSteps.length])

  useEffect(() => {
    if (playback.currentStep < maxStepIndex || maxStepIndex === 0) {
      return
    }

    const completedSignature = `${runSignature}:${playback.mode}`

    if (completedSignatureRef.current === completedSignature) {
      return
    }

    completedSignatureRef.current = completedSignature

    trackDSAEvent("completed", {
      algorithm,
      mode: playback.mode,
      step: stepNumber,
      totalSteps: activeSteps.length,
      details: algorithmLabel,
    })
  }, [
    algorithm,
    algorithmLabel,
    maxStepIndex,
    playback.currentStep,
    playback.mode,
    runSignature,
    stepNumber,
    activeSteps.length,
  ])

  useEffect(() => {
    return () => {
      if (predictContinueTimerRef.current) {
        clearTimeout(predictContinueTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!playback.isPlaying) {
      return
    }

    if (playback.currentStep >= maxStepIndex) {
      return
    }

    if (
      playback.mode === "predict" &&
      predictPauseStep !== null &&
      playback.currentStep >= predictPauseStep &&
      !predictAnswered
    ) {
      return
    }

    const timer = setTimeout(() => {
      setPlayback((prev) => {
        if (prev.currentStep >= maxStepIndex) {
          return { ...prev, isPlaying: false }
        }

        const nextStep = Math.min(prev.currentStep + 1, maxStepIndex)
        return {
          ...prev,
          currentStep: nextStep,
          isPlaying: nextStep >= maxStepIndex ? false : prev.isPlaying,
        }
      })
    }, playback.speedMs)

    return () => clearTimeout(timer)
  }, [
    playback.isPlaying,
    playback.mode,
    playback.currentStep,
    playback.speedMs,
    maxStepIndex,
    predictPauseStep,
    predictAnswered,
  ])

  const isQuestionAnswered = !isPredictOverlayVisible

  const setStep = (nextStep: number) => {
    setPredictOverlayMessage(null)
    setPredictOverlayResult(null)
    setPlayback((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(nextStep, maxStepIndex)),
    }))
  }

  const handleReplay = () => {
    if (predictContinueTimerRef.current) {
      clearTimeout(predictContinueTimerRef.current)
      predictContinueTimerRef.current = null
    }

    setPredictAnswered(false)
    setPredictOverlayResult(null)
    setPredictOverlayMessage(null)
    setPredictXp(0)
    setCodeRunMessage(null)
    setCodeRunStatus("idle")
    setCodeRunXp(0)

    setPlayback((prev) => ({
      ...prev,
      currentStep: 0,
      isPlaying: playback.mode === "predict",
    }))

    trackDSAEvent("replay", {
      algorithm,
      mode: playback.mode,
      step: 1,
      totalSteps: activeSteps.length,
      details: algorithmLabel,
    })
  }

  const submitPredictAnswer = (selectedIndex: number) => {
    if (!activePredictQuestion || predictAnswered) return

    const isCorrect = selectedIndex === activePredictQuestion.correct
    setPredictAnswered(true)
    setPredictOverlayResult(isCorrect ? "correct" : "wrong")

    if (isCorrect) {
      setPredictXp((previous) => previous + PREDICT_XP_PER_CORRECT)
      setPredictOverlayMessage(`✅ Correct. +${PREDICT_XP_PER_CORRECT} XP. ${activePredictQuestion.explanation}`)
      trackDSAEvent("predict_hit", {
        algorithm,
        mode: playback.mode,
        step: stepNumber,
        totalSteps: runtimeStepsWithAI.length,
        details: `pause-step-${predictPauseStep ?? playback.currentStep}`,
      })
    } else {
      setPredictOverlayMessage(`❌ Not quite. ${activePredictQuestion.explanation}`)
      trackDSAEvent("predict_miss", {
        algorithm,
        mode: playback.mode,
        step: stepNumber,
        totalSteps: runtimeStepsWithAI.length,
        details: `pause-step-${predictPauseStep ?? playback.currentStep}`,
      })
    }

    predictContinueTimerRef.current = setTimeout(() => {
      setPredictOverlayResult(null)
      setPredictOverlayMessage(null)
      setPlayback((prev) => ({
        ...prev,
        currentStep: Math.min(prev.currentStep + 1, maxStepIndex),
        isPlaying: true,
      }))
    }, PREDICT_CONTINUE_DELAY_MS)
  }

  const handleModeChange = (nextMode: PlaybackState["mode"]) => {
    if (predictContinueTimerRef.current) {
      clearTimeout(predictContinueTimerRef.current)
      predictContinueTimerRef.current = null
    }

    setPredictAnswered(false)
    setPredictOverlayResult(null)
    setPredictOverlayMessage(null)
    setCodeRunMessage(null)
    setCodeRunStatus("idle")
    setCodeRunXp(0)

    setPlayback((prev) => ({
      ...prev,
      mode: nextMode,
      currentStep: 0,
      isPlaying: nextMode === "predict",
    }))
  }

  const applyCustomInput = () => {
    const parsedArray = parseArrayInput(arrayInput)
    if (!parsedArray) {
      setInputError("Enter a valid comma-separated number list (example: 2, 5, 8, 12).")
      return
    }

    if (algorithm === "binary-search" && !isSortedAscending(parsedArray)) {
      setInputError("Binary Search requires an ascending sorted array.")
      return
    }

    let parsedTarget = 0
    if (algorithm === "binary-search") {
      parsedTarget = Number(targetInput.trim())
      if (Number.isNaN(parsedTarget)) {
        setInputError("Target must be a valid number.")
        return
      }
    }

    setInputError(null)
    setInputConfig({
      array: parsedArray,
      target: parsedTarget,
    })

    if (predictContinueTimerRef.current) {
      clearTimeout(predictContinueTimerRef.current)
      predictContinueTimerRef.current = null
    }

    setPredictAnswered(false)
    setPredictOverlayResult(null)
    setPredictOverlayMessage(null)
    setPredictXp(0)
    setCodeRunMessage(null)
    setCodeRunStatus("idle")
    setCodeRunXp(0)
    setCodeRunSteps(null)

    setPlayback((prev) => ({
      ...prev,
      currentStep: 0,
      isPlaying: prev.mode === "predict",
    }))
  }

  const runUserCode = () => {
    if (playback.mode !== "build") {
      return
    }

    if (algorithm !== "binary-search") {
      setCodeRunStatus("error")
      setCodeRunMessage("Custom code execution currently supports Binary Search. Switch algorithm to run code.")
      setCodeRunXp(0)
      return
    }

    const run = runSafeBinarySearchPseudocode({
      source: codeEditorValue,
      array: inputConfig.array,
      target: inputConfig.target,
    })

    setCodeRunSteps(run.steps.length ? run.steps : null)
    setPlayback((prev) => ({
      ...prev,
      currentStep: 0,
      isPlaying: run.steps.length > 1,
      mode: "build",
    }))

    if (!run.ok) {
      setCodeRunStatus("error")
      setCodeRunMessage(run.error ?? "Execution failed.")
      setCodeRunXp(0)
      trackDSAEvent("completed", {
        algorithm,
        mode: "build",
        step: 1,
        totalSteps: run.steps.length || 1,
        details: run.safetyStopped ? "code-run-safety-stopped" : "code-run-invalid-logic",
      })
      return
    }

    const expectedResultIndex = runtime.expectedResultIndex ?? -1
    const solved = run.resultIndex === expectedResultIndex

    if (solved) {
      setCodeRunStatus("success")
      setCodeRunMessage(`Correct logic. Result index: ${run.resultIndex}. +${CODE_XP_REWARD} XP`) 
      setCodeRunXp(CODE_XP_REWARD)
      trackDSAEvent("completed", {
        algorithm,
        mode: "build",
        step: run.steps.length,
        totalSteps: run.steps.length,
        details: "code-run-success",
      })
      return
    }

    setCodeRunStatus("error")
    setCodeRunMessage(`Your code returned ${run.resultIndex}, expected ${expectedResultIndex}. No XP earned.`)
    setCodeRunXp(0)
    trackDSAEvent("completed", {
      algorithm,
      mode: "build",
      step: run.steps.length,
      totalSteps: run.steps.length,
      details: "code-run-wrong-result",
    })
  }

  if (!activeSteps.length) {
    return (
      <div className="flex min-h-full flex-col gap-3.5 p-1 font-sans">
        <div className="min-h-0 overflow-auto rounded-xl border border-(--card-border) bg-card p-3">
          <h3 className="font-grotesk">Unable to load algorithm steps</h3>
          <p>Try resetting inputs or switching algorithm.</p>
        </div>
      </div>
    )
  }

  const isBinaryMode = algorithm === "binary-search"
  const isGraphMode = algorithm === "bfs"
  const isStackMode = algorithm === "stack"
  const isQueueMode = algorithm === "queue"
  const isDijkstraMode = algorithm === "dijkstra"

  const buildQuestion = isBinaryMode
    ? `Write pseudocode to find target ${inputConfig.target} in [${inputConfig.array.join(", ")}]. Return the correct index or -1.`
    : isGraphMode || isStackMode || isQueueMode || isDijkstraMode
      ? `Build mode is not available for this algorithm yet.`
      : `Write pseudocode to sort [${inputConfig.array.join(", ")}] in ascending order.`

  const pointerState = isBinaryMode
    ? (() => {
        const snapshot = currentStep.snapshot as { low?: number; mid?: number | null; high?: number }
        return `low=${snapshot.low ?? "-"}, mid=${snapshot.mid ?? "-"}, high=${snapshot.high ?? "-"}`
      })()
    : isGraphMode
      ? (() => {
          const snapshot = currentStep.snapshot as { queue?: string[]; currentNode?: string | null }
          return `queue=[${snapshot.queue?.join(",") || ""}], current=${snapshot.currentNode ?? "-"}`
        })()
      : isStackMode
        ? (() => {
            const snapshot = currentStep.snapshot as { items?: number[]; topIndex?: number | null }
            return `top=${snapshot.topIndex ?? "-"}, size=${snapshot.items?.length ?? 0}`
          })()
        : isQueueMode
          ? (() => {
              const snapshot = currentStep.snapshot as { items?: number[]; frontIndex?: number | null }
              return `front=${snapshot.items?.[0] ?? "-"}, size=${snapshot.items?.length ?? 0}`
            })()
          : isDijkstraMode
            ? (() => {
                const snapshot = currentStep.snapshot as { currentNode?: string | null; visited?: string[] }
                return `current=${snapshot.currentNode ?? "-"}, settled=${snapshot.visited?.length ?? 0}`
              })()
            : (() => {
              const snapshot = currentStep.snapshot as { pass?: number; compareIndices?: number[] }
              return `pass=${snapshot.pass ?? 0}, compare=${snapshot.compareIndices?.join(",") || "-"}`
            })()

  return (
    <div className="flex min-h-full flex-col gap-3.5 p-1 font-sans">
      <DSAHeaderControls
        algorithm={algorithm}
        algorithmLabel={algorithmLabel}
        playback={playback}
        isQuestionAnswered={isQuestionAnswered}
        onModeChange={handleModeChange}
        onReplay={handleReplay}
        onBack={() => setStep(playback.currentStep - 1)}
        onTogglePlay={() => setPlayback((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
        onNext={() => setStep(playback.currentStep + 1)}
        onEnd={() => setStep(maxStepIndex)}
        onSpeedChange={(value) => setPlayback((prev) => ({ ...prev, speedMs: value }))}
      />

      <div className="grid flex-1 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid grid-rows-[auto_auto] gap-3">
          <DSAVisualizer
            currentStep={currentStep}
            algorithm={algorithm}
            predictOverlayResult={predictOverlayResult}
            isPredictOverlayVisible={isPredictOverlayVisible}
            activePredictQuestion={activePredictQuestion}
            predictAnswered={predictAnswered}
            onSubmitPredictAnswer={submitPredictAnswer}
            predictOverlayMessage={predictOverlayMessage}
          />

          <DSAReferenceCode
            referenceCode={referenceCode}
            activeCodeLine={currentStep.codeLine}
            mode={playback.mode}
            editorCode={codeEditorValue}
            onEditorCodeChange={setCodeEditorValue}
            onRunCode={runUserCode}
            runDisabled={playback.mode !== "build" || playback.isPlaying}
          />
        </div>

        <aside className="min-h-0 overflow-auto rounded-xl border border-(--card-border) bg-card p-3 [&_h3]:mb-2.5 [&_h3]:text-[15px] [&_h4]:m-0 [&_h4]:text-xs [&_h4]:uppercase [&_h4]:tracking-[0.04em] [&_h4]:text-foreground [&_input]:h-9 [&_input]:rounded-lg [&_input]:border-border [&_input]:bg-background [&_input]:px-2.5 [&_input]:text-[13px] [&_input]:text-foreground [&_p]:m-0 [&_p]:text-[13px] [&_p]:text-(--text-secondary)">
          {playback.mode === "build" ? (
            <DSABuildPanel
              algorithmLabel={algorithmLabel}
              question={buildQuestion}
              progressPercent={completionPercent}
              executionState={`Step ${stepNumber}/${activeSteps.length}`}
              currentPointerState={pointerState}
              runMessage={codeRunMessage}
              runResult={codeRunStatus}
              xpEarned={codeRunXp}
            />
          ) : (
            <DSAWatchPanel
              currentStep={currentStep}
              stepNumber={stepNumber}
              totalSteps={activeSteps.length}
              completionPercent={completionPercent}
              resultLabel={resultLabel}
              predictXp={predictXp}
              isGeneratingAiQuestions={isGeneratingAiQuestions}
              aiQuestionError={aiQuestionError}
              algorithm={algorithm}
              arrayInput={arrayInput}
              targetInput={targetInput}
              startNodeInput={startNodeInput}
              inputError={inputError}
              complexity={complexity}
              onArrayInputChange={setArrayInput}
              onTargetInputChange={setTargetInput}
              onStartNodeChange={(node) => {
                setStartNodeInput(node)
                setInputConfig((prev) => ({ ...prev, startNode: node }))
                setPredictAnswered(false)
                setPredictOverlayResult(null)
                setPredictOverlayMessage(null)
                setPredictXp(0)
                setPlayback((prev) => ({ ...prev, currentStep: 0, isPlaying: false }))
              }}
              onApplyCustomInput={applyCustomInput}
            />
          )}
        </aside>
      </div>
    </div>
  )
}
