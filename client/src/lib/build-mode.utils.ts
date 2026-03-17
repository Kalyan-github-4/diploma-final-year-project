import type { BuildModeResult, BuildModeState, DSAAlgorithm, PseudocodeBuildStep } from "@/types/dsa.types"

// Binary Search Pseudocode Steps
export const BINARY_SEARCH_PSEUDOCODE: PseudocodeBuildStep[] = [
  {
    id: "bs-1",
    text: "Initialize: low = 0, high = arr.length - 1",
    originalIndex: 0,
    algorithm: "binary-search",
  },
  {
    id: "bs-2",
    text: "Loop while low <= high",
    originalIndex: 1,
    algorithm: "binary-search",
  },
  {
    id: "bs-3",
    text: "Calculate mid = Math.floor((low + high) / 2)",
    originalIndex: 2,
    algorithm: "binary-search",
  },
  {
    id: "bs-4",
    text: "If arr[mid] === target, return mid (found!)",
    originalIndex: 3,
    algorithm: "binary-search",
  },
  {
    id: "bs-5",
    text: "If arr[mid] < target, move low = mid + 1",
    originalIndex: 4,
    algorithm: "binary-search",
  },
  {
    id: "bs-6",
    text: "If arr[mid] > target, move high = mid - 1",
    originalIndex: 5,
    algorithm: "binary-search",
  },
  {
    id: "bs-7",
    text: "Return -1 (target not found)",
    originalIndex: 6,
    algorithm: "binary-search",
  },
]

// Bubble Sort Pseudocode Steps
export const BUBBLE_SORT_PSEUDOCODE: PseudocodeBuildStep[] = [
  {
    id: "bs-1",
    text: "Start outer loop through each pass",
    originalIndex: 0,
    algorithm: "bubble-sort",
  },
  {
    id: "bs-2",
    text: "In each pass, compare adjacent pairs from start to unsorted end",
    originalIndex: 1,
    algorithm: "bubble-sort",
  },
  {
    id: "bs-3",
    text: "If left element > right element, swap them",
    originalIndex: 2,
    algorithm: "bubble-sort",
  },
  {
    id: "bs-4",
    text: "Repeat comparison loop until array is sorted",
    originalIndex: 3,
    algorithm: "bubble-sort",
  },
  {
    id: "bs-5",
    text: "Mark sorted elements at the end of each pass",
    originalIndex: 4,
    algorithm: "bubble-sort",
  },
]

export function getPseudocodeSteps(algorithm: DSAAlgorithm): PseudocodeBuildStep[] {
  return algorithm === "binary-search" ? BINARY_SEARCH_PSEUDOCODE : BUBBLE_SORT_PSEUDOCODE
}

export function shuffleSteps(steps: PseudocodeBuildStep[], seed: string): PseudocodeBuildStep[] {
  const shuffled = [...steps]

  // Deterministic shuffle using seed
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }

  const rng = (index: number): number => {
    const x = Math.sin(hash + index) * 10000
    return x - Math.floor(x)
  }

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng(i) * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }

  return shuffled
}

export function initializeBuildMode(algorithm: DSAAlgorithm, seed: string): BuildModeState {
  const steps = getPseudocodeSteps(algorithm)
  const shuffled = shuffleSteps(steps, seed)

  return {
    userOrder: shuffled.map((step) => step.originalIndex),
    result: null,
    isRunning: false,
  }
}

/**
 * Validates if the user's ordering of pseudocode steps produces a correct algorithm.
 * This function simulates executing the algorithm with the reordered steps.
 */
