import type { DijkstraStep, DijkstraSnapshot, ComplexityMeta, StepQuestion } from "@/types/dsa.types"

export const DIJKSTRA_NODES = ["A", "B", "C", "D", "E", "F"]

export const DIJKSTRA_EDGES: [string, string, number][] = [
  ["A", "B", 4],
  ["A", "C", 2],
  ["B", "D", 5],
  ["B", "E", 10],
  ["C", "D", 8],
  ["D", "E", 2],
  ["D", "F", 6],
]

export const DIJKSTRA_GRAPH: Record<string, { node: string; weight: number }[]> = {
  A: [{ node: "B", weight: 4 }, { node: "C", weight: 2 }],
  B: [{ node: "A", weight: 4 }, { node: "D", weight: 5 }, { node: "E", weight: 10 }],
  C: [{ node: "A", weight: 2 }, { node: "D", weight: 8 }],
  D: [{ node: "B", weight: 5 }, { node: "C", weight: 8 }, { node: "E", weight: 2 }, { node: "F", weight: 6 }],
  E: [{ node: "B", weight: 10 }, { node: "D", weight: 2 }],
  F: [{ node: "D", weight: 6 }],
}

const INF = 9999

/** Build an undirected adjacency list from an edge list */
export function buildAdjacencyList(
  edges: [string, string, number][]
): Record<string, { node: string; weight: number }[]> {
  const graph: Record<string, { node: string; weight: number }[]> = {}
  for (const [a, b, w] of edges) {
    if (!graph[a]) graph[a] = []
    if (!graph[b]) graph[b] = []
    graph[a].push({ node: b, weight: w })
    graph[b].push({ node: a, weight: w })
  }
  return graph
}

export const DIJKSTRA_COMPLEXITY: ComplexityMeta = {
  timeBest: "O(V²)",
  timeAverage: "O(V²)",
  timeWorst: "O(V²)",
  space: "O(V)",
  note: "V = vertices. Uses linear scan for min-distance node. O((V+E) log V) with a min-heap.",
}

export const DIJKSTRA_REFERENCE_CODE = [
  "function dijkstra(graph, start) {",
  "  const dist = {}; const prev = {}",
  "  for (const v of graph.nodes) {",
  "    dist[v] = Infinity; prev[v] = null",
  "  }",
  "  dist[start] = 0",
  "  const unvisited = new Set(graph.nodes)",
  "  while (unvisited.size > 0) {",
  "    const u = minDistNode(unvisited, dist)",
  "    unvisited.delete(u)",
  "    for (const {node: v, weight: w} of graph[u]) {",
  "      if (dist[u] + w < dist[v]) {",
  "        dist[v] = dist[u] + w",
  "        prev[v] = u",
  "      }",
  "    }",
  "  }",
  "  return { dist, prev }",
  "}",
]

interface CreateSnapshotCtx {
  allNodes: string[]
  allEdges: [string, string, number][]
}

function createSnapshot(
  ctx: CreateSnapshotCtx,
  visited: string[],
  currentNode: string | null,
  distances: Record<string, number>,
  previous: Record<string, string | null>,
  unvisited: Set<string>
): DijkstraSnapshot {
  const queue = ctx.allNodes
    .filter((n) => unvisited.has(n) && distances[n] < INF)
    .sort((a, b) => distances[a] - distances[b])

  return {
    nodes: ctx.allNodes,
    edges: ctx.allEdges,
    visited: [...visited],
    currentNode,
    distances: { ...distances },
    previous: { ...previous },
    queue,
  }
}

interface GenerateDijkstraStepsInput {
  startNode: string
  nodes?: string[]
  edges?: [string, string, number][]
  graph?: Record<string, { node: string; weight: number }[]>
}

interface GenerateDijkstraStepsResult {
  steps: DijkstraStep[]
  shortestDistances: Record<string, number>
}

