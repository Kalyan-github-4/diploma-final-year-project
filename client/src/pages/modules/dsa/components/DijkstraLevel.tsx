import { useMemo, useCallback } from "react"
import { generateDijkstraSteps, DIJKSTRA_NODES, DIJKSTRA_EDGES } from "@/lib/algorithms/dijkstra"
import {
  DIJKSTRA_TRACE_QUESTIONS,
  DIJKSTRA_SOLVE_PROBLEMS,
  LEVEL_TOTAL_XP,
} from "@/lib/algorithms/dijkstraChallenges"
import type { DijkstraSnapshot } from "@/types/dsa.types"
import type { DSAStep } from "@/types/dsa.types"
import DSAAlgorithmLevel from "./DSAAlgorithmLevel"

// Node positions for weighted graph layout
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  A: { x: 40, y: 60 },
  B: { x: 160, y: 20 },
  C: { x: 40, y: 180 },
  D: { x: 180, y: 140 },
  E: { x: 300, y: 60 },
  F: { x: 300, y: 200 },
}

export default function DijkstraLevel() {
  const { steps } = useMemo(() => generateDijkstraSteps({ startNode: "A" }), [])

  const renderVisualizer = useCallback((step: DSAStep) => {
    const snap = step.snapshot as DijkstraSnapshot
    const INF = 9999

    return (
      <svg viewBox="-10 -10 360 250" className="h-[260px] w-[360px]">
        {/* Edges with weights */}
        {DIJKSTRA_EDGES.map(([a, b, w], i) => {
          const pa = NODE_POSITIONS[a]
          const pb = NODE_POSITIONS[b]
          const bothVisited = snap.visited.includes(a) && snap.visited.includes(b)
          const mx = (pa.x + pb.x) / 2
          const my = (pa.y + pb.y) / 2

          return (
            <g key={i}>
              <line
                x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke={bothVisited ? "#6C47FF" : "var(--border-subtle, #2E2E3A)"}
                strokeWidth={bothVisited ? 2 : 1.5}
                strokeOpacity={bothVisited ? 0.6 : 0.3}
              />
              <rect
                x={mx - 8} y={my - 7}
                width={16} height={14} rx={4}
                fill="var(--bg-elevated, #1A1A21)"
                stroke={bothVisited ? "#6C47FF" : "var(--border-subtle, #2E2E3A)"}
                strokeWidth={0.5}
              />
              <text
                x={mx} y={my + 1}
                textAnchor="middle" dominantBaseline="central"
                fill={bothVisited ? "#6C47FF" : "var(--text-tertiary, #666)"}
                fontSize={9} fontWeight={600} fontFamily="monospace"
              >
                {w}
              </text>
            </g>
          )
        })}

        {/* Nodes */}
        {DIJKSTRA_NODES.map((node) => {
          const pos = NODE_POSITIONS[node]
          const isCurrent = snap.currentNode === node
          const isVisited = snap.visited.includes(node)
          const dist = snap.distances[node]
          const distLabel = dist === INF ? "∞" : String(dist)

          let fill = "var(--bg-surface, #212129)"
          let stroke = "var(--border-subtle, #2E2E3A)"
          let textFill = "var(--text-secondary, #9394A1)"

          if (isCurrent) {
            fill = "rgba(108, 71, 255, 0.15)"
            stroke = "#6C47FF"
            textFill = "#6C47FF"
          } else if (isVisited) {
            fill = "rgba(34, 197, 94, 0.1)"
            stroke = "rgba(34, 197, 94, 0.5)"
            textFill = "#22C55E"
          }

          return (
            <g key={node}>
              <circle
                cx={pos.x} cy={pos.y} r={22}
                fill={fill} stroke={stroke} strokeWidth={2}
              />
              <text
                x={pos.x} y={pos.y - 3}
                textAnchor="middle" dominantBaseline="central"
                fill={textFill}
                fontSize={14} fontWeight={700} fontFamily="monospace"
              >
                {node}
              </text>
              <text
                x={pos.x} y={pos.y + 11}
                textAnchor="middle" dominantBaseline="central"
                fill={isCurrent ? "#6C47FF" : isVisited ? "#22C55E" : "var(--text-tertiary, #666)"}
                fontSize={9} fontWeight={500} fontFamily="monospace"
              >
                d={distLabel}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }, [])

  return (
    <DSAAlgorithmLevel
      title="Dijkstra's Shortest Path"
      levelNumber={6}
      totalXp={LEVEL_TOTAL_XP}
      steps={steps}
      traceQuestions={DIJKSTRA_TRACE_QUESTIONS}
      solveProblems={DIJKSTRA_SOLVE_PROBLEMS}
      renderVisualizer={renderVisualizer}
    />
  )
}
