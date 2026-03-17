export type LearningMode = "watch" | "predict" | "build"
export type DSAAlgorithm = "binary-search" | "bubble-sort"

export interface StepQuestion {
  text: string
  options: string[]
  correct: number
  explanation: string
}

export interface AlgorithmStep<TType extends string, TSnapshot> {
  id: string
  algorithm: DSAAlgorithm
  type: TType
  description: string
  codeLine: number
  snapshot: TSnapshot
  question?: StepQuestion
  questionId?: string
}

export interface PlaybackState {
  currentStep: number
  isPlaying: boolean
  speedMs: number
  mode: LearningMode
}

export interface PredictQuestionOption {
  id: string
  text: string
}

export interface PredictQuestion {
  id: string
  prompt: string
  options: PredictQuestionOption[]
  correctOptionId: string
  explanation: string
  stepIndex: number
}

export interface ComplexityMeta {
  timeBest: string
  timeAverage: string
  timeWorst: string
  space: string
  note?: string
}

export type BinarySearchStepType =
  | "init"
  | "compare"
  | "move-left"
  | "move-right"
  | "found"
  | "not-found"

export interface BinarySearchSnapshot {
  array: number[]
  target: number
  low: number
  high: number
  mid: number | null
  focusIndices: number[]
  foundIndex: number | null
}

export type BinarySearchStep = AlgorithmStep<
  BinarySearchStepType,
  BinarySearchSnapshot
>

export type BubbleSortStepType =
  | "init"
  | "compare"
  | "swap"
  | "no-swap"
  | "mark-sorted"
  | "complete"

export interface BubbleSortSnapshot {
  array: number[]
  compareIndices: number[]
  swapIndices: number[]
  sortedFrom: number
  pass: number
}

export type BubbleSortStep = AlgorithmStep<BubbleSortStepType, BubbleSortSnapshot>
export type DSAStep = BinarySearchStep | BubbleSortStep

// Build Mode Types
export interface PseudocodeBuildStep {
  id: string
  text: string
  originalIndex: number
  algorithm: DSAAlgorithm
}

export interface BuildModeResult {
  isCorrect: boolean
  userOrder: number[]
  correctOrder: number[]
  failedAtStep?: number
  failureReason?: string
  executedSteps: number
  totalSteps: number
}

export interface BuildModeState {
  userOrder: number[]
  result: BuildModeResult | null
  isRunning: boolean
}