export function validateBuildModeSolution(
  userOrder: number[],
  algorithm: DSAAlgorithm,
  array: number[],
  target: number
): BuildModeResult {
  const steps = getPseudocodeSteps(algorithm)
  const correctOrder = steps.map((_, i) => i)

  // Check if order is correct
  const isCorrect = userOrder.every((val, idx) => val === correctOrder[idx])

  if (isCorrect) {
    return {
      isCorrect: true,
      userOrder,
      correctOrder,
      executedSteps: steps.length,
      totalSteps: steps.length,
    }
  }

  // Find where the algorithm broke
  let failureReason = "Algorithm logic violation"
  let failedAtStep = -1

  if (algorithm === "binary-search") {
    // Simulate Binary Search execution with user's order
    const sortedArray = [...array].sort((a, b) => a - b)
    let low = 0
    let high = sortedArray.length - 1
    let found = false
    const stepsExecuted: string[] = []

    // Try to execute algorithm in user's order
    for (let stepIndex = 0; stepIndex < userOrder.length && stepIndex < 100; stepIndex += 1) {
      const correctStepIndex = userOrder[stepIndex]
      const stepText = steps[correctStepIndex]?.text || ""

      if (
        stepText.includes("low = 0") ||
        stepText.includes("Initialize")
      ) {
        low = 0
        high = sortedArray.length - 1
        stepsExecuted.push("init")
      } else if (stepText.includes("low <= high")) {
        if (!(low <= high)) {
          failedAtStep = stepIndex
          failureReason =
            "Loop condition failed - search range exhausted. Check if initialization is correct."
          break
        }
        stepsExecuted.push("loop-check")
      } else if (
        stepText.includes("Calculate mid") ||
        stepText.includes("mid =")
      ) {
        if (low > high) {
          failedAtStep = stepIndex
          failureReason = "Cannot calculate mid when low > high. Check your loop condition."
          break
        }
        stepsExecuted.push("calculate-mid")
      } else if (
        stepText.includes("arr[mid] === target") ||
        stepText.includes("found")
      ) {
        const mid = Math.floor((low + high) / 2)
        if (sortedArray[mid] === target) {
          found = true
          stepsExecuted.push("check-equal")
        } else {
          stepsExecuted.push("check-equal")
        }
      } else if (
        stepText.includes("arr[mid] < target") ||
        stepText.includes("move low")
      ) {
        const mid = Math.floor((low + high) / 2)
        if (sortedArray[mid] < target) {
          low = mid + 1
          stepsExecuted.push("move-low")
        } else {
          stepsExecuted.push("check-low")
        }
      } else if (
        stepText.includes("arr[mid] > target") ||
        stepText.includes("move high")
      ) {
        const mid = Math.floor((low + high) / 2)
        if (sortedArray[mid] > target) {
          high = mid - 1
          stepsExecuted.push("move-high")
        } else {
          stepsExecuted.push("check-high")
        }
      } else if (stepText.includes("return")) {
        if (!found) {
          stepsExecuted.push("return")
          failedAtStep = stepIndex
          failureReason =
            "Premature return before finding element or exhausting search. Check loop condition."
          break
        }
      }
    }

    if (failedAtStep === -1) {
      failureReason = "Algorithm did not reach a valid conclusion."
    }
  } else if (algorithm === "bubble-sort") {
    // Simulate Bubble Sort execution
    const arr = [...array]
    let swapped = true
    let passCount = 0
    const maxPasses = arr.length

    for (let passIndex = 0; passIndex < userOrder.length && passCount < maxPasses; passIndex++) {
      const correctStepIndex = userOrder[passIndex]
      const stepText = steps[correctStepIndex]?.text || ""

      if (stepText.includes("outer loop")) {
        continue
      } else if (stepText.includes("compare") || stepText.includes("adjacent")) {
        for (let i = 0; i < arr.length - 1 - passCount; i++) {
          if (arr[i] > arr[i + 1]) {
            swapped = true
          }
        }
      } else if (stepText.includes("swap")) {
        for (let i = 0; i < arr.length - 1 - passCount; i++) {
          if (arr[i] > arr[i + 1]) {
            const temp = arr[i]
            arr[i] = arr[i + 1]
            arr[i + 1] = temp
          }
        }
        passCount++
      } else if (stepText.includes("Mark sorted")) {
        // Marking sorted elements is a tracking step
        continue
      } else if (stepText.includes("repeat") || stepText.includes("Repeat")) {
        if (!swapped) {
          passCount = maxPasses // Exit early
          break
        }
        swapped = false
        passCount++
      }
    }

    // Check if array is sorted
    let isSorted = true
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        isSorted = false
        failedAtStep = Math.floor(passCount / 2) || 1
        failureReason = "Array is not properly sorted. Check your swap and comparison logic."
        break
      }
    }

    if (isSorted && failedAtStep === -1) {
      return {
        isCorrect: true,
        userOrder,
        correctOrder,
        executedSteps: passCount * (array.length - 1),
        totalSteps: array.length * (array.length - 1),
      }
    }
  }

  return {
    isCorrect: false,
    userOrder,
    correctOrder,
    failedAtStep: failedAtStep >= 0 ? failedAtStep : undefined,
    failureReason: failureReason || "Algorithm execution failed.",
    executedSteps: failedAtStep >= 0 ? failedAtStep : steps.length,
    totalSteps: steps.length,
  }
}
