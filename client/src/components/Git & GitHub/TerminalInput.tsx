import "./Terminal.css"

interface TerminalInputProps {
  branch: string
  value: string
  onChange: (val: string) => void
  onSubmit: () => void
}

export default function TerminalInput({
  branch,
  value,
  onChange,
  onSubmit,
}: TerminalInputProps) {
  return (
    <div className="terminal-input">
      <span className="terminal-input__prompt">
        <span className="terminal-line__user">user@codeking</span>
        <span className="terminal-line__path">&nbsp;~/repo</span>
        <span className="terminal-line__branch">&nbsp;({branch})</span>
        <span className="terminal-line__dollar">&nbsp;$&nbsp;</span>
      </span>
      <input
        className="terminal-input__field"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit()
        }}
        placeholder="Type a git command..."
        autoFocus
        spellCheck={false}
      />
    </div>
  )
}
