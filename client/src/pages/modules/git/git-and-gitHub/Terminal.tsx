import { useRef, useEffect } from "react"
import TerminalInput from "./TerminalInput"
import "./Terminal.css"

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
    <div className="git-terminal">
      {/* Header */}
      <div className="git-terminal__header">
        <div className="git-terminal__dots">
          <span className="git-terminal__dot git-terminal__dot--red" />
          <span className="git-terminal__dot git-terminal__dot--yellow" />
          <span className="git-terminal__dot git-terminal__dot--green" />
        </div>
        <span className="git-terminal__title">bash — 80×24</span>
      </div>

      {/* Body */}
      <div className="git-terminal__body" ref={bodyRef}>
        {history.map((entry, i) => {
          if (entry.type === "command") {
            return (
              <div key={i} className="terminal-line">
                <span className="terminal-line__user">user@codeking</span>
                <span className="terminal-line__path">&nbsp;~/repo</span>
                <span className="terminal-line__branch">
                  &nbsp;({entry.branch || currentBranch})
                </span>
                <span className="terminal-line__dollar">&nbsp;$&nbsp;</span>
                <span className="terminal-line__command">{entry.text}</span>
              </div>
            )
          }

          /* Output */
          const cls =
            entry.outputType === "success"
              ? "terminal-line__output--success"
              : entry.outputType === "error"
                ? "terminal-line__output--error"
                : ""
          return (
            <div key={i} className={`terminal-line__output ${cls}`}>
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
