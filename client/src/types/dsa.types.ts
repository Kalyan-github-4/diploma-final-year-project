export type LearningMode = "watch" | "predict" | "build"
export type DSAAlgorithm = "binary-search" | "bubble-sort" | "bfs" | "stack" | "queue" | "dijkstra" | "quick-sort"

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
  checkedIndices: number[]
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
export type BFSStepType =
  | "init"
  | "enqueue"
  | "dequeue"
  | "visit-neighbor"
  | "skip-visited"
  | "complete"

export interface BFSSnapshot {
  nodes: string[]
  edges: [string, string][]
  visited: string[]
  queue: string[]
  currentNode: string | null
  discoveredFrom: Record<string, string | null>
}

export type BFSStep = AlgorithmStep<BFSStepType, BFSSnapshot>

export type StackStepType = "init" | "push" | "pop" | "peek" | "complete"

export interface StackSnapshot {
  items: number[]
  topIndex: number | null
  lastOp: "push" | "pop" | "peek" | null
  lastValue: number | null
}

export type StackStep = AlgorithmStep<StackStepType, StackSnapshot>

export type QueueStepType = "init" | "enqueue" | "dequeue" | "peek" | "complete"

export interface QueueSnapshot {
  items: number[]
  frontIndex: number | null
  rearIndex: number | null
  lastOp: "enqueue" | "dequeue" | "peek" | null
  lastValue: number | null
}

export type QueueStep = AlgorithmStep<QueueStepType, QueueSnapshot>

export type DijkstraStepType = "init" | "select-min" | "relax" | "no-relax" | "skip-visited" | "complete"

export interface DijkstraSnapshot {
  nodes: string[]
  edges: [string, string, number][]
  visited: string[]
  currentNode: string | null
  distances: Record<string, number>
  previous: Record<string, string | null>
  queue: string[]
}

export type DijkstraStep = AlgorithmStep<DijkstraStepType, DijkstraSnapshot>

export type QuickSortStepType =
  | "init"
  | "pick-pivot"
  | "compare"
  | "swap"
  | "place-pivot"
  | "complete"

export interface QuickSortSnapshot {
  array: number[]
  pivotIndex: number | null
  compareIndex: number | null
  boundaryIndex: number | null
  sortedIndices: number[]
  activeRange: [number, number] | null
}

export type QuickSortStep = AlgorithmStep<QuickSortStepType, QuickSortSnapshot>

export type DSAStep = BinarySearchStep | BubbleSortStep | BFSStep | StackStep | QueueStep | DijkstraStep | QuickSortStep

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