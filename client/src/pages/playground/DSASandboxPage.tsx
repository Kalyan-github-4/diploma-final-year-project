import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Binary, ChevronsRight, Gauge, GitBranch, Layers, ListOrdered, Pause, Play, RotateCcw, Route, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DSAAlgorithm, DSAStep, ComplexityMeta } from "@/types/dsa.types"
import { DSAVisualizer } from "@/pages/modules/dsa/components/DSAVisualizer"
import { DSAReferenceCode } from "@/pages/modules/dsa/components/DSAReferenceCode"

import { BINARY_SEARCH_COMPLEXITY, BINARY_SEARCH_REFERENCE_CODE, generateBinarySearchSteps } from "@/lib/algorithms/binarySearch"
import { BUBBLE_SORT_COMPLEXITY, BUBBLE_SORT_REFERENCE_CODE, generateBubbleSortSteps } from "@/lib/algorithms/bubbleSort"
import { BFS_COMPLEXITY, BFS_REFERENCE_CODE, generateBFSSteps } from "@/lib/algorithms/bfs"
import { STACK_COMPLEXITY, STACK_REFERENCE_CODE, generateStackSteps, parseStackOps } from "@/lib/algorithms/stack"
import { QUEUE_COMPLEXITY, QUEUE_REFERENCE_CODE, generateQueueSteps, parseQueueOps } from "@/lib/algorithms/queue"
import { DIJKSTRA_COMPLEXITY, DIJKSTRA_REFERENCE_CODE, DIJKSTRA_NODES, DIJKSTRA_EDGES, buildAdjacencyList, generateDijkstraSteps } from "@/lib/algorithms/dijkstra"

/* ── Algorithm metadata ─────────────────────────────────── */

const TOPIC_OPTIONS: { value: DSAAlgorithm; label: string; icon: typeof Binary; color: string }[] = [
  { value: "binary-search", label: "Binary Search", icon: Binary, color: "#6366F1" },
  { value: "bubble-sort", label: "Bubble Sort", icon: ListOrdered, color: "#F97316" },
  { value: "bfs", label: "BFS", icon: GitBranch, color: "#22C55E" },
  { value: "stack", label: "Stack", icon: Layers, color: "#EAB308" },
  { value: "queue", label: "Queue", icon: ListOrdered, color: "#06B6D4" },
  { value: "dijkstra", label: "Dijkstra", icon: Route, color: "#EC4899" },
]

const DEFAULTS: Record<DSAAlgorithm, { array: string; target: string; ops: string }> = {
  "binary-search": { array: "2, 5, 8, 12, 16, 23, 38", target: "23", ops: "" },
  "bubble-sort": { array: "64, 34, 25, 12, 22, 11, 90", target: "", ops: "" },
  bfs: { array: "", target: "", ops: "" },
  stack: { array: "", target: "", ops: "push 5, push 3, push 8, push 1, pop, pop, push 6, pop" },
  queue: { array: "", target: "", ops: "enqueue 5, enqueue 3, enqueue 8, enqueue 1, dequeue, dequeue, enqueue 6, dequeue" },
  dijkstra: { array: "", target: "", ops: "" },
}

/* ── Helpers ─────────────────────────────────────────────── */

function parseArray(raw: string): number[] | null {
  const v = raw.split(",").map((s) => s.trim()).filter(Boolean).map(Number)
  return v.length && v.every((n) => !Number.isNaN(n)) ? v : null
}

function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) if (arr[i - 1] > arr[i]) return false
  return true
}

interface RunResult {
  steps: DSAStep[]
  resultLabel: string
  complexity: ComplexityMeta
  referenceCode: string[]
}

