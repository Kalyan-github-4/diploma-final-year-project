interface HintBoxProps {
  hint: string
  onClose: () => void
}

export default function HintBox({ hint, onClose }: HintBoxProps) {
  return (
    <div className="relative rounded-[10px] border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.08)] p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[1px] text-[var(--accent)]">Hint</span>
        <button className="p-0.5 text-base leading-none text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]" onClick={onClose}>
          ×
        </button>
      </div>
      <p className="text-xs leading-[1.6] text-[var(--text-secondary)]">{hint}</p>
    </div>
  )
}
