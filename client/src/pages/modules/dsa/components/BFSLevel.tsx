import { useMemo, useCallback } from "react"
import { generateBFSSteps, BFS_NODES, BFS_EDGES } from "@/lib/algorithms/bfs"
import {
  BFS_TRACE_QUESTIONS,
  BFS_SOLVE_PROBLEMS,
  LEVEL_TOTAL_XP,
} from "@/lib/algorithms/bfsChallenges"
import type { BFSSnapshot } from "@/types/dsa.types"
import type { DSAStep } from "@/types/dsa.types"
import DSAAlgorithmLevel from "./DSAAlgorithmLevel"

// Node positions for graph layout (circle)
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  A: { x: 120, y: 40 },
  B: { x: 40, y: 120 },
  C: { x: 200, y: 120 },
  D: { x: 120, y: 200 },
  E: { x: 20, y: 220 },
  F: { x: 220, y: 260 },
}

export default function BFSLevel() {
  const { steps } = useMemo(() => generateBFSSteps({ startNode: "A" }), [])

  const renderVisualizer = useCallback((step: DSAStep) => {
    const snap = step.snapshot as BFSSnapshot
    return (
      <svg viewBox="-10 -10 260 300" className="h-[280px] w-[280px]">
        {/* Edges */}
        {BFS_EDGES.map(([a, b], i) => {
          const pa = NODE_POSITIONS[a]
          const pb = NODE_POSITIONS[b]
          const bothVisited = snap.visited.includes(a) && snap.visited.includes(b)
          return (
            <line
              key={i}
              x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke={bothVisited ? "#6C47FF" : "var(--border-subtle, #2E2E3A)"}
              strokeWidth={bothVisited ? 2 : 1.5}
              strokeOpacity={bothVisited ? 0.6 : 0.3}
            />
          )
        })}
        {/* Nodes */}
        {BFS_NODES.map((node) => {
          const pos = NODE_POSITIONS[node]
          const isCurrent = snap.currentNode === node
          const isVisited = snap.visited.includes(node)
          const inQueue = snap.queue.includes(node)

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
          } else if (inQueue) {
            fill = "rgba(245, 158, 11, 0.1)"
            stroke = "rgba(245, 158, 11, 0.5)"
            textFill = "#F59E0B"
          }

          return (
            <g key={node}>
              <circle
                cx={pos.x} cy={pos.y} r={22}
                fill={fill} stroke={stroke} strokeWidth={2}
              />
              <text
                x={pos.x} y={pos.y + 1}
                textAnchor="middle" dominantBaseline="central"
                fill={textFill}
                fontSize={14} fontWeight={700} fontFamily="monospace"
              >
                {node}
              </text>
            </g>
          )
        })}
        {/* Queue display */}
        <text x={0} y={292} fill="var(--text-tertiary, #666)" fontSize={10} fontFamily="monospace">
          queue: [{snap.queue.join(", ")}]
        </text>
      </svg>
    )
  }, [])

  return (
    <DSAAlgorithmLevel
      title="BFS Graph Traversal"
      levelNumber={3}
      totalXp={LEVEL_TOTAL_XP}
      steps={steps}
      traceQuestions={BFS_TRACE_QUESTIONS}
      solveProblems={BFS_SOLVE_PROBLEMS}
      renderVisualizer={renderVisualizer}
    />
  )
}
