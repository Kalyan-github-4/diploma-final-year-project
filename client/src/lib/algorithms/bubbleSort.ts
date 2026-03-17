import type {
  BubbleSortStep,
  BubbleSortSnapshot,
  ComplexityMeta,
  StepQuestion,
} from "@/types/dsa.types"

interface GenerateBubbleSortStepsInput {
  array: number[]
}

interface GenerateBubbleSortStepsResult {
  steps: BubbleSortStep[]
  resultArray: number[]
}

export const BUBBLE_SORT_COMPLEXITY: ComplexityMeta = {
  timeBest: "O(n)",
  timeAverage: "O(n²)",
  timeWorst: "O(n²)",
  space: "O(1)",
  note: "Best case is when array is already sorted and we early-exit.",
}

export const BUBBLE_SORT_REFERENCE_CODE = [
  "for (let i = 0; i < arr.length - 1; i++) {",
  "  let swapped = false",
  "  for (let j = 0; j < arr.length - 1 - i; j++) {",
  "    if (arr[j] > arr[j + 1]) {",
  "      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]",
  "      swapped = true",
  "    }",
  "  }",
  "  if (!swapped) break",
  "}",
]

function createSnapshot(
  array: number[],
  compareIndices: number[],
  swapIndices: number[],
  sortedFrom: number,
  pass: number
): BubbleSortSnapshot {
  return {
    array: [...array],
    compareIndices,
    swapIndices,
    sortedFrom,
    pass,
  }
}

export function generateBubbleSortSteps({
  array,
}: GenerateBubbleSortStepsInput): GenerateBubbleSortStepsResult {
  const values = [...array]
  const steps: BubbleSortStep[] = []

  const pushStep = (
    type: BubbleSortStep["type"],
    description: string,
    codeLine: number,
    compareIndices: number[],
    swapIndices: number[],
    sortedFrom: number,
    pass: number,
    question?: StepQuestion
  ) => {
    steps.push({
      id: `bubble-sort-step-${steps.length + 1}`,
      algorithm: "bubble-sort",
      type,
      description,
      codeLine,
      snapshot: createSnapshot(values, compareIndices, swapIndices, sortedFrom, pass),
      question,
    })
  }

  pushStep("init", "Start Bubble Sort from left to right.", 1, [], [], values.length, 0)

  for (let i = 0; i < values.length - 1; i += 1) {
    let swapped = false

    for (let j = 0; j < values.length - 1 - i; j += 1) {
      const compareQuestion: StepQuestion = {
        text: `Compare ${values[j]} and ${values[j + 1]}. What happens next?`,
        options: [
          "Swap the two elements",
          "Keep them in place",
          "Return sorted array",
          "Restart this pass",
        ],
        correct: values[j] > values[j + 1] ? 0 : 1,
        explanation:
          values[j] > values[j + 1]
            ? "Left value is greater than right value, so Bubble Sort swaps them."
            : "Left value is already <= right value, so no swap is needed.",
      }

      pushStep(
        "compare",
        `Compare arr[${j}] = ${values[j]} and arr[${j + 1}] = ${values[j + 1]}`,
        4,
        [j, j + 1],
        [],
        values.length - i,
        i + 1,
        compareQuestion
      )

      if (values[j] > values[j + 1]) {
        ;[values[j], values[j + 1]] = [values[j + 1], values[j]]
        swapped = true

        pushStep(
          "swap",
          `Swap ${values[j + 1]} and ${values[j]} because left is greater than right.`,
          5,
          [j, j + 1],
          [j, j + 1],
          values.length - i,
          i + 1
        )
      } else {
        pushStep(
          "no-swap",
          `No swap needed. ${values[j]} <= ${values[j + 1]}`,
          4,
          [j, j + 1],
          [],
          values.length - i,
          i + 1
        )
      }
    }

    pushStep(
      "mark-sorted",
      `Pass ${i + 1} complete. Largest unsorted element settled at index ${values.length - 1 - i}.`,
      1,
      [],
      [],
      values.length - 1 - i,
      i + 1
    )

    if (!swapped) {
      pushStep("complete", "Array is already sorted. Stop early.", 9, [], [], 0, i + 1)
      return {
        steps,
        resultArray: values,
      }
    }
  }

  pushStep("complete", "Bubble Sort complete. Array is fully sorted.", 10, [], [], 0, values.length)

  return {
    steps,
    resultArray: values,
  }
}