function run(
  alg: DSAAlgorithm,
  arrayInput: string,
  targetInput: string,
  startNode: string,
  opsInput: string,
  customNodes?: string[],
  customEdges?: [string, string, number][],
): { result: RunResult; error: null } | { result: null; error: string } {
  if (alg === "binary-search") {
    const arr = parseArray(arrayInput)
    if (!arr) return { result: null, error: "Enter a valid comma-separated number list." }
    if (!isSorted(arr)) return { result: null, error: "Binary Search requires an ascending sorted array." }
    const target = Number(targetInput.trim())
    if (Number.isNaN(target)) return { result: null, error: "Target must be a valid number." }
    const { steps, resultIndex } = generateBinarySearchSteps({ array: arr, target })
    return { result: { steps, resultLabel: resultIndex >= 0 ? `Found at index ${resultIndex}` : "Not found", complexity: BINARY_SEARCH_COMPLEXITY, referenceCode: BINARY_SEARCH_REFERENCE_CODE }, error: null }
  }
  if (alg === "bubble-sort") {
    const arr = parseArray(arrayInput)
    if (!arr) return { result: null, error: "Enter a valid comma-separated number list." }
    const { steps, resultArray } = generateBubbleSortSteps({ array: arr })
    return { result: { steps, resultLabel: `Sorted: [${resultArray.join(", ")}]`, complexity: BUBBLE_SORT_COMPLEXITY, referenceCode: BUBBLE_SORT_REFERENCE_CODE }, error: null }
  }
  if (alg === "bfs") {
    const { steps, visitedOrder } = generateBFSSteps({ startNode })
    return { result: { steps, resultLabel: `Visited: ${visitedOrder.join(" → ")}`, complexity: BFS_COMPLEXITY, referenceCode: BFS_REFERENCE_CODE }, error: null }
  }
  if (alg === "dijkstra") {
    const nodes = customNodes ?? DIJKSTRA_NODES
    const edges = customEdges ?? DIJKSTRA_EDGES
    const graph = buildAdjacencyList(edges)
    const { steps, shortestDistances } = generateDijkstraSteps({ startNode, nodes, edges, graph })
    return { result: { steps, resultLabel: `Shortest: ${Object.entries(shortestDistances).map(([n, d]) => `${n}=${d === 9999 ? "∞" : d}`).join(", ")}`, complexity: DIJKSTRA_COMPLEXITY, referenceCode: DIJKSTRA_REFERENCE_CODE }, error: null }
  }
  if (alg === "stack") {
    const ops = opsInput.trim() ? parseStackOps(opsInput) : undefined
    if (opsInput.trim() && !ops) return { result: null, error: "Invalid format. Use: push 5, push 3, pop" }
    const { steps, finalItems } = generateStackSteps(ops ?? undefined)
    return { result: { steps, resultLabel: `Final stack: [${finalItems.join(", ") || "empty"}]`, complexity: STACK_COMPLEXITY, referenceCode: STACK_REFERENCE_CODE }, error: null }
  }
  if (alg === "queue") {
    const ops = opsInput.trim() ? parseQueueOps(opsInput) : undefined
    if (opsInput.trim() && !ops) return { result: null, error: "Invalid format. Use: enqueue 5, dequeue" }
    const { steps, finalItems } = generateQueueSteps(ops ?? undefined)
    return { result: { steps, resultLabel: `Final queue: [${finalItems.join(", ") || "empty"}]`, complexity: QUEUE_COMPLEXITY, referenceCode: QUEUE_REFERENCE_CODE }, error: null }
  }
  return { result: null, error: "Unknown algorithm." }
}

/* ── Component ───────────────────────────────────────────── */

