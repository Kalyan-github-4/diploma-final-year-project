/**
 * Queue — Trace questions & Solve problems
 *
 * Default ops: enqueue(5), enqueue(3), enqueue(8), enqueue(1), dequeue(), dequeue(), enqueue(6), dequeue()
 */

import type { TraceQuestion, SolveProblem } from "./binarySearchChallenges"

// Steps overview:
//   0: init (empty queue)
//   1: enqueue(5) → [5]
//   2: enqueue(3) → [5, 3]
//   3: enqueue(8) → [5, 3, 8]
//   4: enqueue(1) → [5, 3, 8, 1]
//   5: dequeue() → removes 5 → [3, 8, 1]
//   6: dequeue() → removes 3 → [8, 1]
//   7: enqueue(6) → [8, 1, 6]
//   8: dequeue() → removes 8 → [1, 6]
//   9: complete

export const QUEUE_TRACE_QUESTIONS: TraceQuestion[] = [
  {
    id: "queue-trace-1",
    pauseAfterStep: 0,
    text: "A queue follows which access pattern?",
    options: [
      "FIFO — First In, First Out",
      "LIFO — Last In, First Out",
      "Random access by index",
      "Priority-based access",
    ],
    correct: 0,
    explanation: "A queue is FIFO — the first element enqueued is the first one dequeued. Think of a line at a store.",
    xp: 25,
  },
  {
    id: "queue-trace-2",
    pauseAfterStep: 4,
    text: "We enqueued 5, 3, 8, 1. Which element is at the front of the queue?",
    options: ["5", "1", "3", "8"],
    correct: 0,
    explanation: "5 was enqueued first, so it's at the front. FIFO means the first item in will be the first item out.",
    xp: 25,
  },
  {
    id: "queue-trace-3",
    pauseAfterStep: 5,
    text: "dequeue() was called and removed 5. What is now at the front?",
    options: ["3", "8", "1", "The queue is empty"],
    correct: 0,
    explanation: "After removing 5, the queue is [3, 8, 1]. The element enqueued right after 5 — which is 3 — is now at the front.",
    xp: 25,
  },
  {
    id: "queue-trace-4",
    pauseAfterStep: 7,
    text: "After two dequeues and enqueue(6), the queue is [8, 1, 6]. Where is 6 positioned?",
    options: [
      "At the rear (back) — new items always go to the end",
      "At the front — new items are prioritized",
      "In the middle",
      "It replaces the front element",
    ],
    correct: 0,
    explanation: "enqueue always adds to the rear. The queue is [8, 1, 6] — 8 is at front, 6 is at rear.",
    xp: 25,
  },
]

export const QUEUE_SOLVE_PROBLEMS: SolveProblem[] = [
  {
    id: "queue-solve-1",
    array: [],
    target: 0,
    question: "Operations: enqueue(A), enqueue(B), dequeue(), enqueue(C), dequeue(), dequeue(). What order are elements removed?",
    options: ["A, B, C", "C, B, A", "B, A, C", "A, C, B"],
    correct: 0,
    explanation: "enqueue A→[A], enqueue B→[A,B], dequeue→A out [B], enqueue C→[B,C], dequeue→B out [C], dequeue→C out []. Removed: A, B, C.",
    xp: 30,
  },
  {
    id: "queue-solve-2",
    array: [],
    target: 0,
    question: "Which real-world scenario is best modeled by a queue?",
    options: [
      "A print spooler processing jobs in order received",
      "An undo button in a text editor",
      "A recursive function call stack",
      "A sorted list of high scores",
    ],
    correct: 0,
    explanation: "Print spoolers process jobs in FIFO order — the first document sent prints first. Undo uses a stack (LIFO).",
    xp: 30,
  },
  {
    id: "queue-solve-3",
    array: [],
    target: 0,
    question: "How does a queue differ from a stack when both contain elements [1, 2, 3] (1 added first)?",
    options: [
      "Queue removes 1 first; stack removes 3 first",
      "Queue removes 3 first; stack removes 1 first",
      "Both remove 1 first",
      "Both remove 3 first",
    ],
    correct: 0,
    explanation: "Queue (FIFO) removes the oldest element (1) first. Stack (LIFO) removes the newest element (3) first.",
    xp: 30,
  },
]

export const TRACE_TOTAL_XP = QUEUE_TRACE_QUESTIONS.reduce((s, q) => s + q.xp, 0)
export const SOLVE_TOTAL_XP = QUEUE_SOLVE_PROBLEMS.reduce((s, p) => s + p.xp, 0)
export const LEVEL_TOTAL_XP = TRACE_TOTAL_XP + SOLVE_TOTAL_XP
