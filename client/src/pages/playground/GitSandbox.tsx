import { useState, useCallback, useRef } from "react"
import GitGraph from "@/pages/modules/git/git-and-gitHub/GitGraph"
import Terminal from "@/pages/modules/git/git-and-gitHub/Terminal"
import type { TerminalEntry } from "@/pages/modules/git/git-and-gitHub/Terminal"
import { processCommand } from "@/lib/gitSimulator"
import type { GitState } from "@/lib/gitSimulator"
import { RotateCcw, Camera, CheckCheck } from "lucide-react"

const EMPTY_STATE: GitState = {
  commits: {},
  branches: {},
  HEAD: { type: "branch", ref: "main" },
  staging: [],
  workingDir: [{ name: "README.md", status: "modified" }],
  initialized: false,
}

const WELCOME_ENTRY: TerminalEntry = {
  type: "output",
  text: "Welcome to the Git Sandbox.\nNo goals, no XP, no pressure — just git.\nType any supported git command to get started.\n",
  outputType: "normal",
}

export default function GitSandbox() {
  const [gitState, setGitState] = useState<GitState>(EMPTY_STATE)
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([WELCOME_ENTRY])
  const [inputValue, setInputValue] = useState("")
  const [newCommitId, setNewCommitId] = useState<string | null>(null)
  const [snapshotStatus, setSnapshotStatus] = useState<"idle" | "copied" | "error">("idle")
  const snapshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentBranch =
    gitState.HEAD.type === "branch" ? gitState.HEAD.ref : "HEAD"

  /* ─── Submit command ─── */
  const handleSubmit = useCallback(() => {
    const cmd = inputValue.trim()
    if (!cmd) return

    setTerminalHistory((prev) => [
      ...prev,
      { type: "command", text: cmd, branch: currentBranch },
    ])

    const result = processCommand(cmd, gitState)

    if (result.output) {
      const isError =
        result.output.includes("fatal:") ||
        result.output.includes("error:") ||
        result.output.includes("command not found")
      const isSuccess =
        result.output.includes("Initialized") ||
        result.output.includes("Switched") ||
        result.output.includes("Fast-forward") ||
        result.output.includes("branch")

      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "output",
          text: result.output,
          outputType: isError ? "error" : isSuccess ? "success" : "normal",
        },
      ])
    }

    setGitState(result.newState)

    if (result.graphChanged) {
      const newIds = Object.keys(result.newState.commits).filter(
        (id) => !gitState.commits[id]
      )
      if (newIds.length > 0) {
        setNewCommitId(newIds[0])
        setTimeout(() => setNewCommitId(null), 500)
      }
    }

    setInputValue("")
  }, [inputValue, gitState, currentBranch])

  /* ─── Reset repository ─── */
  const handleReset = useCallback(() => {
    setGitState(EMPTY_STATE)
    setTerminalHistory([
      WELCOME_ENTRY,
      { type: "output", text: "— Repository reset. Fresh start! —\n", outputType: "success" },
    ])
    setInputValue("")
    setNewCommitId(null)
  }, [])

  /* ─── Save snapshot (copy JSON to clipboard) ─── */
  const handleSaveSnapshot = useCallback(() => {
    const snapshot = {
      version: 1,
      savedAt: new Date().toISOString(),
      gitState,
    }

    navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2)).then(
      () => {
        if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current)
        setSnapshotStatus("copied")
        snapshotTimerRef.current = setTimeout(() => setSnapshotStatus("idle"), 3000)
      },
      () => {
        if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current)
        setSnapshotStatus("error")
        snapshotTimerRef.current = setTimeout(() => setSnapshotStatus("idle"), 3000)
      }
    )
  }, [gitState])

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-(--bg-elevated,#141414)">
      {/* Toolbar */}
      <div className="flex min-h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-white/2 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-xs">
            <span className="size-2 shrink-0 rounded-full bg-(--success,#22C55E)" />
            <span className="text-(--text-secondary)">~/sandbox</span>
            {gitState.initialized && (
              <span className="rounded-full border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.15)] px-2.5 py-0.5 text-[11px] text-(--accent,#6366F1)">
                {currentBranch}
              </span>
            )}
            {!gitState.initialized && (
              <span className="rounded-full border border-border bg-white/5 px-2.5 py-0.5 text-[11px] text-(--text-tertiary)">
                run `git init` to start
              </span>
            )}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {snapshotStatus !== "idle" && (
            <span
              className={`pr-1 text-xs font-medium ${
                snapshotStatus === "copied"
                    ? "text-(--success,#22C55E)"
                    : "text-(--danger,#EF4444)"
              }`}
            >
              {snapshotStatus === "copied"
                ? "Snapshot copied to clipboard!"
                : "Could not copy to clipboard."}
            </span>
          )}

          <button
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--accent,#6366F1) hover:text-foreground"
            onClick={handleSaveSnapshot}
            title="Copy the current repo state as JSON to your clipboard"
          >
            {snapshotStatus === "copied" ? (
              <CheckCheck size={14} />
            ) : (
              <Camera size={14} />
            )}
            Save Snapshot
          </button>

          <button
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.08)] px-3 py-1.5 text-xs font-medium text-[#EF4444] transition-colors hover:border-[#EF4444] hover:bg-[rgba(239,68,68,0.18)]"
            onClick={handleReset}
            title="Reset to an empty repository"
          >
            <RotateCcw size={14} />
            Reset Repository
          </button>
        </div>
      </div>

      {/* Graph + Terminal */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-55 overflow-hidden">
          <GitGraph gitState={gitState} newCommitId={newCommitId} />
        </div>
        <div className="flex min-h-0 flex-45 overflow-hidden">
          <Terminal
            history={terminalHistory}
            currentBranch={currentBranch}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
