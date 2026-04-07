/**
 * Stack — Trace questions & Solve problems
 *
 * Default ops: push(5), push(3), push(8), push(1), pop(), pop(), push(6), pop()
 */

import type { TraceQuestion, SolveProblem } from "./binarySearchChallenges"

// Steps overview:
//   0: init (empty stack)
//   1: push(5) → [5]
//   2: push(3) → [5, 3]
//   3: push(8) → [5, 3, 8]
//   4: push(1) → [5, 3, 8, 1]
//   5: pop() → removes 1 → [5, 3, 8]
//   6: pop() → removes 8 → [5, 3]
//   7: push(6) → [5, 3, 6]
//   8: pop() → removes 6 → [5, 3]
//   9: complete

export const STACK_TRACE_QUESTIONS: TraceQuestion[] = [
  {
    id: "stack-trace-1",
    pauseAfterStep: 0,
    text: "A stack follows which access pattern?",
    options: [
      "LIFO — Last In, First Out",
      "FIFO — First In, First Out",
      "Random access by index",
      "Priority-based access",
    ],
    correct: 0,
    explanation: "A stack is LIFO — the last element pushed is the first one popped. Think of a stack of plates.",
    xp: 25,
  },
  {
    id: "stack-trace-2",
    pauseAfterStep: 4,
    text: "We pushed 5, 3, 8, 1. What value is currently on top?",
    options: ["1", "5", "8", "3"],
    correct: 0,
    explanation: "The last value pushed (1) is on top. LIFO means the most recent addition is at the top.",
    xp: 25,
  },
  {
    id: "stack-trace-3",
    pauseAfterStep: 5,
    text: "pop() was called and removed 1. What is the new top of the stack?",
    options: ["8", "3", "5", "The stack is empty"],
    correct: 0,
    explanation: "After removing 1, the stack is [5, 3, 8]. The new top is 8 — the element pushed just before 1.",
    xp: 25,
  },
  {
    id: "stack-trace-4",
    pauseAfterStep: 7,
    text: "After two pops and push(6), the stack is [5, 3, 6]. What does peek() return without modifying the stack?",
    options: ["6", "5", "3", "undefined"],
    correct: 0,
    explanation: "peek() returns the top element (6) without removing it. The stack remains unchanged.",
    xp: 25,
  },
]

export const STACK_SOLVE_PROBLEMS: SolveProblem[] = [
  {
    id: "stack-solve-1",
    array: [],
    target: 0,
    question: "Operations: push(A), push(B), pop(), push(C), pop(), pop(). What order are elements removed?",
    options: ["B, C, A", "A, B, C", "C, B, A", "B, A, C"],
    correct: 0,
    explanation: "push A→[A], push B→[A,B], pop→B out [A], push C→[A,C], pop→C out [A], pop→A out []. Removed: B, C, A.",
    xp: 30,
  },
  {
    id: "stack-solve-2",
    array: [],
    target: 0,
    question: "To check if parentheses '(()())' are balanced, what data structure is ideal?",
    options: [
      "Stack — push on '(' and pop on ')'",
      "Queue — enqueue on '(' and dequeue on ')'",
      "Array — count opening and closing",
      "Hash map — map each '(' to its ')'",
    ],
    correct: 0,
    explanation: "A stack matches each ')' with the most recent unmatched '('. If the stack is empty at the end, brackets are balanced.",
    xp: 30,
  },
  {
    id: "stack-solve-3",
    array: [],
    target: 0,
    question: "What is the time complexity of push and pop operations on a stack?",
    options: ["O(1) for both", "O(n) for both", "O(1) push, O(n) pop", "O(log n) for both"],
    correct: 0,
    explanation: "Both push and pop operate only on the top element, making them constant time O(1) operations.",
    xp: 30,
  },
]

export const TRACE_TOTAL_XP = STACK_TRACE_QUESTIONS.reduce((s, q) => s + q.xp, 0)
export const SOLVE_TOTAL_XP = STACK_SOLVE_PROBLEMS.reduce((s, p) => s + p.xp, 0)
export const LEVEL_TOTAL_XP = TRACE_TOTAL_XP + SOLVE_TOTAL_XP
