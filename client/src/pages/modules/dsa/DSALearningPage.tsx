import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpDown, Brain, ChevronsRight, Eye, Gauge, GripVertical, Pause, Play, RotateCcw, Search, SkipBack, SkipForward } from "lucide-react"
import { trackDSAEvent } from "@/lib/analytics/dsa-events"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BINARY_SEARCH_COMPLEXITY, BINARY_SEARCH_REFERENCE_CODE, generateBinarySearchSteps } from "@/lib/algorithms/binarySearch"
import { BUBBLE_SORT_COMPLEXITY, BUBBLE_SORT_REFERENCE_CODE, generateBubbleSortSteps } from "@/lib/algorithms/bubbleSort"
import { getPseudocodeSteps, initializeBuildMode, validateBuildModeSolution } from "@/lib/build-mode.utils"
import type { BinarySearchSnapshot, BubbleSortSnapshot, ComplexityMeta, DSAAlgorithm, PlaybackState, DSAStep, BuildModeState } from "@/types/dsa.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import "./DSALearningPage.css"

const BINARY_DEFAULT_ARRAY = [2, 5, 8, 12, 16, 23, 38]
const BINARY_DEFAULT_TARGET = 23
const BUBBLE_DEFAULT_ARRAY = [64, 34, 25, 12, 22, 11, 90]
const PREDICT_XP_PER_CORRECT = 15
const PREDICT_CONTINUE_DELAY_MS = 1500

interface BinarySearchInputConfig {
  array: number[]
  target: number
}

