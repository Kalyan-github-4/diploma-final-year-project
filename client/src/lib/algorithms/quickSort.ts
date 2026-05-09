import type {
  QuickSortStep,
  QuickSortSnapshot,
  ComplexityMeta,
  StepQuestion,
} from "@/types/dsa.types"

interface GenerateQuickSortStepsInput {
  array: number[]
}

interface GenerateQuickSortStepsResult {
  steps: QuickSortStep[]
  resultArray: number[]
}

/** Default array used in QuickSortLevel and challenges — keep in sync */
export const QUICK_SORT_DEFAULT_ARRAY = [4, 2, 7, 1, 5, 8, 3, 6]

export const QUICK_SORT_COMPLEXITY: ComplexityMeta = {
  timeBest: "O(n log n)",
  timeAverage: "O(n log n)",
  timeWorst: "O(n²)",
  space: "O(log n)",
  note: "Worst case occurs when the pivot is always the smallest or largest element (e.g. already-sorted input). Average case is fast in practice.",
}

export const QUICK_SORT_REFERENCE_CODE = [
  "function quickSort(arr, low = 0, high = arr.length - 1) {",
  "  if (low >= high) return",
  "  const pivotIdx = partition(arr, low, high)",
  "  quickSort(arr, low, pivotIdx - 1)",
  "  quickSort(arr, pivotIdx + 1, high)",
  "}",
  "function partition(arr, low, high) {",
  "  let i = low - 1",
  "  for (let j = low; j < high; j++) {",
  "    if (arr[j] <= arr[high]) {",
  "      i++",
  "      ;[arr[i], arr[j]] = [arr[j], arr[i]]",
  "    }",
  "  }",
  "  ;[arr[i+1], arr[high]] = [arr[high], arr[i+1]]",
  "  return i + 1",
  "}",
]

function createSnapshot(
  array: number[],
  pivotIndex: number | null,
  compareIndex: number | null,
  boundaryIndex: number | null,
  sortedIndices: number[],
  activeRange: [number, number] | null
): QuickSortSnapshot {
  return {
    array: [...array],
    pivotIndex,
    compareIndex,
    boundaryIndex,
    sortedIndices: [...sortedIndices],
    activeRange,
  }
}

export function generateQuickSortSteps({
  array,
}: GenerateQuickSortStepsInput): GenerateQuickSortStepsResult {
  const values = [...array]
  const steps: QuickSortStep[] = []
  const sortedSet = new Set<number>()

  let stepCount = 0
  const pushStep = (
    type: QuickSortStep["type"],
    description: string,
    codeLine: number,
    pivotIndex: number | null,
    compareIndex: number | null,
    boundaryIndex: number | null,
    activeRange: [number, number] | null,
    question?: StepQuestion
  ) => {
    stepCount += 1
    steps.push({
      id: `quick-sort-step-${stepCount}`,
      algorithm: "quick-sort",
      type,
      description,
      codeLine,
      snapshot: createSnapshot(
        values,
        pivotIndex,
        compareIndex,
        boundaryIndex,
        [...sortedSet],
        activeRange
      ),
      question,
    })
  }

  pushStep(
    "init",
    "Start Quick Sort. We will recursively partition the array using the last element as pivot.",
    1,
    null,
    null,
    null,
    [0, values.length - 1]
  )

  function solve(low: number, high: number) {
    if (low > high) return
    if (low === high) {
      sortedSet.add(low)
      return
    }

    const pivotValue = values[high]

    pushStep(
      "pick-pivot",
      `Partition [${low}..${high}]. Pivot = arr[${high}] = ${pivotValue}. Boundary i starts at ${low - 1}.`,
      8,
      high,
      null,
      low - 1,
      [low, high]
    )

    let i = low - 1

    for (let j = low; j < high; j++) {
      const willSwap = values[j] <= pivotValue

      const compareQuestion: StepQuestion = {
        text: `arr[${j}] = ${values[j]} vs pivot ${pivotValue}. What happens?`,
        options: [
          `Swap arr[${j}] into the ≤pivot zone`,
          "Leave it in place — it's greater than pivot",
          "Move the pivot here",
          "End this partition",
        ],
        correct: willSwap ? 0 : 1,
        explanation: willSwap
          ? `${values[j]} ≤ ${pivotValue}: advance boundary i and swap arr[${j}] to the left side.`
          : `${values[j]} > ${pivotValue}: leave in place; it belongs to the right of the pivot.`,
      }

      pushStep(
        "compare",
        `Compare arr[${j}] = ${values[j]} with pivot ${pivotValue}. ${willSwap ? "≤ pivot — will swap into left zone." : "> pivot — stays in right zone."}`,
        10,
        high,
        j,
        i,
        [low, high],
        compareQuestion
      )

      if (willSwap) {
        i++
        ;[values[i], values[j]] = [values[j], values[i]]

        pushStep(
          "swap",
          `arr[${j}] ≤ pivot. Advance boundary to ${i} and swap arr[${i}] ↔ arr[${j}].`,
          12,
          high,
          j,
          i,
          [low, high]
        )
      }
    }

    // Place pivot in final position
    ;[values[i + 1], values[high]] = [values[high], values[i + 1]]
    const pivotPos = i + 1
    sortedSet.add(pivotPos)

    pushStep(
      "place-pivot",
      `Place pivot ${pivotValue} at index ${pivotPos}. Everything left is ≤ ${pivotValue}, everything right is > ${pivotValue}.`,
      15,
      pivotPos,
      null,
      null,
      [low, high]
    )

    solve(low, pivotPos - 1)
    solve(pivotPos + 1, high)
  }

  solve(0, values.length - 1)

  pushStep(
    "complete",
    "Quick Sort complete. Array is fully sorted.",
    1,
    null,
    null,
    null,
    null
  )

  return { steps, resultArray: values }
}
