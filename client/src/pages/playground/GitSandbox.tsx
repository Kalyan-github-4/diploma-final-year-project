import { useState, useCallback, useRef, useEffect } from "react"
import GitGraph from "@/pages/modules/git/git-and-gitHub/GitGraph"
import Terminal from "@/pages/modules/git/git-and-gitHub/Terminal"
import type { TerminalEntry } from "@/pages/modules/git/git-and-gitHub/Terminal"
import { runGitCommand } from "@/lib/realGit/commandRouter"
import { buildSnapshot, emptySnapshot } from "@/lib/realGit/snapshot"
import { createRepo } from "@/lib/realGit/createRepo"
import type { Snapshot, RepoContext } from "@/lib/realGit/types"
import { RotateCcw, Camera, CheckCheck } from "lucide-react"

const WELCOME_ENTRY: TerminalEntry = {
  type: "output",
  text: "Welcome to the Git Sandbox.\nNo goals, no XP, no pressure — just git.\nType any supported git command to get started.\n",
  outputType: "normal",
}

export default function GitSandbox() {
  const [snapshot, setSnapshot] = useState<Snapshot>(() => emptySnapshot())
  const repoCtxRef = useRef<RepoContext | null>(null)
  const [initialized, setInitialized] = useState(false)
  
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([WELCOME_ENTRY])
  const [inputValue, setInputValue] = useState("")
  const [newCommitId, setNewCommitId] = useState<string | null>(null)
  const [snapshotStatus, setSnapshotStatus] = useState<"idle" | "copied" | "error">("idle")
  const snapshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentBranch =
    snapshot.HEAD.type === "branch" ? snapshot.HEAD.ref : "HEAD"

  const initRepo = useCallback(async () => {
    const ctx = await createRepo("sandbox")
    repoCtxRef.current = ctx
    const snap = await buildSnapshot(ctx)
    setSnapshot(snap)
  }, [])

  useEffect(() => {
    initRepo()
  }, [initRepo])

  /* ─── Submit command ─── */
  const handleSubmit = useCallback(async () => {
    const ctx = repoCtxRef.current
    if (!ctx) return
    const cmd = inputValue.trim()
    if (!cmd) return

    setTerminalHistory((prev) => [
      ...prev,
      { type: "command", text: cmd, branch: currentBranch },
    ])

    const result = await runGitCommand(cmd, ctx)
    // sandbox initializes implicitly when init is called
    if (cmd.startsWith("init") || cmd.startsWith("git init")) {
        setInitialized(true)
    }

    if (result.output) {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "output",
          text: result.output,
          outputType: result.outputType,
        },
      ])
    }

    const prevCommitIds = new Set(Object.keys(snapshot.commits))
    const nextSnap = await buildSnapshot(ctx)
    setSnapshot(nextSnap)

    const newIds = Object.keys(nextSnap.commits).filter((id) => !prevCommitIds.has(id))
    if (newIds.length > 0) {
      setNewCommitId(newIds[0])
      setTimeout(() => setNewCommitId(null), 500)
    }

    setInputValue("")
  }, [inputValue, currentBranch, snapshot.commits])

  /* ─── Reset repository ─── */
  const handleReset = useCallback(() => {
    initRepo().then(() => {
      setInitialized(false)
      setTerminalHistory([
        WELCOME_ENTRY,
        { type: "output", text: "— Repository reset. Fresh start! —\n", outputType: "success" },
      ])
      setInputValue("")
      setNewCommitId(null)
    })
  }, [initRepo])

  /* ─── Save snapshot (copy JSON to clipboard) ─── */
  const handleSaveSnapshot = useCallback(() => {
    const data = {
      version: 1,
      savedAt: new Date().toISOString(),
      snapshot,
    }

    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(
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
  }, [snapshot])

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-(--bg-elevated,#141414)">
      {/* Toolbar */}
      <div className="flex min-h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-white/2 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-xs">
            <span className="size-2 shrink-0 rounded-full bg-(--success,#22C55E)" />
            <span className="text-(--text-secondary)">~/sandbox</span>
            {initialized && (
              <span className="rounded-full border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.15)] px-2.5 py-0.5 text-[11px] text-(--accent,#6366F1)">
                {currentBranch}
              </span>
            )}
            {!initialized && (
              <span className="rounded-full border border-border bg-white/5 px-2.5 py-0.5 text-[11px] text-(--text-tertiary)">
                run \`git init\` to start
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
        <div className="flex min-h-0 overflow-hidden" style={{ flex: "55 1 0%" }}>
          <GitGraph gitState={snapshot} newCommitId={newCommitId} />
        </div>
        <div className="flex min-h-0 overflow-hidden" style={{ flex: "45 1 0%" }}>
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
