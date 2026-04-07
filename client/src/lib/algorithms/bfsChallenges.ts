/**
 * BFS — Trace questions & Solve problems
 *
 * Default graph: A-B, A-C, B-D, B-E, C-D, D-F (starting at A)
 * Visited order: A → B → C → D → E → F
 */

import type { TraceQuestion, SolveProblem } from "./binarySearchChallenges"

// Steps overview for BFS starting at A:
//   0: init — enqueue A, mark visited
//   1: dequeue A, process neighbors
//   2: visit B (neighbor of A)
//   3: visit C (neighbor of A)
//   4: dequeue B, process neighbors
//   5: visit D (neighbor of B)
//   6: visit E (neighbor of B)
//   ... continues

export const BFS_TRACE_QUESTIONS: TraceQuestion[] = [
  {
    id: "bfs-trace-1",
    pauseAfterStep: 0,
    text: "BFS starts at node A. What data structure drives the traversal order?",
    options: [
      "A queue (FIFO)",
      "A stack (LIFO)",
      "A priority queue",
      "A random order generator",
    ],
    correct: 0,
    explanation: "BFS uses a queue — first in, first out. This ensures nodes are visited level by level.",
    xp: 25,
  },
  {
    id: "bfs-trace-2",
    pauseAfterStep: 1,
    text: "Node A is dequeued. Its neighbors are B and C. Which gets visited first?",
    options: [
      "B — it appears first in A's adjacency list",
      "C — alphabetical order",
      "Whichever is closer to A",
      "Both at the same time",
    ],
    correct: 0,
    explanation: "BFS processes neighbors in the order they appear in the adjacency list. B is listed before C for node A.",
    xp: 25,
  },
  {
    id: "bfs-trace-3",
    pauseAfterStep: 4,
    text: "After visiting A's neighbors (B, C), which node is dequeued next?",
    options: [
      "B — it was enqueued first (FIFO)",
      "C — it was enqueued last",
      "D — it's closest to A",
      "A — we revisit it",
    ],
    correct: 0,
    explanation: "The queue is FIFO. B was enqueued before C, so B is dequeued and processed first.",
    xp: 25,
  },
  {
    id: "bfs-trace-4",
    pauseAfterStep: 7,
    text: "Node D is a neighbor of both B and C. When C processes D, what happens?",
    options: [
      "D is skipped — it's already marked visited",
      "D is visited again from C",
      "D is added to the queue a second time",
      "C is removed from the graph",
    ],
    correct: 0,
    explanation: "BFS marks nodes as visited when first discovered. D was already visited via B, so it's skipped when C checks it.",
    xp: 25,
  },
]

export const BFS_SOLVE_PROBLEMS: SolveProblem[] = [
  {
    id: "bfs-solve-1",
    array: [],
    target: 0,
    question: "In BFS on a graph with nodes A→{B,C}, B→{D}, C→{D,E}, starting at A, what is the visit order?",
    options: [
      "A, B, C, D, E",
      "A, C, B, D, E",
      "A, B, D, C, E",
      "A, B, C, E, D",
    ],
    correct: 0,
    explanation: "BFS visits level by level: A (level 0), then B,C (level 1), then D,E (level 2). B before C as it's listed first.",
    xp: 30,
  },
  {
    id: "bfs-solve-2",
    array: [],
    target: 0,
    question: "What is the time complexity of BFS on a graph with V vertices and E edges?",
    options: ["O(V + E)", "O(V × E)", "O(V²)", "O(E log V)"],
    correct: 0,
    explanation: "BFS visits each vertex once (O(V)) and checks each edge once (O(E)), giving O(V + E).",
    xp: 30,
  },
  {
    id: "bfs-solve-3",
    array: [],
    target: 0,
    question: "Why does BFS find the shortest path (fewest edges) in an unweighted graph?",
    options: [
      "It explores all nodes at distance d before any node at distance d+1",
      "It always picks the closest node first",
      "It uses a priority queue sorted by distance",
      "It backtracks when it finds a shorter path",
    ],
    correct: 0,
    explanation: "The FIFO queue ensures BFS processes nodes level by level — all distance-d nodes before distance-(d+1) nodes.",
    xp: 30,
  },
]

export const TRACE_TOTAL_XP = BFS_TRACE_QUESTIONS.reduce((s, q) => s + q.xp, 0)
export const SOLVE_TOTAL_XP = BFS_SOLVE_PROBLEMS.reduce((s, p) => s + p.xp, 0)
export const LEVEL_TOTAL_XP = TRACE_TOTAL_XP + SOLVE_TOTAL_XP
