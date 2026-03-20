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
    <div className="flex items-center px-4 pb-4 font-mono text-[13px]">
      <span className="flex shrink-0 items-center">
        <span className="text-[var(--success,#22C55E)]">user@codeking</span>
        <span className="text-[var(--text-secondary)]">&nbsp;~/repo</span>
        <span className="text-[var(--accent,#6366F1)]">&nbsp;({branch})</span>
        <span className="mx-1 text-[var(--text-primary)]">&nbsp;$&nbsp;</span>
      </span>
      <input
        className="flex-1 border-none bg-transparent p-0 font-mono text-[13px] text-[var(--text-primary)] !outline-none !ring-0 focus:!border-none focus:!outline-none focus:!ring-0 focus-visible:!border-none focus-visible:!outline-none focus-visible:!outline-0 focus-visible:!outline-offset-0 focus-visible:!ring-0 placeholder:text-white/15"
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
