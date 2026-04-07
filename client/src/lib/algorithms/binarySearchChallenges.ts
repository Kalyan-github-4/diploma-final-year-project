/**
 * Binary Search — Trace questions & Solve problems
 *
 * Trace: user steps through the visualizer, answers questions at key moments (20 XP each)
 * Solve: fresh inputs, no visualizer help, mental execution (30 XP each)
 */

export interface TraceQuestion {
  id: string
  /** The step index (0-based) at which to pause and ask */
  pauseAfterStep: number
  text: string
  options: string[]
  correct: number
  explanation: string
  xp: number
}

export interface SolveProblem {
  id: string
  array: number[]
  target: number
  question: string
  options: string[]
  correct: number
  explanation: string
  xp: number
}

// ── Trace questions for default array [2, 5, 8, 12, 16, 23, 38], target 23 ──

// Steps for [2, 5, 8, 12, 16, 23, 38] target 23:
//   0: init (low=0, high=6)
//   1: compare arr[3]=12 vs 23
//   2: move-right (low=4)
//   3: compare arr[5]=23 vs 23
//   4: found at index 5

export const BINARY_SEARCH_TRACE_QUESTIONS: TraceQuestion[] = [
  {
    id: "trace-1",
    pauseAfterStep: 0,
    text: "We initialized low=0 and high=6. What index will mid be on the first iteration?",
    options: ["Index 2", "Index 3", "Index 4", "Index 6"],
    correct: 1,
    explanation: "mid = Math.floor((0 + 6) / 2) = 3. The middle element is at index 3.",
    xp: 25,
  },
  {
    id: "trace-2",
    pauseAfterStep: 1,
    text: "arr[3] = 12 and target = 23. Which half of the array do we search next?",
    options: [
      "Left half (indices 0–2)",
      "Right half (indices 4–6)",
      "We found the target",
      "The target doesn't exist",
    ],
    correct: 1,
    explanation: "23 > 12, so the target must be in the right half. We set low = mid + 1 = 4.",
    xp: 25,
  },
  {
    id: "trace-3",
    pauseAfterStep: 2,
    text: "Now low=4, high=6. What is the new mid index and value?",
    options: [
      "mid=4, value=16",
      "mid=5, value=23",
      "mid=6, value=38",
      "mid=4, value=23",
    ],
    correct: 1,
    explanation: "mid = Math.floor((4 + 6) / 2) = 5. arr[5] = 23.",
    xp: 25,
  },
  {
    id: "trace-4",
    pauseAfterStep: 3,
    text: "arr[5] = 23 matches our target. What does the algorithm return?",
    options: [
      "Set high = mid - 1 and continue",
      "Set low = mid + 1 and continue",
      "Return index 5 — target found",
      "Return -1 — not found",
    ],
    correct: 2,
    explanation: "arr[mid] === target, so binary search returns index 5. Only 2 comparisons needed for a 7-element array!",
    xp: 25,
  },
]

// ── Solve problems (fresh inputs, no visualizer) ──

export const BINARY_SEARCH_SOLVE_PROBLEMS: SolveProblem[] = [
  {
    id: "solve-1",
    array: [3, 7, 11, 15, 19, 23, 27, 31],
    target: 19,
    question: "How many comparisons does binary search need to find 19 in [3, 7, 11, 15, 19, 23, 27, 31]?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    explanation: "Step 1: mid=3 → arr[3]=15, 19>15 → search right. Step 2: mid=5 → arr[5]=23, 19<23 → search left. Step 3: mid=4 → arr[4]=19 → found! That's 3 comparisons. Wait — let me recount. mid = floor((0+7)/2) = 3, arr[3]=15 < 19 → low=4. mid = floor((4+7)/2) = 5, arr[5]=23 > 19 → high=4. mid = floor((4+4)/2) = 4, arr[4]=19 = 19 → found. That's 3 comparisons.",
    xp: 30,
  },
  {
    id: "solve-2",
    array: [1, 4, 9, 16, 25, 36, 49],
    target: 50,
    question: "What does binary search return for target 50 in [1, 4, 9, 16, 25, 36, 49]?",
    options: ["Index 6", "Index 5", "-1 (not found)", "Index 7"],
    correct: 2,
    explanation: "50 is not in the array. Binary search will exhaust all possibilities (low > high) and return -1.",
    xp: 30,
  },
  {
    id: "solve-3",
    array: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    target: 30,
    question: "Binary search for 30 in a 10-element sorted array [10, 20, ..., 100]. What's the first mid value checked?",
    options: ["50 (index 4)", "60 (index 5)", "30 (index 2)", "40 (index 3)"],
    correct: 0,
    explanation: "mid = floor((0 + 9) / 2) = 4. arr[4] = 50. The first value compared is always the middle element.",
    xp: 30,
  },
]

// Fix solve-1 explanation and correct answer
BINARY_SEARCH_SOLVE_PROBLEMS[0] = {
  ...BINARY_SEARCH_SOLVE_PROBLEMS[0],
  correct: 2,
  explanation: "mid=3 → 15<19 → low=4. mid=5 → 23>19 → high=4. mid=4 → 19=19 → found. That's 3 comparisons.",
}

export const TRACE_TOTAL_XP = BINARY_SEARCH_TRACE_QUESTIONS.reduce((s, q) => s + q.xp, 0)
export const SOLVE_TOTAL_XP = BINARY_SEARCH_SOLVE_PROBLEMS.reduce((s, p) => s + p.xp, 0)
export const CODE_XP = 50
export const LEVEL_TOTAL_XP = TRACE_TOTAL_XP + SOLVE_TOTAL_XP + CODE_XP
