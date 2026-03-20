import { useMemo } from "react"
import type { GitState } from "@/lib/gitSimulator"
import { getBranchColor } from "@/lib/gitSimulator"
import CommitNode from "./CommitNode"
import BranchLabel from "./BranchLabel"
import HeadPointer from "./HeadPointer"

interface GitGraphProps {
  gitState: GitState
  newCommitId?: string | null
}

/* Layout constants */
const NODE_SPACING_X = 120
const BRANCH_SPACING_Y = 80
const START_X = 80
const START_Y = 100

interface LayoutNode {
  id: string
  x: number
  y: number
  branch: string
  color: string
  parentId: string | null
  secondParentId?: string | null
}

export default function GitGraph({ gitState, newCommitId }: GitGraphProps) {
  /* Build a layout of nodes from the state */
  const { nodes, lines, branchLabels, headInfo, branchPointers } = useMemo(() => {
    const commits = gitState.commits
    const commitIds = Object.keys(commits)
    if (commitIds.length === 0) return { nodes: [], lines: [], branchLabels: [], headInfo: null, branchPointers: [] }

    /* Topological sort: place commits in order */
    const visited = new Set<string>()
    const sorted: string[] = []
    function visit(id: string) {
      if (visited.has(id) || !commits[id]) return
      visited.add(id)
      if (commits[id].parent) visit(commits[id].parent!)
      if (commits[id].secondParent) visit(commits[id].secondParent!)
      sorted.push(id)
    }
    commitIds.forEach(visit)

    /* Assign branches to rows — primary branch (first) stays at row 0 */
    const branchNames = Object.keys(gitState.branches)
    const branchRow: Record<string, number> = {}
    branchNames.forEach((b, i) => { branchRow[b] = i })

    /* Detect branches that point to a commit but have no own commits yet (fork points).
       These are branches created with checkout -b / switch -c that haven't been committed on. */
    const branchesWithOwnCommits = new Set<string>()
    for (const c of Object.values(commits)) {
      branchesWithOwnCommits.add(c.branch)
    }

    /* Place nodes */
    const nodeMap: Record<string, LayoutNode> = {}
    sorted.forEach((id, i) => {
      const commit = commits[id]
      const row = branchRow[commit.branch] ?? 0
      const color = getBranchColor(commit.branch)
      nodeMap[id] = {
        id,
        x: START_X + i * NODE_SPACING_X,
        y: START_Y + row * BRANCH_SPACING_Y,
        branch: commit.branch,
        color,
        parentId: commit.parent,
        secondParentId: commit.secondParent,
      }
    })

    const layoutNodes = sorted.map((id) => nodeMap[id])

    /* Build connection lines */
    const layoutLines: { x1: number; y1: number; x2: number; y2: number; color: string; curved: boolean }[] = []
    for (const node of layoutNodes) {
      if (node.parentId && nodeMap[node.parentId]) {
        const parent = nodeMap[node.parentId]
        const isSameBranch = parent.y === node.y
        layoutLines.push({
          x1: parent.x,
          y1: parent.y,
          x2: node.x,
          y2: node.y,
          color: node.color,
          curved: !isSameBranch,
        })
      }
      if (node.secondParentId && nodeMap[node.secondParentId]) {
        const parent2 = nodeMap[node.secondParentId]
        layoutLines.push({
          x1: parent2.x,
          y1: parent2.y,
          x2: node.x,
          y2: node.y,
          color: parent2.color,
          curved: true,
        })
      }
    }

    /* Branch pointers: for branches that fork from a commit but have no own commits yet,
       render a visual fork line + ghost node on the branch's own row */
    const pointers: { forkX: number; forkY: number; tipX: number; tipY: number; name: string; color: string }[] = []
    for (const [bName, commitId] of Object.entries(gitState.branches)) {
      if (!branchesWithOwnCommits.has(bName) && nodeMap[commitId]) {
        const n = nodeMap[commitId]
        const row = branchRow[bName] ?? 0
        const tipY = START_Y + row * BRANCH_SPACING_Y
        /* Only show fork if the branch lives on a different row */
        if (tipY !== n.y) {
          const tipX = n.x + NODE_SPACING_X * 0.6
          pointers.push({
            forkX: n.x,
            forkY: n.y,
            tipX,
            tipY,
            name: bName,
            color: getBranchColor(bName),
          })
          /* Add a curved line from the shared commit to the fork tip */
          layoutLines.push({
            x1: n.x,
            y1: n.y,
            x2: tipX,
            y2: tipY,
            color: getBranchColor(bName),
            curved: true,
          })
        }
      }
    }

    /* Branch labels: placed above the latest commit on each branch,
       or above the fork-tip for branches with no own commits */
    const labels: { x: number; y: number; name: string; color: string }[] = []
    const pointerByBranch = Object.fromEntries(pointers.map((p) => [p.name, p]))
    for (const [bName, commitId] of Object.entries(gitState.branches)) {
      if (pointerByBranch[bName]) {
        const p = pointerByBranch[bName]
        labels.push({
          x: p.tipX,
          y: p.tipY - 52,
          name: bName,
          color: getBranchColor(bName),
        })
      } else if (nodeMap[commitId]) {
        const n = nodeMap[commitId]
        labels.push({
          x: n.x,
          y: n.y - 52,
          name: bName,
          color: getBranchColor(bName),
        })
      }
    }

    /* HEAD info — use fork-tip position for branches with no own commits */
    let head = null
    if (gitState.HEAD.type === "branch") {
      const headBranch = gitState.HEAD.ref
      const headCommitId = gitState.branches[headBranch]
      if (pointerByBranch[headBranch]) {
        const p = pointerByBranch[headBranch]
        head = { x: p.tipX, y: p.tipY, branchName: headBranch, commitId: headCommitId }
      } else if (headCommitId && nodeMap[headCommitId]) {
        const n = nodeMap[headCommitId]
        head = { x: n.x, y: n.y, branchName: headBranch, commitId: headCommitId }
      }
    }

    return { nodes: layoutNodes, lines: layoutLines, branchLabels: labels, headInfo: head, branchPointers: pointers }
  }, [gitState])

  /* Calculate SVG viewBox based on nodes + fork-tip pointers */
  const allXs = [...nodes.map((n) => n.x), ...branchPointers.map((p) => p.tipX)]
  const allYs = [...nodes.map((n) => n.y), ...branchPointers.map((p) => p.tipY)]
  const maxX = allXs.length > 0 ? Math.max(...allXs) + 100 : 400
  const maxY = allYs.length > 0 ? Math.max(...allYs) + 100 : 300

  return (
    <div className="relative min-h-0 flex-1 overflow-auto bg-background p-8">
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${maxX} ${maxY}`}
        preserveAspectRatio="xMinYMid meet"
      >
        {/* Arrow marker definition */}
        <defs>
          <marker id="headArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--text-secondary)" />
          </marker>
        </defs>

        {/* Connection lines */}
        {lines.map((line, i) =>
          line.curved ? (
            <path
              key={`line-${i}`}
              d={`M${line.x1},${line.y1} C${(line.x1 + line.x2) / 2},${line.y1} ${(line.x1 + line.x2) / 2},${line.y2} ${line.x2},${line.y2}`}
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              stroke={line.color}
            />
          ) : (
            <line
              key={`line-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              stroke={line.color}
            />
          )
        )}

        {/* Branch labels */}
        {branchLabels.map((bl) => (
          <BranchLabel
            key={bl.name}
            x={bl.x}
            y={bl.y}
            name={bl.name}
            color={bl.color}
          />
        ))}

        {/* HEAD pointer */}
        {headInfo && (
          <HeadPointer
            x={headInfo.x}
            y={headInfo.y}
            branchName={headInfo.branchName}
          />
        )}

        {/* Commit nodes */}
        {nodes.map((node) => (
          <CommitNode
            key={node.id}
            cx={node.x}
            cy={node.y}
            color={node.color}
            isHead={headInfo?.commitId === node.id && !branchPointers.some((p) => p.name === headInfo?.branchName)}
            hash={node.id}
            message={gitState.commits[node.id].message}
            isNew={node.id === newCommitId}
          />
        ))}

        {/* Fork-tip ghost nodes for branches with no own commits yet */}
        {branchPointers.map((p) => (
          <g key={`fork-${p.name}`} style={{ transformOrigin: `${p.tipX}px ${p.tipY}px` }}>
            {/* Glow ring if HEAD */}
            {headInfo?.branchName === p.name && (
              <circle cx={p.tipX} cy={p.tipY} r={16} fill="none" stroke={p.color} strokeWidth={1} opacity={0.3} />
            )}
            <circle
              cx={p.tipX}
              cy={p.tipY}
              r={10}
              fill={headInfo?.branchName === p.name ? p.color : "var(--bg-surface)"}
              stroke={p.color}
              strokeWidth={2}
              strokeDasharray={headInfo?.branchName === p.name ? "none" : "4 2"}
              style={headInfo?.branchName === p.name ? { filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))" } : undefined}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