export function generateDijkstraSteps({
  startNode,
  nodes: customNodes,
  edges: customEdges,
  graph: customGraph,
}: GenerateDijkstraStepsInput): GenerateDijkstraStepsResult {
  const allNodes = customNodes ?? DIJKSTRA_NODES
  const allEdges = customEdges ?? DIJKSTRA_EDGES
  const adjList = customGraph ?? DIJKSTRA_GRAPH
  const ctx: CreateSnapshotCtx = { allNodes, allEdges }

  const steps: DijkstraStep[] = []
  const visited: string[] = []
  const distances: Record<string, number> = {}
  const previous: Record<string, string | null> = {}
  const unvisited = new Set(allNodes)

  for (const node of allNodes) {
    distances[node] = INF
    previous[node] = null
  }
  distances[startNode] = 0

  const pushStep = (
    type: DijkstraStep["type"],
    description: string,
    codeLine: number,
    currentNode: string | null,
    question?: StepQuestion
  ) => {
    steps.push({
      id: `dijkstra-step-${steps.length + 1}`,
      algorithm: "dijkstra",
      type,
      description,
      codeLine,
      snapshot: createSnapshot(ctx, visited, currentNode, distances, previous, unvisited),
      question,
    })
  }

  // Init
  pushStep(
    "init",
    `Initialize: dist(${startNode})=0, all others=∞. All nodes unvisited.`,
    5,
    null
  )

  while (unvisited.size > 0) {
    // Find min-distance unvisited node
    let minNode: string | null = null
    let minDist = INF
    for (const n of unvisited) {
      if (distances[n] < minDist) {
        minDist = distances[n]
        minNode = n
      }
    }

    if (minNode === null) break // remaining nodes unreachable

    // Build question for select-min
    const unvisitedWithDist = allNodes
      .filter((n) => unvisited.has(n) && distances[n] < INF)
      .sort((a, b) => distances[a] - distances[b])

    let selectQuestion: StepQuestion | undefined
    if (unvisitedWithDist.length >= 2) {
      const distractors = unvisitedWithDist
        .filter((n) => n !== minNode)
        .slice(0, 3)
        .map((n) => `${n} (d=${distances[n]})`)

      const options = [`${minNode} (d=${distances[minNode]})`, ...distractors]
      selectQuestion = {
        text: `Which unvisited node has the smallest distance?`,
        options: options.length < 4
          ? [...options, ...Array(4 - options.length).fill("No other node")].slice(0, 4)
          : options.slice(0, 4),
        correct: 0,
        explanation: `${minNode} has distance ${distances[minNode]}, the smallest among unvisited nodes. Dijkstra always processes the closest unvisited node next.`,
      }
    }

    unvisited.delete(minNode)
    visited.push(minNode)

    pushStep(
      "select-min",
      `Select "${minNode}" — smallest distance (${distances[minNode]}) among unvisited. Mark as settled.`,
      8,
      minNode,
      selectQuestion
    )

    // Process neighbors
    const neighbors = adjList[minNode] ?? []
    for (const { node: neighbor, weight } of neighbors) {
      if (!unvisited.has(neighbor)) {
        pushStep(
          "skip-visited",
          `"${neighbor}" already settled — skip.`,
          10,
          minNode
        )
        continue
      }

      const newDist = distances[minNode] + weight
      const oldDist = distances[neighbor]

      if (newDist < oldDist) {
        const relaxQuestion: StepQuestion = {
          text: `Edge ${minNode}→${neighbor} has weight ${weight}. New path cost = ${distances[minNode]}+${weight} = ${newDist}. Current dist(${neighbor}) = ${oldDist === INF ? "∞" : oldDist}. Update?`,
          options: [
            `Yes — ${newDist} < ${oldDist === INF ? "∞" : oldDist}, update dist(${neighbor}) to ${newDist}`,
            `No — keep current distance`,
            `Only update if ${neighbor} is visited`,
            `Reset distance to 0`,
          ],
          correct: 0,
          explanation: `${newDist} < ${oldDist === INF ? "∞" : oldDist}, so we relax: update dist(${neighbor}) = ${newDist} via ${minNode}.`,
        }

        distances[neighbor] = newDist
        previous[neighbor] = minNode

        pushStep(
          "relax",
          `Relax ${minNode}→${neighbor}: dist = ${distances[minNode] - weight}+${weight} = ${newDist} (was ${oldDist === INF ? "∞" : oldDist}).`,
          12,
          minNode,
          relaxQuestion
        )
      } else {
        pushStep(
          "no-relax",
          `${minNode}→${neighbor}: ${newDist} ≥ ${oldDist} — no update needed.`,
          11,
          minNode
        )
      }
    }
  }

  // Build final distances summary
  const distSummary = allNodes
    .map((n) => `${n}=${distances[n] === INF ? "∞" : distances[n]}`)
    .join(", ")

  pushStep(
    "complete",
    `Dijkstra complete. Shortest distances from ${startNode}: ${distSummary}`,
    17,
    null
  )

  return { steps, shortestDistances: { ...distances } }
}
