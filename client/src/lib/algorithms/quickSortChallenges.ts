/**
 * Quick Sort — Trace questions & Solve problems
 *
 * Default array: [4, 2, 7, 1, 5, 8, 3, 6]  (QUICK_SORT_DEFAULT_ARRAY)
 *
 * Step map for this array:
 *   0  — init
 *   1  — pick-pivot  (pivot=6 at idx 7, range [0..7])
 *   2  — compare j=0, arr[0]=4 ≤ 6 → will swap
 *   3  — swap arr[0]↔arr[0]  (no-op)
 *   4  — compare j=1, arr[1]=2 ≤ 6 → will swap
 *   5  — swap arr[1]↔arr[1]  (no-op)
 *   6  — compare j=2, arr[2]=7 > 6  → no swap
 *   7  — compare j=3, arr[3]=1 ≤ 6 → will swap
 *   8  — swap arr[2]↔arr[3]  → [4,2,1,7,5,8,3,6]
 *   9  — compare j=4, arr[4]=5 ≤ 6 → will swap
 *   10 — swap arr[3]↔arr[4]  → [4,2,1,5,7,8,3,6]
 *   11 — compare j=5, arr[5]=8 > 6  → no swap
 *   12 — compare j=6, arr[6]=3 ≤ 6 → will swap
 *   13 — swap arr[4]↔arr[6]  → [4,2,1,5,3,8,7,6]
 *   14 — place-pivot → [4,2,1,5,3,6,7,8], pivot 6 at index 5
 *   15 — pick-pivot  (pivot=3 at idx 4, range [0..4])
 *   16 — compare j=0, arr[0]=4 > 3  → no swap
 *   17 — compare j=1, arr[1]=2 ≤ 3 → will swap
 *   18 — swap arr[0]↔arr[1]  → [2,4,1,5,3,...]
 *   19 — compare j=2, arr[2]=1 ≤ 3 → will swap
 *   20 — swap arr[1]↔arr[2]  → [2,1,4,5,3,...]
 *   21 — compare j=3, arr[3]=5 > 3  → no swap
 *   22 — place-pivot → [2,1,3,5,4,6,7,8], pivot 3 at index 2
 *   ...
 */

import type { TraceQuestion, SolveProblem } from "./binarySearchChallenges"

export const QUICK_SORT_TRACE_QUESTIONS: TraceQuestion[] = [
  {
    id: "qs-trace-1",
    pauseAfterStep: 0,
    text: "Quick Sort begins on [4, 2, 7, 1, 5, 8, 3, 6]. Which element becomes the first pivot?",
    options: [
      "6 at index 7 — Lomuto always picks the last element",
      "4 at index 0 — the first element",
      "The median value (~4.5)",
      "The smallest element, 1",
    ],
    correct: 0,
    explanation: "Lomuto partition picks arr[high] — the last element of the current range. For the full array [0..7], that's arr[7] = 6.",
    xp: 25,
  },
  {
    id: "qs-trace-2",
    pauseAfterStep: 6,
    text: "arr[2] = 7 is greater than pivot 6. What happens to 7 during this partition?",
    options: [
      "It stays in place and ends up to the right of where pivot 6 will land",
      "It gets swapped into the left (≤ pivot) zone immediately",
      "It becomes the new pivot for the next recursive call",
      "It is removed and re-inserted after sorting",
    ],
    correct: 0,
    explanation: "7 > 6 so we skip it — boundary i does not advance and no swap happens. After the partition, 7 will be somewhere in the right sub-array (indices > pivotPos).",
    xp: 25,
  },
  {
    id: "qs-trace-3",
    pauseAfterStep: 14,
    text: "Pivot 6 is placed at index 5. Array is now [4, 2, 1, 5, 3, 6, 7, 8]. What is guaranteed?",
    options: [
      "6 is in its final sorted position — Quick Sort now recurses on [0..4] and [6..7]",
      "The entire array is sorted because 6 split it perfectly",
      "6 will be compared again in the next sub-array pass",
      "Quick Sort scans the full array again to verify placement",
    ],
    correct: 0,
    explanation: "Once partition() places a pivot, it is done — it will never move again. The algorithm recurses only on the left sub-array [0..4] and right sub-array [6..7], ignoring index 5 forever.",
    xp: 25,
  },
  {
    id: "qs-trace-4",
    pauseAfterStep: 22,
    text: "Pivot 3 is placed at index 2. Array: [2, 1, 3, 5, 4, 6, 7, 8]. How many elements are now confirmed in their final sorted positions?",
    options: [
      "2 — only the two placed pivots: 6 (index 5) and 3 (index 2)",
      "3 — also including 2 at index 0",
      "1 — only the most recently placed pivot",
      "5 — everything left of pivot 3 is fully sorted",
    ],
    correct: 0,
    explanation: "Each partition() call confirms exactly one pivot. Two partitions have completed (pivot 6 at index 5, pivot 3 at index 2) — so 2 elements are in their final positions. Elements in the sub-arrays are on the correct side but their internal order isn't sorted yet.",
    xp: 25,
  },
]

