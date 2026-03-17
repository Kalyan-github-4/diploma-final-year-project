import type {
  BinarySearchStep,
  BinarySearchSnapshot,
  ComplexityMeta,
  StepQuestion,
} from "@/types/dsa.types"

interface GenerateBinarySearchStepsInput {
  array: number[]
  target: number
}

interface GenerateBinarySearchStepsResult {
  steps: BinarySearchStep[]
  resultIndex: number
}

export const BINARY_SEARCH_COMPLEXITY: ComplexityMeta = {
  timeBest: "O(1)",
  timeAverage: "O(log n)",
  timeWorst: "O(log n)",
  space: "O(1)",
  note: "Requires sorted input array.",
}

export const BINARY_SEARCH_REFERENCE_CODE = [
  "let low = 0",
  "let high = arr.length - 1",
  "while (low <= high) {",
  "  const mid = Math.floor((low + high) / 2)",
  "  if (arr[mid] === target) return mid",
  "  if (arr[mid] < target) low = mid + 1",
  "  else high = mid - 1",
  "}",
  "return -1",
]

function createSnapshot(
  array: number[],
  target: number,
  low: number,
  high: number,
  mid: number | null,
  foundIndex: number | null
): BinarySearchSnapshot {
  const focusIndices = [low, high, mid]
    .filter((value): value is number => value !== null)
    .filter((value, index, items) => value >= 0 && value < array.length && items.indexOf(value) === index)

  return {
    array: [...array],
    target,
    low,
    high,
    mid,
    focusIndices,
    foundIndex,
  }
}

export function generateBinarySearchSteps({
  array,
  target,
}: GenerateBinarySearchStepsInput): GenerateBinarySearchStepsResult {
  const steps: BinarySearchStep[] = []
  const sortedArray = [...array]

  let low = 0
  let high = sortedArray.length - 1

  const pushStep = (
    type: BinarySearchStep["type"],
    description: string,
    codeLine: number,
    mid: number | null,
    foundIndex: number | null,
    question?: StepQuestion
  ) => {
    steps.push({
      id: `binary-search-step-${steps.length + 1}`,
      algorithm: "binary-search",
      type,
      description,
      codeLine,
      snapshot: createSnapshot(sortedArray, target, low, high, mid, foundIndex),
      question,
    })
  }

  pushStep(
    "init",
    `Initialize low=${low}, high=${high} for target ${target}`,
    1,
    null,
    null
  )

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    const compareQuestion: StepQuestion = {
      text:
        sortedArray[mid] === target
          ? `Target ${target} equals arr[mid] ${sortedArray[mid]}. What happens next?`
          : sortedArray[mid] < target
            ? `Target ${target} > arr[mid] ${sortedArray[mid]}. What happens next?`
            : `Target ${target} < arr[mid] ${sortedArray[mid]}. What happens next?`,
      options: [
        "Search left half",
        "Move low to mid + 1",
        "Return current mid index",
        "Start over",
      ],
      correct: sortedArray[mid] === target ? 2 : sortedArray[mid] < target ? 1 : 0,
      explanation:
        sortedArray[mid] === target
          ? `Since target equals arr[mid], Binary Search returns index ${mid} immediately.`
          : sortedArray[mid] < target
            ? "Since target is greater than arr[mid], the answer must be in the right half, so low = mid + 1."
            : "Since target is smaller than arr[mid], the answer must be in the left half, so high = mid - 1.",
    }

    pushStep(
      "compare",
      `Compare arr[${mid}] = ${sortedArray[mid]} with target ${target}`,
      5,
      mid,
      null,
      compareQuestion
    )

    if (sortedArray[mid] === target) {
      pushStep("found", `Target ${target} found at index ${mid}`, 5, mid, mid)
      return {
        steps,
        resultIndex: mid,
      }
    }

    if (sortedArray[mid] < target) {
      low = mid + 1
      pushStep(
        "move-right",
        `${target} is greater than ${sortedArray[mid]}, move low to ${low}`,
        6,
        mid,
        null
      )
      continue
    }

    high = mid - 1
    pushStep(
      "move-left",
      `${target} is less than ${sortedArray[mid]}, move high to ${high}`,
      7,
      mid,
      null
    )
  }

  pushStep("not-found", `Target ${target} was not found`, 9, null, null)

  return {
    steps,
    resultIndex: -1,
  }
}
