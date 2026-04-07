/**
 * Dijkstra — Trace questions & Solve problems
 *
 * Default graph: A-B(4), A-C(2), B-D(5), B-E(10), C-D(8), D-E(2), D-F(6)
 * Starting at A. Shortest: A=0, B=4, C=2, D=9, E=11, F=15
 */

import type { TraceQuestion, SolveProblem } from "./binarySearchChallenges"

// Steps overview for Dijkstra starting at A:
//   0: init — dist(A)=0, all others ∞
//   1: select A (d=0), mark settled
//   2: relax A→B: 0+4=4 < ∞ → update
//   3: relax A→C: 0+2=2 < ∞ → update
//   4: select C (d=2), mark settled
//   5: relax C→D: 2+8=10 < ∞ → update
//   6: select B (d=4), mark settled
//   7: relax B→D: 4+5=9 < 10 → update
//   8: relax B→E: 4+10=14 < ∞ → update
//   ... continues

export const DIJKSTRA_TRACE_QUESTIONS: TraceQuestion[] = [
  {
    id: "dj-trace-1",
    pauseAfterStep: 0,
    text: "Dijkstra initializes all distances to ∞ except the start node (0). Why?",
    options: [
      "We haven't discovered any paths yet — ∞ means 'unknown distance'",
      "All nodes are equally far from the start",
      "It's a convention with no practical purpose",
      "Negative distances aren't supported",
    ],
    correct: 0,
    explanation: "Setting distances to ∞ means 'no known path yet.' As we discover paths, distances get relaxed to smaller values.",
    xp: 25,
  },
  {
    id: "dj-trace-2",
    pauseAfterStep: 1,
    text: "Node A (distance 0) is selected first. Why does Dijkstra always pick the minimum-distance unvisited node?",
    options: [
      "Because a shorter path to that node can't exist through unvisited nodes",
      "It's just an optimization, any order works",
      "To avoid processing neighbors twice",
      "Because the graph is sorted by distance",
    ],
    correct: 0,
    explanation: "The greedy choice is provably optimal: all unvisited nodes have distance ≥ the selected node, so no shortcut exists through them.",
    xp: 25,
  },
  {
    id: "dj-trace-3",
    pauseAfterStep: 3,
    text: "After relaxing A's edges: dist(B)=4, dist(C)=2. Which node is selected next?",
    options: [
      "C — it has the smallest distance (2)",
      "B — it appears first alphabetically",
      "D — it's connected to both B and C",
      "A — we revisit it",
    ],
    correct: 0,
    explanation: "Dijkstra selects the unvisited node with the smallest tentative distance. C has distance 2 < B's 4.",
    xp: 25,
  },
  {
    id: "dj-trace-4",
    pauseAfterStep: 7,
    text: "dist(D) was 10 (via C). Now we find a path through B: 4+5=9. What happens?",
    options: [
      "Update dist(D) to 9 — we found a shorter path",
      "Keep dist(D) at 10 — first path found wins",
      "Average the two: (10+9)/2 = 9.5",
      "Mark D as unreachable",
    ],
    correct: 0,
    explanation: "This is 'relaxation': 9 < 10, so we update dist(D)=9 and record that D's best predecessor is now B.",
    xp: 25,
  },
]

export const DIJKSTRA_SOLVE_PROBLEMS: SolveProblem[] = [
  {
    id: "dj-solve-1",
    array: [],
    target: 0,
    question: "In the default graph starting at A, what is the shortest distance from A to E?",
    options: ["11", "14", "10", "12"],
    correct: 0,
    explanation: "A→B(4)→D(4+5=9)→E(9+2=11). The direct A→B→E path costs 14, but going through D is shorter.",
    xp: 30,
  },
  {
    id: "dj-solve-2",
    array: [],
    target: 0,
    question: "Why does Dijkstra's algorithm NOT work with negative edge weights?",
    options: [
      "A settled node might later find a shorter path through a negative edge",
      "Negative weights cause infinite loops",
      "The priority queue can't store negative values",
      "It works fine with negative weights",
    ],
    correct: 0,
    explanation: "Dijkstra assumes settled nodes have their final shortest distance. A negative edge could provide a shortcut that violates this.",
    xp: 30,
  },
  {
    id: "dj-solve-3",
    array: [],
    target: 0,
    question: "What data structure makes Dijkstra more efficient than O(V²)?",
    options: [
      "A min-heap (priority queue) — gives O((V+E) log V)",
      "A stack — gives O(V + E)",
      "A hash map — gives O(V)",
      "An adjacency matrix — gives O(V log V)",
    ],
    correct: 0,
    explanation: "A min-heap allows extracting the minimum-distance node in O(log V) instead of O(V), reducing total time to O((V+E) log V).",
    xp: 30,
  },
]

export const TRACE_TOTAL_XP = DIJKSTRA_TRACE_QUESTIONS.reduce((s, q) => s + q.xp, 0)
export const SOLVE_TOTAL_XP = DIJKSTRA_SOLVE_PROBLEMS.reduce((s, p) => s + p.xp, 0)
export const LEVEL_TOTAL_XP = TRACE_TOTAL_XP + SOLVE_TOTAL_XP