interface AlgorithmRuntime {
  algorithmLabel: string
  steps: DSAStep[]
  resultLabel: string
  complexity: ComplexityMeta
  referenceCode: string[]
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


export default function DSALearningPage() {
  const [algorithm, setAlgorithm] = useState<DSAAlgorithm>("binary-search")
  const [inputConfig, setInputConfig] = useState<BinarySearchInputConfig>({
    array: BINARY_DEFAULT_ARRAY,
    target: BINARY_DEFAULT_TARGET,
  })
  const [arrayInput, setArrayInput] = useState(BINARY_DEFAULT_ARRAY.join(", "))
  const [targetInput, setTargetInput] = useState(String(BINARY_DEFAULT_TARGET))
  const [inputError, setInputError] = useState<string | null>(null)
  const [predictAnswered, setPredictAnswered] = useState(false)
  const [predictOverlayResult, setPredictOverlayResult] = useState<"correct" | "wrong" | null>(null)
  const [predictOverlayMessage, setPredictOverlayMessage] = useState<string | null>(null)
  const [predictXp, setPredictXp] = useState(0)
  const startedSignatureRef = useRef("")
  const completedSignatureRef = useRef("")
  const predictContinueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [playback, setPlayback] = useState<PlaybackState>({
    currentStep: 0,
    isPlaying: false,
    speedMs: 900,
    mode: "watch",
  })

  const [buildMode, setBuildMode] = useState<BuildModeState>({
    userOrder: [],
    result: null,
    isRunning: false,
  })
  const [buildDraggedItem, setBuildDraggedItem] = useState<number | null>(null)

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

  const { steps, resultLabel, complexity, referenceCode, algorithmLabel } = runtime

  const maxStepIndex = Math.max(steps.length - 1, 0)
  const currentStep = steps[Math.min(playback.currentStep, maxStepIndex)]
  const stepNumber = Math.min(playback.currentStep + 1, steps.length)
  const completionPercent = steps.length > 0 ? Math.round((stepNumber / steps.length) * 100) : 0
  const runSignature = `${algorithm}:${inputConfig.array.join(",")}:${inputConfig.target}`
  const questionStepIndices = useMemo(
    () =>
      steps
        .map((step, index) => (step.question ? index : -1))
        .filter((index) => index >= 0 && index < steps.length - 1),
    [steps]
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
      ? (steps[predictPauseStep]?.question ?? null)
      : null

  const isPredictOverlayVisible =
    playback.mode === "predict" &&
    activePredictQuestion !== null &&
    (!predictAnswered || Boolean(predictOverlayMessage))

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
      totalSteps: steps.length,
      details: algorithmLabel,
    })
  }, [algorithm, algorithmLabel, playback.mode, runSignature, steps.length])

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
      totalSteps: steps.length,
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
    steps.length,
  ])

  useEffect(() => {
    return () => {
      if (predictContinueTimerRef.current) {
        clearTimeout(predictContinueTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (playback.mode === "watch" && !playback.isPlaying) return
    if (playback.mode === "predict" && playback.currentStep >= maxStepIndex) return

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

        return {
          ...prev,
          currentStep: prev.currentStep + 1,
        }
      })
    }, playback.speedMs)

    return () => clearTimeout(timer)
  }, [
    playback.mode,
    playback.isPlaying,
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
    if (playback.mode === "build") {
      const seed = `${algorithm}:${inputConfig.array.join(",")}:${inputConfig.target}:build`
      setBuildMode(initializeBuildMode(algorithm, seed))
    }
    setPlayback((prev) => ({
      ...prev,
      currentStep: 0,
      isPlaying: playback.mode === "predict",
    }))

    trackDSAEvent("replay", {
      algorithm,
      mode: playback.mode,
      step: 1,
      totalSteps: steps.length,
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
        totalSteps: steps.length,
        details: `pause-step-${predictPauseStep ?? playback.currentStep}`,
      })
    } else {
      setPredictOverlayMessage(`❌ Not quite. ${activePredictQuestion.explanation}`)
      trackDSAEvent("predict_miss", {
        algorithm,
        mode: playback.mode,
        step: stepNumber,
        totalSteps: steps.length,
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

  // Build Mode handlers
  const buildPseudocodeSteps = useMemo(() => {
    return getPseudocodeSteps(algorithm)
  }, [algorithm])

  const orderedBuildSteps = useMemo(
    () => buildMode.userOrder.map((stepIndex) => buildPseudocodeSteps[stepIndex]).filter(Boolean),
    [buildMode.userOrder, buildPseudocodeSteps]
  )

  const handleBuildDragStart = (index: number) => {
    setBuildDraggedItem(index)
  }

  const handleBuildDragEnd = () => {
    setBuildDraggedItem(null)
  }

  const handleBuildDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleBuildDrop = (targetIndex: number) => {
    if (buildDraggedItem === null || buildDraggedItem === targetIndex) {
      setBuildDraggedItem(null)
      return
    }

    const newOrder = [...buildMode.userOrder]
    const [draggedStep] = newOrder.splice(buildDraggedItem, 1)
    newOrder.splice(targetIndex, 0, draggedStep)

    setBuildMode((prev) => ({
      ...prev,
      userOrder: newOrder,
    }))
    setBuildDraggedItem(null)
  }

  const handleBuildRunSolution = () => {
    setBuildMode((prev) => ({
      ...prev,
      isRunning: true,
    }))

    const result = validateBuildModeSolution(buildMode.userOrder, algorithm, inputConfig.array, inputConfig.target)

    setBuildMode((prev) => ({
      ...prev,
      result,
      isRunning: false,
    }))

    trackDSAEvent("completed", {
      algorithm,
      mode: "build",
      step: buildMode.userOrder.length,
      totalSteps: buildPseudocodeSteps.length,
      details: result.isCorrect ? "build-correct" : `build-failed-at-${result.failedAtStep ?? 0}`,
    })
  }

  const handleAlgorithmChange = (nextAlgorithm: DSAAlgorithm) => {
    setAlgorithm(nextAlgorithm)
    if (predictContinueTimerRef.current) {
      clearTimeout(predictContinueTimerRef.current)
      predictContinueTimerRef.current = null
    }
    setPredictAnswered(false)
    setPredictOverlayResult(null)
    setPredictOverlayMessage(null)
    setPredictXp(0)
    setBuildMode({ userOrder: [], result: null, isRunning: false })
    setInputError(null)
    setPlayback((prev) => ({
      ...prev,
      currentStep: 0,
      isPlaying: false,
      mode: "watch",
    }))

    if (nextAlgorithm === "binary-search") {
      setArrayInput(BINARY_DEFAULT_ARRAY.join(", "))
      setTargetInput(String(BINARY_DEFAULT_TARGET))
      setInputConfig({
        array: BINARY_DEFAULT_ARRAY,
        target: BINARY_DEFAULT_TARGET,
      })
      return
    }

    setArrayInput(BUBBLE_DEFAULT_ARRAY.join(", "))
    setTargetInput("0")
    setInputConfig({
      array: BUBBLE_DEFAULT_ARRAY,
      target: 0,
    })
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
    setBuildMode({ userOrder: [], result: null, isRunning: false })
    setPlayback((prev) => ({
      ...prev,
      currentStep: 0,
      isPlaying: prev.mode === "predict",
    }))
  }

  if (!steps.length) {
    return (
      <div className="dsa-page font-sans">
        <div className="dsa-card dsa-card--panel">
          <h3 className="font-grotesk">Unable to load algorithm steps</h3>
          <p>Try resetting inputs or switching algorithm.</p>
        </div>
      </div>
    )
  }
  const isBinaryMode = algorithm === "binary-search"

  return (
    <div className="dsa-page font-sans">
      <div className="dsa-page__topbar">
        <div>
          <p className="dsa-page__label font-grotesk">Algorithm</p>
          <h1 className="dsa-page__title dsa-page__title--icon font-grotesk">
            {algorithm === "binary-search" ? <Search className="size-5" aria-hidden="true" /> : <ArrowUpDown className="size-5" aria-hidden="true" />}
            <span>{algorithmLabel}</span>
          </h1>
        </div>
        <div className="dsa-page__controls">
          <Select value={algorithm} onValueChange={(value) => handleAlgorithmChange(value as DSAAlgorithm)}>
            <SelectTrigger className="dsa-page__select-trigger">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="binary-search">
                <Search className="size-4" aria-hidden="true" />
                Binary Search
              </SelectItem>
              <SelectItem value="bubble-sort" className="flex gap-2">
                <ArrowUpDown className="size-4" aria-hidden="true" />
                Bubble Sort
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={playback.mode}
            onValueChange={(value) => {
              if (predictContinueTimerRef.current) {
                clearTimeout(predictContinueTimerRef.current)
                predictContinueTimerRef.current = null
              }

              setPredictAnswered(false)
              setPredictOverlayResult(null)
              setPredictOverlayMessage(null)

              if (value === "build") {
                const seed = `${algorithm}:${inputConfig.array.join(",")}:${inputConfig.target}:build`
                setBuildMode(initializeBuildMode(algorithm, seed))
              } else {
                setBuildMode({ userOrder: [], result: null, isRunning: false })
              }

              setPlayback((prev) => ({
                ...prev,
                mode: value as PlaybackState["mode"],
                currentStep: 0,
                isPlaying: value === "predict",
              }))
            }}
          >
            <SelectTrigger className="dsa-page__select-trigger">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="watch" className="flex gap-2">
                <Eye className="size-4" aria-hidden="true" />
                Watch
              </SelectItem>
              <SelectItem value="predict" className="flex gap-2">
                <Brain className="size-4" aria-hidden="true" />
                Predict
              </SelectItem>
              <SelectItem value="build" className="flex gap-2">
                <GripVertical className="size-4" aria-hidden="true" />
                Build
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleReplay}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
          <Button onClick={() => setStep(playback.currentStep - 1)}>
            <SkipBack className="size-4" aria-hidden="true" />
            Back
          </Button>
          <Button
            onClick={() => setPlayback((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
            disabled={playback.mode === "predict"}
          >
            {playback.isPlaying ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {playback.isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={() => setStep(playback.currentStep + 1)} disabled={!isQuestionAnswered}>
            <SkipForward className="size-4" aria-hidden="true" />
            Next
          </Button>
          <Button onClick={() => setStep(maxStepIndex)}>
            <ChevronsRight className="size-4" aria-hidden="true" />
            End
          </Button>
          <Select
            value={String(playback.speedMs)}
            onValueChange={(value) =>
              setPlayback((prev) => ({
                ...prev,
                speedMs: Number(value),
              }))
            }
          >
            <SelectTrigger className="dsa-page__select-trigger dsa-page__select-trigger--speed">
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1200">
                <Gauge className="size-4" aria-hidden="true" />
                Slow
              </SelectItem>
              <SelectItem value="900">
                <Gauge className="size-4" aria-hidden="true" />
                Normal
              </SelectItem>
              <SelectItem value="600">
                <Gauge className="size-4" aria-hidden="true" />
                Fast
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="dsa-page__content">
        <div className="dsa-page__left">
          <div
            className={`dsa-card dsa-card--visualizer ${predictOverlayResult ? `dsa-card--predict-${predictOverlayResult}` : ""
              }`}
          >
            <div className={`dsa-array-canvas ${isBinaryMode ? "dsa-array-canvas--binary" : ""}`}>
              <div className={`dsa-array ${isBinaryMode ? "dsa-array--binary" : ""}`}>
                {currentStep.snapshot.array.map((value, index) => {
                  const binarySnapshot = currentStep.snapshot as BinarySearchSnapshot
                  const bubbleSnapshot = currentStep.snapshot as BubbleSortSnapshot

                  const isFound = isBinaryMode && binarySnapshot.foundIndex === index
                  const isMid = isBinaryMode && binarySnapshot.mid === index
                  const isLow = isBinaryMode && binarySnapshot.low === index
                  const isHigh = isBinaryMode && binarySnapshot.high === index
                  const inWindow =
                    isBinaryMode && index >= binarySnapshot.low && index <= binarySnapshot.high

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
                          onClick={() => submitPredictAnswer(index)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>

                    {predictOverlayMessage && (
                      <p className="dsa-predict-overlay__feedback">{predictOverlayMessage}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="dsa-card dsa-card--code">
            <div className="dsa-code-shell__header">
              <div className="dsa-code-shell__dots" aria-hidden>
                <span className="dsa-code-shell__dot dsa-code-shell__dot--red" />
                <span className="dsa-code-shell__dot dsa-code-shell__dot--yellow" />
                <span className="dsa-code-shell__dot dsa-code-shell__dot--green" />
              </div>
              <h3 className="dsa-code-shell__title">Reference Code</h3>
            </div>

            <div className="dsa-code-shell__body">
              <div className="dsa-code">
                {referenceCode.map((line, index) => {
                  const lineNumber = index + 1
                  const active = lineNumber === currentStep.codeLine
                  return (
                    <div key={`${line}-${index}`} className={`dsa-code__line ${active ? "dsa-code__line--active" : ""}`}>
                      <span className="dsa-code__line-number">{lineNumber}</span>
                      <span className="dsa-code__line-text">{line}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="dsa-card dsa-card--panel">
          {playback.mode === "build" ? (
            <>
              <h3 className="font-grotesk">Build Mode</h3>
              <p className="dsa-panel__description">Arrange the steps in correct order to match the algorithm logic.</p>

              <div className="dsa-panel__section">
                <h4 className="font-grotesk">Pseudocode Steps</h4>
                <div className="dsa-build-steps">
                  {orderedBuildSteps.map((step, orderPosition) => {
                    return (
                      <motion.div
                        key={step.id}
                        draggable
                        onDragStart={() => handleBuildDragStart(orderPosition)}
                        onDragEnd={handleBuildDragEnd}
                        onDragOver={handleBuildDragOver}
                        onDrop={() => handleBuildDrop(orderPosition)}
                        className={`dsa-build-step ${buildDraggedItem === orderPosition ? "dsa-build-step--dragging" : ""} ${
                          buildMode.result?.failedAtStep === orderPosition ? "dsa-build-step--error" : ""
                        }`}
                        layout
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 8 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <GripVertical className="dsa-build-step__handle" aria-hidden="true" />
                        <span className="dsa-build-step__number">{orderPosition + 1}</span>
                        <span className="dsa-build-step__text">{step.text}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <Button
                className="dsa-apply-btn"
                onClick={handleBuildRunSolution}
                disabled={buildMode.isRunning || buildMode.userOrder.length === 0}
              >
                Run My Solution
              </Button>

              {buildMode.result && (
                <motion.div
                  className={`dsa-build-result dsa-build-result--${buildMode.result.isCorrect ? "correct" : "wrong"}`}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="font-grotesk dsa-build-result__title">
                    {buildMode.result.isCorrect ? "✅ Correct" : "❌ Algorithm Failed"}
                  </h4>
                  {!buildMode.result.isCorrect && (
                    <>
                      <p className="dsa-build-result__reason">{buildMode.result.failureReason}</p>
                      {buildMode.result.failedAtStep !== undefined && (
                        <p className="dsa-build-result__step">
                          Failed at step: {buildMode.result.failedAtStep + 1}
                        </p>
                      )}
                    </>
                  )}
                  {buildMode.result.isCorrect && (
                    <p className="dsa-build-result__steps">
                      Executed {buildMode.result.executedSteps} steps successfully
                    </p>
                  )}
                </motion.div>
              )}
            </>
          ) : (
            <>
              <h3 className="font-grotesk">Current Step</h3>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {currentStep.description}
                </motion.p>
              </AnimatePresence>

              <div className="dsa-panel__section">
                <h4 className="font-grotesk">Progress</h4>
                <p>
                  Step {stepNumber} / {steps.length}
                </p>
                <div className="dsa-progress-track">
                  <motion.div
                    className="dsa-progress-fill"
                    animate={{ width: `${completionPercent}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              <div className="dsa-panel__section">
                <h4 className="font-grotesk">Result</h4>
                <p>{resultLabel}</p>
                <p>Predict XP: +{predictXp}</p>
              </div>

              <div className="dsa-panel__section">
                <h4 className="font-grotesk">Custom Input</h4>
                <label className="dsa-input-label font-grotesk">
                  Array{algorithm === "binary-search" ? " (ascending)" : ""}
                </label>
                <Input
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  placeholder={algorithm === "binary-search" ? "2, 5, 8, 12, 16" : "64, 34, 25, 12"}
                />

                {algorithm === "binary-search" && (
                  <>
                    <label className="dsa-input-label font-grotesk">Target</label>
                    <Input
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      placeholder="23"
                    />
                  </>
                )}

                {inputError && <p className="dsa-input-error">{inputError}</p>}

                <Button className="dsa-apply-btn" onClick={applyCustomInput}>
                  Apply & Re-run
                </Button>
              </div>

              <div className="dsa-panel__section">
                <h4 className="font-grotesk">Complexity</h4>
                <p>Best: {complexity.timeBest}</p>
                <p>Average: {complexity.timeAverage}</p>
                <p>Worst: {complexity.timeWorst}</p>
                <p>Space: {complexity.space}</p>
                {complexity.note && <p>{complexity.note}</p>}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}