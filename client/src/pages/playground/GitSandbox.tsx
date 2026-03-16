import { useState, useCallback, useRef } from "react"
import GitGraph from "@/pages/modules/git/git-and-gitHub/GitGraph"
import Terminal from "@/pages/modules/git/git-and-gitHub/Terminal"
import type { TerminalEntry } from "@/pages/modules/git/git-and-gitHub/Terminal"
import { processCommand } from "@/lib/gitSimulator"
import type { GitState } from "@/lib/gitSimulator"
import { RotateCcw, Camera, CheckCheck } from "lucide-react"
import "./GitSandbox.css"

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
    <div className="git-sandbox">
      {/* Toolbar */}
      <div className="git-sandbox__toolbar">
        <div className="git-sandbox__toolbar-left">
          <span className="git-sandbox__repo-indicator">
            <span className="git-sandbox__repo-dot" />
            <span className="git-sandbox__repo-path">~/sandbox</span>
            {gitState.initialized && (
              <span className="git-sandbox__branch-pill">{currentBranch}</span>
            )}
            {!gitState.initialized && (
              <span className="git-sandbox__hint-pill">run `git init` to start</span>
            )}
          </span>
        </div>

        <div className="git-sandbox__toolbar-right">
          {snapshotStatus !== "idle" && (
            <span
              className={`git-sandbox__feedback ${
                snapshotStatus === "copied"
                  ? "git-sandbox__feedback--success"
                  : "git-sandbox__feedback--error"
              }`}
            >
              {snapshotStatus === "copied"
                ? "Snapshot copied to clipboard!"
                : "Could not copy to clipboard."}
            </span>
          )}

          <button
            className="git-sandbox__btn git-sandbox__btn--ghost"
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
            className="git-sandbox__btn git-sandbox__btn--danger"
            onClick={handleReset}
            title="Reset to an empty repository"
          >
            <RotateCcw size={14} />
            Reset Repository
          </button>
        </div>
      </div>

      {/* Graph + Terminal */}
      <div className="git-sandbox__workspace">
        <div className="git-sandbox__graph">
          <GitGraph gitState={gitState} newCommitId={newCommitId} />
        </div>
        <div className="git-sandbox__terminal">
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
