import { useRef, useEffect } from "react"
import TerminalInput from "./TerminalInput"

export interface TerminalEntry {
  type: "command" | "output"
  text: string
  branch?: string
  outputType?: "normal" | "success" | "error"
}

interface TerminalProps {
  history: TerminalEntry[]
  currentBranch: string
  inputValue: string
  onInputChange: (val: string) => void
  onSubmit: () => void
}

export default function Terminal({
  history,
  currentBranch,
  inputValue,
  onInputChange,
  onSubmit,
}: TerminalProps) {
  const bodyRef = useRef<HTMLDivElement>(null)

  /* Auto-scroll to bottom on new entries */
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [history])

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--terminal-bg,#0A0A0A)]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-white/[0.02] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--danger)]" />
          <span className="size-2.5 rounded-full bg-[var(--warning)]" />
          <span className="size-2.5 rounded-full bg-[var(--success)]" />
        </div>
        <span className="ml-2 font-mono text-xs text-[var(--text-tertiary)]">bash — 80×24</span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-[1.7]" ref={bodyRef}>
        {history.map((entry, i) => {
          if (entry.type === "command") {
            return (
              <div key={i} className="break-all whitespace-pre-wrap">
                <span className="text-[var(--success,#22C55E)]">user@codeking</span>
                <span className="text-[var(--text-secondary)]">&nbsp;~/repo</span>
                <span className="text-[var(--accent,#6366F1)]">
                  &nbsp;({entry.branch || currentBranch})
                </span>
                <span className="mx-1 text-[var(--text-primary)]">&nbsp;$&nbsp;</span>
                <span className="text-[var(--text-primary)]">{entry.text}</span>
              </div>
            )
          }

          /* Output */
          const cls =
            entry.outputType === "success"
              ? "text-[var(--success,#22C55E)]"
              : entry.outputType === "error"
                ? "text-[var(--danger,#EF4444)]"
                : ""
          return (
            <div key={i} className={`whitespace-pre-wrap text-[var(--text-secondary)] ${cls}`}>
              {entry.text}
            </div>
          )
        })}
      </div>

      {/* Input */}
      <TerminalInput
        branch={currentBranch}
        value={inputValue}
        onChange={onInputChange}
        onSubmit={onSubmit}
      />
    </div>
  )
}
