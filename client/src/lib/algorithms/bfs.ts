import type { BFSStep, BFSSnapshot, ComplexityMeta, StepQuestion } from "@/types/dsa.types"

export const BFS_DEFAULT_GRAPH: Record<string, string[]> = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "D"],
  D: ["B", "C", "F"],
  E: ["B"],
  F: ["D"],
}

export const BFS_NODES = ["A", "B", "C", "D", "E", "F"]

export const BFS_EDGES: [string, string][] = [
  ["A", "B"],
  ["A", "C"],
  ["B", "D"],
  ["B", "E"],
  ["C", "D"],
  ["D", "F"],
]

export const BFS_COMPLEXITY: ComplexityMeta = {
  timeBest: "O(V + E)",
  timeAverage: "O(V + E)",
  timeWorst: "O(V + E)",
  space: "O(V)",
  note: "V = vertices, E = edges. Visits every reachable node once.",
}

export const BFS_REFERENCE_CODE = [
  "function bfs(graph, start) {",
  "  const visited = new Set([start])",
  "  const queue = [start]",
  "  while (queue.length > 0) {",
  "    const node = queue.shift()",
  "    for (const neighbor of graph[node]) {",
  "      if (!visited.has(neighbor)) {",
  "        visited.add(neighbor)",
  "        queue.push(neighbor)",
  "      }",
  "    }",
  "  }",
  "}",
]

interface GenerateBFSStepsInput {
  startNode: string
}

interface GenerateBFSStepsResult {
  steps: BFSStep[]
  visitedOrder: string[]
}

function createSnapshot(
  visited: string[],
  queue: string[],
  currentNode: string | null,
  discoveredFrom: Record<string, string | null>
): BFSSnapshot {
  return {
    nodes: BFS_NODES,
    edges: BFS_EDGES,
    visited: [...visited],
    queue: [...queue],
    currentNode,
    discoveredFrom: { ...discoveredFrom },
  }
}

export function generateBFSSteps({ startNode }: GenerateBFSStepsInput): GenerateBFSStepsResult {
  const steps: BFSStep[] = []
  const visited: string[] = []
  const queue: string[] = []
  const discoveredFrom: Record<string, string | null> = {}
  const visitedOrder: string[] = []

  const pushStep = (
    type: BFSStep["type"],
    description: string,
    codeLine: number,
    currentNode: string | null,
    question?: StepQuestion
  ) => {
    steps.push({
      id: `bfs-step-${steps.length + 1}`,
      algorithm: "bfs",
      type,
      description,
      codeLine,
      snapshot: createSnapshot(visited, queue, currentNode, discoveredFrom),
      question,
    })
  }

  // Init
  discoveredFrom[startNode] = null
  visited.push(startNode)
  queue.push(startNode)

  pushStep(
    "init",
    `Start BFS from node "${startNode}". Mark visited and enqueue.`,
    2,
    startNode
  )

  while (queue.length > 0) {
    const current = queue.shift()!
    visitedOrder.push(current)

    const dequeueQuestion: StepQuestion = {
      text: `Node "${current}" is dequeued. What does BFS do next?`,
      options: [
        `Explore all unvisited neighbors of "${current}"`,
        `Jump to the last node in the queue`,
        `Mark "${current}" as unvisited and restart`,
        `Add "${current}" to the queue again`,
      ],
      correct: 0,
      explanation: `BFS processes "${current}" by exploring each of its unvisited neighbors, enqueuing them for later.`,
    }

    pushStep("dequeue", `Dequeue "${current}" — process its neighbors.`, 5, current, dequeueQuestion)

    const neighbors = BFS_DEFAULT_GRAPH[current] ?? []
    for (const neighbor of neighbors) {
      if (!visited.includes(neighbor)) {
        const visitQuestion: StepQuestion = {
          text: `"${neighbor}" is an unvisited neighbor of "${current}". What happens?`,
          options: [
            `Mark "${neighbor}" as visited and enqueue it`,
            `Skip "${neighbor}" — it will be handled later`,
            `Go back and revisit "${current}"`,
            `Stop BFS — found an unvisited node`,
          ],
          correct: 0,
          explanation: `"${neighbor}" has not been visited yet, so BFS marks it visited and adds it to the queue.`,
        }

        discoveredFrom[neighbor] = current
        visited.push(neighbor)
        queue.push(neighbor)

        pushStep(
          "visit-neighbor",
          `"${neighbor}" is unvisited — mark visited, enqueue.`,
          8,
          current,
          visitQuestion
        )
      } else {
        pushStep(
          "skip-visited",
          `"${neighbor}" already visited — skip.`,
          7,
          current
        )
      }
    }
  }

  pushStep(
    "complete",
    `BFS complete. Visited order: ${visitedOrder.join(" → ")}`,
    12,
    null
  )

  return { steps, visitedOrder }
}
