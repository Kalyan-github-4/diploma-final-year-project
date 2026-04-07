import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { DijkstraSnapshot } from "@/types/dsa.types"
import { DIJKSTRA_NODES } from "@/lib/algorithms/dijkstra"

interface DijkstraVisualizerProps {
  snapshot: DijkstraSnapshot
}

const INF = 9999

/** Fixed positions for the default A-F graph (used in module learning page) */
const DEFAULT_NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  A: { x: 80,  y: 70  },
  B: { x: 200, y: 70  },
  E: { x: 320, y: 70  },
  C: { x: 80,  y: 190 },
  D: { x: 200, y: 190 },
  F: { x: 320, y: 190 },
}

/** Compute circular layout positions for an arbitrary set of nodes */
function computeCircularPositions(
  nodes: string[],
  cx: number,
  cy: number,
  radius: number
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}
  const count = nodes.length
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / count
    positions[nodes[i]] = {
      x: Math.round(cx + radius * Math.cos(angle)),
      y: Math.round(cy + radius * Math.sin(angle)),
    }
  }
  return positions
}

/** Check if the snapshot uses the default A-F node set */
function isDefaultGraph(nodes: string[]): boolean {
  if (nodes.length !== DIJKSTRA_NODES.length) return false
  const sorted = [...nodes].sort()
  const defaultSorted = [...DIJKSTRA_NODES].sort()
  return sorted.every((n, i) => n === defaultSorted[i])
}

const NODE_RADIUS = 26

function getNodeState(
  node: string,
  snapshot: DijkstraSnapshot
): "current" | "inQueue" | "settled" | "unvisited" {
  if (snapshot.currentNode === node) return "current"
  if (snapshot.visited.includes(node)) return "settled"
  if (snapshot.queue.includes(node)) return "inQueue"
  return "unvisited"
}

function isTreeEdge(a: string, b: string, snapshot: DijkstraSnapshot): boolean {
  return snapshot.previous[b] === a || snapshot.previous[a] === b
}

const NODE_STYLES: Record<string, { fill: string; stroke: string; shadow: string }> = {
  current: {
    fill: "color-mix(in oklab, var(--warning) 28%, var(--bg-surface))",
    stroke: "var(--warning)",
    shadow: "drop-shadow(0 0 8px color-mix(in oklab, var(--warning) 55%, transparent))",
  },
  inQueue: {
    fill: "color-mix(in oklab, var(--accent) 22%, var(--bg-surface))",
    stroke: "var(--accent)",
    shadow: "none",
  },
  settled: {
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
  { label: "In Queue", state: "inQueue" },
  { label: "Current", state: "current" },
  { label: "Settled", state: "settled" },
] as const

function formatDist(d: number): string {
  return d >= INF ? "∞" : String(d)
}

export function DijkstraVisualizer({ snapshot }: DijkstraVisualizerProps) {
  const useDefault = isDefaultGraph(snapshot.nodes)

  // SVG dimensions adapt to graph size
  const svgW = useDefault ? 400 : Math.max(400, snapshot.nodes.length * 60)
  const svgH = useDefault ? 280 : Math.max(280, snapshot.nodes.length * 40)

  const nodePositions = useMemo(() => {
    if (useDefault) return DEFAULT_NODE_POSITIONS
    return computeCircularPositions(snapshot.nodes, svgW / 2, svgH / 2, Math.min(svgW, svgH) / 2 - 50)
  }, [snapshot.nodes.join(","), useDefault, svgW, svgH])

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {/* SVG Graph */}
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-[520px]"
        aria-label="Dijkstra graph visualization"
      >
        {/* Edges with weight labels */}
        {snapshot.edges.map(([a, b, weight]) => {
          const posA = nodePositions[a]
          const posB = nodePositions[b]
          if (!posA || !posB) return null
          const tree = isTreeEdge(a, b, snapshot)
          const midX = (posA.x + posB.x) / 2
          const midY = (posA.y + posB.y) / 2

          // Offset weight label perpendicular to edge for readability
          const dx = posB.x - posA.x
          const dy = posB.y - posA.y
          const len = Math.sqrt(dx * dx + dy * dy) || 1
          const offsetX = (-dy / len) * 12
          const offsetY = (dx / len) * 12

          return (
            <g key={`${a}-${b}`}>
              <line
                x1={posA.x}
                y1={posA.y}
                x2={posB.x}
                y2={posB.y}
                stroke={tree ? "var(--success)" : "var(--border-subtle)"}
                strokeWidth={tree ? 2.5 : 1.5}
                strokeOpacity={tree ? 0.9 : 0.5}
                strokeDasharray={tree ? "none" : "4 3"}
              />
              {/* Weight badge */}
              <rect
                x={midX + offsetX - 10}
                y={midY + offsetY - 8}
                width={20}
                height={16}
                rx={4}
                fill={tree ? "color-mix(in oklab, var(--success) 22%, var(--bg-surface))" : "var(--bg-surface)"}
                stroke={tree ? "var(--success)" : "var(--border-subtle)"}
                strokeWidth={1}
                strokeOpacity={0.6}
              />
              <text
                x={midX + offsetX}
                y={midY + offsetY + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fontWeight={600}
                fontFamily="Space Grotesk, sans-serif"
                fill={tree ? "var(--success)" : "var(--text-secondary)"}
              >
                {weight}
              </text>
            </g>
          )
        })}

        {/* Nodes */}
        {snapshot.nodes.map((node) => {
          const pos = nodePositions[node]
          if (!pos) return null
          const state = getNodeState(node, snapshot)
          const style = NODE_STYLES[state]
          const isCurrent = state === "current"
          const dist = snapshot.distances[node]

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

              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y - 3}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={14}
                fontWeight={700}
                fontFamily="Space Grotesk, sans-serif"
                fill={
                  state === "current"
                    ? "var(--warning)"
                    : state === "inQueue"
                      ? "var(--accent)"
                      : state === "settled"
                        ? "var(--success)"
                        : "var(--text-secondary)"
                }
              >
                {node}
              </text>

              {/* Distance inside node */}
              <text
                x={pos.x}
                y={pos.y + 11}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                fontWeight={600}
                fontFamily="Public Sans, sans-serif"
                fill={
                  state === "current"
                    ? "var(--warning)"
                    : state === "settled"
                      ? "var(--success)"
                      : "var(--text-tertiary)"
                }
              >
                d={formatDist(dist)}
              </text>

              {/* Previous node label */}
              {snapshot.previous[node] && (
                <text
                  x={pos.x}
                  y={pos.y + NODE_RADIUS + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={9}
                  fill="var(--text-tertiary)"
                  fontFamily="Public Sans, sans-serif"
                >
                  via {snapshot.previous[node]}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Priority queue display */}
      <div className="flex w-full flex-col items-center gap-1">
        <p className="text-[10px] uppercase tracking-[0.08em] text-(--text-secondary) font-grotesk">
          Priority Queue
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
                  className="inline-flex items-center gap-1 rounded-lg border border-[color-mix(in_oklab,var(--accent)_45%,var(--border-subtle))] bg-[color-mix(in_oklab,var(--accent)_14%,var(--bg-surface))] px-2 py-1 text-[11px] font-bold text-(--accent) font-grotesk"
                >
                  <span>{node}</span>
                  <span className="text-[9px] font-normal text-(--text-tertiary)">
                    ({formatDist(snapshot.distances[node])})
                  </span>
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-1" aria-label="Node state legend">
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