export const QUICK_SORT_SOLVE_PROBLEMS: SolveProblem[] = [
  {
    id: "qs-solve-1",
    array: [5, 2, 8, 1, 4],
    target: 0,
    question: "Partition [5, 2, 8, 1, 4] using 4 (last element) as pivot. What is the array after partition and where does the pivot land?",
    options: [
      "[2, 1, 4, 5, 8] — pivot at index 2",
      "[1, 2, 4, 5, 8] — pivot at index 2",
      "[2, 1, 5, 4, 8] — pivot at index 3",
      "[1, 2, 3, 4, 5] — pivot at index 4",
    ],
    correct: 0,
    explanation: "i=-1. j=0: 5>4 skip. j=1: 2≤4, i=0, swap arr[0]↔arr[1]→[2,5,8,1,4]. j=2: 8>4 skip. j=3: 1≤4, i=1, swap arr[1]↔arr[3]→[2,1,8,5,4]. Place pivot: swap arr[2]↔arr[4]→[2,1,4,5,8]. Pivot lands at index 2.",
    xp: 30,
  },
  {
    id: "qs-solve-2",
    array: [10, 7, 8, 9, 1, 5],
    target: 0,
    question: "What is the worst-case time complexity of Quick Sort and when does it occur?",
    options: [
      "O(n²) — when the pivot is always the smallest or largest element",
      "O(n log n) — it is always this fast",
      "O(n) — when the array is already sorted",
      "O(n²) — only when there are duplicate elements",
    ],
    correct: 0,
    explanation: "When the pivot is always the min or max (e.g. on an already-sorted array with Lomuto), each partition produces one sub-array of size n−1 and an empty one. This gives O(n) recursive levels × O(n) work each = O(n²) total.",
    xp: 30,
  },
  {
    id: "qs-solve-3",
    array: [3, 6, 8, 10, 1, 2, 1],
    target: 0,
    question: "After the very first partition call on any array, how many elements are guaranteed to be in their final sorted position?",
    options: [
      "Exactly 1 — the pivot placed at its final index",
      "All elements to the left of the pivot",
      "All elements to the right of the pivot",
      "None — partitioning only groups elements, it doesn't place any",
    ],
    correct: 0,
    explanation: "Each call to partition() places exactly one element — the pivot — at its correct final index. Elements left of it are ≤ pivot and elements right of it are > pivot, but their internal order within each side is not yet sorted.",
    xp: 30,
  },
]

export const TRACE_TOTAL_XP = QUICK_SORT_TRACE_QUESTIONS.reduce((s, q) => s + q.xp, 0)
export const SOLVE_TOTAL_XP = QUICK_SORT_SOLVE_PROBLEMS.reduce((s, p) => s + p.xp, 0)
export const LEVEL_TOTAL_XP = TRACE_TOTAL_XP + SOLVE_TOTAL_XP
