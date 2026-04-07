import { motion, AnimatePresence } from "framer-motion"
import type { BFSSnapshot } from "@/types/dsa.types"
import { BFS_EDGES } from "@/lib/algorithms/bfs"

interface BFSVisualizerProps {
  snapshot: BFSSnapshot
}

// Fixed node positions in SVG coordinate space
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  A: { x: 80,  y: 70  },
  B: { x: 200, y: 70  },
  E: { x: 320, y: 70  },
  C: { x: 80,  y: 190 },
  D: { x: 200, y: 190 },
  F: { x: 320, y: 190 },
}

const NODE_RADIUS = 26

function getNodeState(
  node: string,
  snapshot: BFSSnapshot
): "current" | "queued" | "visited" | "unvisited" {
  if (snapshot.currentNode === node) return "current"
  if (snapshot.queue.includes(node)) return "queued"
  if (snapshot.visited.includes(node)) return "visited"
  return "unvisited"
}

function isTreeEdge(a: string, b: string, snapshot: BFSSnapshot): boolean {
  return (
    snapshot.discoveredFrom[b] === a ||
    snapshot.discoveredFrom[a] === b
  )
}

const NODE_STYLES: Record<string, { fill: string; stroke: string; shadow: string }> = {
  current: {
    fill: "color-mix(in oklab, var(--warning) 28%, var(--bg-surface))",
    stroke: "var(--warning)",
    shadow: "drop-shadow(0 0 8px color-mix(in oklab, var(--warning) 55%, transparent))",
  },
  queued: {
    fill: "color-mix(in oklab, var(--accent) 22%, var(--bg-surface))",
    stroke: "var(--accent)",
    shadow: "none",
  },
  visited: {
    fill: "color-mix(in oklab, var(--success) 18%, var(--bg-surface))",
    stroke: "color-mix(in oklab, var(--success) 55%, var(--border-subtle))",
    shadow: "none",
  },
  unvisited: {
    fill: "var(--bg-surface)",
    stroke: "var(--border-subtle)",
    shadow: "none",
  },
}

const LEGEND_ITEMS = [
  { label: "Unvisited", state: "unvisited" },
  { label: "In Queue", state: "queued" },
  { label: "Current", state: "current" },
  { label: "Visited", state: "visited" },
] as const

export function BFSVisualizer({ snapshot }: BFSVisualizerProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* SVG Graph */}
      <svg
        viewBox="0 0 400 260"
        className="w-full max-w-[460px]"
        aria-label="BFS graph visualization"
      >
        {/* Edges */}
        {BFS_EDGES.map(([a, b]) => {
          const posA = NODE_POSITIONS[a]
          const posB = NODE_POSITIONS[b]
          if (!posA || !posB) return null
          const tree = isTreeEdge(a, b, snapshot)
          return (
            <line
              key={`${a}-${b}`}
              x1={posA.x}
              y1={posA.y}
              x2={posB.x}
              y2={posB.y}
              stroke={tree ? "var(--success)" : "var(--border-subtle)"}
              strokeWidth={tree ? 2.5 : 1.5}
              strokeOpacity={tree ? 0.9 : 0.5}
              strokeDasharray={tree ? "none" : "4 3"}
            />
          )
        })}

        {/* Nodes */}
        {snapshot.nodes.map((node) => {
          const pos = NODE_POSITIONS[node]
          if (!pos) return null
          const state = getNodeState(node, snapshot)
          const style = NODE_STYLES[state]
          const isCurrent = state === "current"

          return (
            <g key={node}>
              {/* Pulse ring for current node */}
              {isCurrent && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_RADIUS + 8}
                  fill="none"
                  stroke="var(--warning)"
                  strokeWidth={1.5}
                  strokeOpacity={0.35}
                  animate={{ r: [NODE_RADIUS + 6, NODE_RADIUS + 14, NODE_RADIUS + 6] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={2}
                style={{ filter: style.shadow }}
                animate={{ scale: isCurrent ? [1, 1.07, 1] : 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />

              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={15}
                fontWeight={700}
                fontFamily="Space Grotesk, sans-serif"
                fill={
                  state === "current"
                    ? "var(--warning)"
                    : state === "queued"
                      ? "var(--accent)"
                      : state === "visited"
                        ? "var(--success)"
                        : "var(--text-secondary)"
                }
              >
                {node}
              </text>

              {/* discoveredFrom label */}
              {snapshot.discoveredFrom[node] && (
                <text
                  x={pos.x}
                  y={pos.y + NODE_RADIUS + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={9}
                  fill="var(--text-tertiary)"
                  fontFamily="Public Sans, sans-serif"
                >
                  from {snapshot.discoveredFrom[node]}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Queue display */}
      <div className="flex w-full flex-col items-center gap-1.5">
        <p className="text-[10px] uppercase tracking-[0.08em] text-(--text-secondary) font-grotesk">
          Queue
        </p>
        <div className="flex min-h-8 flex-wrap items-center justify-center gap-1.5">
          <AnimatePresence mode="popLayout">
            {snapshot.queue.length === 0 ? (
              <motion.span
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[12px] text-(--text-tertiary)"
              >
                empty
              </motion.span>
            ) : (
              snapshot.queue.map((node, i) => (
                <motion.span
                  key={`${node}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.75, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[color-mix(in_oklab,var(--accent)_45%,var(--border-subtle))] bg-[color-mix(in_oklab,var(--accent)_14%,var(--bg-surface))] text-[12px] font-bold text-(--accent) font-grotesk"
                >
                  {node}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Node state legend">
        {LEGEND_ITEMS.map(({ label, state }) => {
          const s = NODE_STYLES[state]
          return (
            <span
              key={state}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] leading-none"
              style={{
                background: s.fill,
                border: `1px solid ${s.stroke}`,
                color: "var(--text-secondary)",
              }}
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