export default function DSASandboxPage() {
  const navigate = useNavigate()

  const [algorithm, setAlgorithm] = useState<DSAAlgorithm>("binary-search")
  const [arrayInput, setArrayInput] = useState(DEFAULTS["binary-search"].array)
  const [targetInput, setTargetInput] = useState(DEFAULTS["binary-search"].target)
  const [startNode, setStartNode] = useState("A")
  const [opsInput, setOpsInput] = useState("")
  const [inputError, setInputError] = useState<string | null>(null)

  // Dijkstra custom graph state
  const [djNodes, setDjNodes] = useState<string[]>([...DIJKSTRA_NODES])
  const [djEdges, setDjEdges] = useState<[string, string, number][]>([...DIJKSTRA_EDGES])
  const [newNodeName, setNewNodeName] = useState("")
  const [edgeFrom, setEdgeFrom] = useState("")
  const [edgeTo, setEdgeTo] = useState("")
  const [edgeWeight, setEdgeWeight] = useState("")

  const [runResult, setRunResult] = useState<RunResult | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(900)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const steps = runResult?.steps ?? []
  const maxStep = Math.max(steps.length - 1, 0)
  const currentStep = steps[Math.min(stepIndex, maxStep)]
  const stepNumber = Math.min(stepIndex + 1, steps.length)
  const pct = steps.length > 0 ? Math.round((stepNumber / steps.length) * 100) : 0

  /* ── Run algorithm ──────────────────────────────────── */

  const handleRun = useCallback(() => {
    const out = run(algorithm, arrayInput, targetInput, startNode, opsInput, djNodes, djEdges)
    if (out.error) { setInputError(out.error); return }
    setInputError(null)
    setRunResult(out.result)
    setStepIndex(0)
    setIsPlaying(true)
  }, [algorithm, arrayInput, targetInput, startNode, opsInput, djNodes, djEdges])

  const handleStartNodeChange = useCallback((node: string) => {
    setStartNode(node)
    const out = run(algorithm, arrayInput, targetInput, node, opsInput, djNodes, djEdges)
    if (out.error) return
    setInputError(null)
    setRunResult(out.result)
    setStepIndex(0)
    setIsPlaying(true)
  }, [algorithm, arrayInput, targetInput, opsInput, djNodes, djEdges])

  /* ── Reset on algorithm change ──────────────────────── */

  // Track previous algorithm to clear stale results synchronously (before render)
  const prevAlgRef = useRef(algorithm)
  if (algorithm !== prevAlgRef.current) {
    prevAlgRef.current = algorithm
    // Clear immediately so DSAVisualizer never sees a mismatched snapshot
    setRunResult(null)
    setStepIndex(0)
    setIsPlaying(false)
  }

  useEffect(() => {
    setInputError(null)

    const d = DEFAULTS[algorithm]
    setArrayInput(d.array)
    setTargetInput(d.target)
    setOpsInput(d.ops)
    setStartNode("A")

    // Reset Dijkstra graph to defaults when switching algorithms
    if (algorithm === "dijkstra") {
      setDjNodes([...DIJKSTRA_NODES])
      setDjEdges([...DIJKSTRA_EDGES])
    }

    // Load defaults but don't auto-play — let the user press Run / Play
    const out = run(algorithm, d.array, d.target, "A", d.ops)
    if (!out.error) {
      setRunResult(out.result)
      setStepIndex(0)
    }
  }, [algorithm])

  /* ── Playback timer ─────────────────────────────────── */

  useEffect(() => {
    if (!isPlaying || !steps.length) return
    if (stepIndex >= maxStep) { setIsPlaying(false); return }
    timerRef.current = setTimeout(() => {
      setStepIndex((p) => {
        const next = Math.min(p + 1, maxStep)
        if (next >= maxStep) setIsPlaying(false)
        return next
      })
    }, speedMs)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isPlaying, stepIndex, speedMs, maxStep, steps.length])

  const isOpsAlg = algorithm === "stack" || algorithm === "queue"

  return (
    <div className="flex min-h-full flex-col gap-3 pb-6">
      {/* ── Header bar ─────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-xl border border-(--card-border) bg-card px-4 py-3">
        {/* Top row: back + speed + playback */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate("/playground")}
            className="inline-flex items-center gap-1.5 text-[13px] text-(--text-secondary) transition hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Playground
          </button>

          <div className="h-5 w-px bg-(--border-subtle)" />

          <span className="text-[13px] font-semibold text-foreground font-grotesk">DSA Sandbox</span>

          <div className="ml-auto flex items-center gap-2">
            <Select value={String(speedMs)} onValueChange={(v) => setSpeedMs(Number(v))}>
              <SelectTrigger className="h-8 min-w-24 rounded-lg border-border bg-background text-[12px] text-foreground shadow-none hover:border-(--border-hover)">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1200">
                  <span className="inline-flex items-center gap-1.5"><Gauge className="size-3.5" /> Slow</span>
                </SelectItem>
                <SelectItem value="900">
                  <span className="inline-flex items-center gap-1.5"><Gauge className="size-3.5" /> Normal</span>
                </SelectItem>
                <SelectItem value="600">
                  <span className="inline-flex items-center gap-1.5"><Gauge className="size-3.5" /> Fast</span>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => { setStepIndex(0); setIsPlaying(false) }}>
                <RotateCcw className="size-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => setStepIndex((p) => Math.max(0, p - 1))}>
                <SkipBack className="size-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => setIsPlaying((p) => !p)} disabled={!steps.length}>
                {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              </Button>
              <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => setStepIndex((p) => Math.min(p + 1, maxStep))}>
                <SkipForward className="size-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => { setStepIndex(maxStep); setIsPlaying(false) }}>
                <ChevronsRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Algorithm tabs */}
        <div className="flex flex-wrap gap-2">
          {TOPIC_OPTIONS.map(({ value, label, icon: Icon, color }) => {
            const isActive = algorithm === value
            return (
              <button
                key={value}
                onClick={() => setAlgorithm(value)}
                className={[
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-all duration-150",
                  isActive
                    ? "border-transparent font-semibold text-white shadow-sm"
                    : "border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:border-(--border-hover) hover:text-foreground",
                ].join(" ")}
                style={isActive ? { backgroundColor: color, borderColor: color } : undefined}
              >
                <Icon size={15} />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Main area ──────────────────────────────────── */}
      <div className="grid min-h-[480px] flex-1 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Left: Visualization + Reference Code */}
        <div className="flex min-h-0 flex-col gap-3">
          {currentStep ? (
            <DSAVisualizer
              currentStep={currentStep}
              algorithm={algorithm}
              predictOverlayResult={null}
              isPredictOverlayVisible={false}
              activePredictQuestion={null}
              predictAnswered={false}
              onSubmitPredictAnswer={() => {}}
              predictOverlayMessage={null}
            />
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-(--card-border) bg-card p-3 text-[13px] text-(--text-tertiary)">
              Configure inputs and click Run to visualize.
            </div>
          )}

          {runResult && (
            <div className="min-h-0 flex-1">
              <DSAReferenceCode
                referenceCode={runResult.referenceCode}
                activeCodeLine={currentStep?.codeLine ?? 0}
                mode="watch"
                editorCode=""
                onEditorCodeChange={() => {}}
                onRunCode={() => {}}
                runDisabled
              />
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <aside className="flex min-h-0 flex-col gap-3.5 overflow-y-auto rounded-xl border border-(--card-border) bg-card p-3 [&_h4]:m-0 [&_h4]:text-xs [&_h4]:uppercase [&_h4]:tracking-[0.04em] [&_h4]:text-foreground [&_h4]:font-grotesk [&_p]:m-0 [&_p]:text-[13px] [&_p]:text-(--text-secondary)">
          {/* Custom Input */}
          <div className="flex flex-col gap-1.5">
            <h4>Custom Input</h4>

            {algorithm === "dijkstra" ? (
              <>
                {/* ── Nodes ── */}
                <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground font-grotesk">Nodes</p>
                <div className="flex flex-wrap gap-1.5">
                  {djNodes.map((node) => (
                    <span
                      key={node}
                      className="inline-flex items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-2 py-1 text-[12px] font-semibold text-foreground font-grotesk"
                    >
                      {node}
                      <button
                        type="button"
                        onClick={() => {
                          setDjNodes((prev) => prev.filter((n) => n !== node))
                          setDjEdges((prev) => prev.filter(([a, b]) => a !== node && b !== node))
                          if (startNode === node) setStartNode(djNodes.find((n) => n !== node) ?? "")
                        }}
                        className="ml-0.5 text-[10px] text-(--text-tertiary) hover:text-(--danger)"
                        title={`Remove ${node}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <Input
                    className="h-8 flex-1 rounded-lg border-border bg-background px-2 text-[12px] text-foreground uppercase"
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3))}
                    placeholder="e.g. G"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const name = newNodeName.trim()
                        if (name && !djNodes.includes(name)) {
                          setDjNodes((prev) => [...prev, name])
                          setNewNodeName("")
                        }
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-lg text-[12px]"
                    disabled={!newNodeName.trim() || djNodes.includes(newNodeName.trim())}
                    onClick={() => {
                      const name = newNodeName.trim()
                      if (name && !djNodes.includes(name)) {
                        setDjNodes((prev) => [...prev, name])
                        setNewNodeName("")
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                {/* ── Edges ── */}
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-foreground font-grotesk">Edges</p>
                <div className="flex max-h-32 flex-col gap-1 overflow-y-auto">
                  {djEdges.map(([a, b, w], i) => (
                    <div key={`${a}-${b}-${w}-${i}`} className="flex items-center justify-between rounded-lg border border-(--border-subtle) bg-(--bg-surface) px-2 py-1 text-[11px] text-(--text-secondary) font-grotesk">
                      <span>{a} → {b} <span className="text-(--text-tertiary)">(w={w})</span></span>
                      <button
                        type="button"
                        onClick={() => setDjEdges((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-[10px] text-(--text-tertiary) hover:text-(--danger)"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {djEdges.length === 0 && <span className="text-[11px] text-(--text-tertiary)">No edges yet</span>}
                </div>
                <div className="grid grid-cols-[1fr_1fr_0.6fr_auto] gap-1.5">
                  <Select value={edgeFrom} onValueChange={setEdgeFrom}>
                    <SelectTrigger className="h-8 rounded-lg text-[11px]"><SelectValue placeholder="From" /></SelectTrigger>
                    <SelectContent>{djNodes.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={edgeTo} onValueChange={setEdgeTo}>
                    <SelectTrigger className="h-8 rounded-lg text-[11px]"><SelectValue placeholder="To" /></SelectTrigger>
                    <SelectContent>{djNodes.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input
                    className="h-8 rounded-lg border-border bg-background px-2 text-[11px] text-foreground"
                    type="number"
                    min={1}
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(e.target.value)}
                    placeholder="Wt"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-lg text-[11px]"
                    disabled={!edgeFrom || !edgeTo || edgeFrom === edgeTo || !edgeWeight || Number(edgeWeight) <= 0}
                    onClick={() => {
                      const w = Number(edgeWeight)
                      if (edgeFrom && edgeTo && edgeFrom !== edgeTo && w > 0) {
                        setDjEdges((prev) => [...prev, [edgeFrom, edgeTo, w]])
                        setEdgeFrom("")
                        setEdgeTo("")
                        setEdgeWeight("")
                      }
                    }}
                  >
                    +
                  </Button>
                </div>

                {/* ── Start node ── */}
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-foreground font-grotesk">Start Node</p>
                <div className="flex flex-wrap gap-1.5">
                  {djNodes.map((node) => (
                    <button
                      key={node}
                      type="button"
                      onClick={() => setStartNode(node)}
                      className={[
                        "inline-flex h-8 w-8 items-center justify-center rounded-lg border text-[13px] font-bold font-grotesk transition-all duration-150",
                        startNode === node
                          ? "border-(--accent) bg-[color-mix(in_oklab,var(--accent)_22%,var(--bg-surface))] text-(--accent)"
                          : "border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:border-(--border-hover) hover:text-foreground",
                      ].join(" ")}
                    >
                      {node}
                    </button>
                  ))}
                </div>

                {inputError && <p className="text-[hsl(0_75%_55%)]">{inputError}</p>}

                <div className="mt-1 flex gap-2">
                  <Button className="h-9 flex-1 rounded-lg border border-border bg-(--accent) text-[13px] font-semibold text-white hover:opacity-95" onClick={handleRun}>
                    Run Dijkstra
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 rounded-lg text-[12px]"
                    onClick={() => {
                      setDjNodes([...DIJKSTRA_NODES])
                      setDjEdges([...DIJKSTRA_EDGES])
                      setStartNode("A")
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </>
            ) : algorithm === "bfs" ? (
              <>
                <p>Choose start node:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["A", "B", "C", "D", "E", "F"].map((node) => (
                    <button
                      key={node}
                      type="button"
                      onClick={() => handleStartNodeChange(node)}
                      className={[
                        "inline-flex h-8 w-8 items-center justify-center rounded-lg border text-[13px] font-bold font-grotesk transition-all duration-150",
                        startNode === node
                          ? "border-(--accent) bg-[color-mix(in_oklab,var(--accent)_22%,var(--bg-surface))] text-(--accent)"
                          : "border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:border-(--border-hover) hover:text-foreground",
                      ].join(" ")}
                    >
                      {node}
                    </button>
                  ))}
                </div>
              </>
            ) : isOpsAlg ? (
              <>
                <label className="text-[11px] text-foreground font-grotesk">Operations</label>
                <textarea
                  className="min-h-20 w-full resize-y rounded-lg border border-border bg-background px-2.5 py-2 font-mono text-[12px] text-foreground outline-none focus:border-(--accent)"
                  value={opsInput}
                  onChange={(e) => setOpsInput(e.target.value)}
                  placeholder={algorithm === "stack" ? "push 5, push 3, pop, push 8" : "enqueue 5, enqueue 3, dequeue"}
                />
                {inputError && <p className="text-[hsl(0_75%_55%)]">{inputError}</p>}
                <Button className="mt-0.5 h-9 rounded-lg border border-border bg-(--accent) text-[13px] font-semibold text-white hover:opacity-95" onClick={handleRun}>
                  Run
                </Button>
              </>
            ) : (
              <>
                <label className="text-[11px] text-foreground font-grotesk">
                  Array{algorithm === "binary-search" ? " (ascending)" : ""}
                </label>
                <Input
                  className="h-9 rounded-lg border-border bg-background px-2.5 text-[13px] text-foreground"
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  placeholder={algorithm === "binary-search" ? "2, 5, 8, 12, 16" : "64, 34, 25, 12"}
                />
                {algorithm === "binary-search" && (
                  <>
                    <label className="text-[11px] text-foreground font-grotesk">Target</label>
                    <Input
                      className="h-9 rounded-lg border-border bg-background px-2.5 text-[13px] text-foreground"
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      placeholder="23"
                    />
                  </>
                )}
                {inputError && <p className="text-[hsl(0_75%_55%)]">{inputError}</p>}
                <Button className="mt-0.5 h-9 rounded-lg border border-border bg-(--accent) text-[13px] font-semibold text-white hover:opacity-95" onClick={handleRun}>
                  Run
                </Button>
              </>
            )}
          </div>

          {/* Progress */}
          {steps.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h4>Progress</h4>
              <p>Step {stepNumber} / {steps.length}</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--bg-surface)">
                <motion.div className="h-full rounded-full bg-(--accent)" animate={{ width: `${pct}%` }} transition={{ duration: 0.2 }} />
              </div>
            </div>
          )}

          {/* Current Step */}
          {currentStep && (
            <div className="flex flex-col gap-1.5">
              <h4>Current Step</h4>
              <p>{currentStep.description}</p>
            </div>
          )}

          {/* Result */}
          {runResult && (
            <div className="flex flex-col gap-1.5">
              <h4>Result</h4>
              <p>{runResult.resultLabel}</p>
            </div>
          )}

          {/* Complexity */}
          {runResult && (
            <div className="flex flex-col gap-1.5">
              <h4>Complexity</h4>
              <p>Best: {runResult.complexity.timeBest}</p>
              <p>Average: {runResult.complexity.timeAverage}</p>
              <p>Worst: {runResult.complexity.timeWorst}</p>
              <p>Space: {runResult.complexity.space}</p>
              {runResult.complexity.note && <p className="text-[12px]">{runResult.complexity.note}</p>}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
