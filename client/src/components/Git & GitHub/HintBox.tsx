interface HintBoxProps {
  hint: string
  onClose: () => void
}

export default function HintBox({ hint, onClose }: HintBoxProps) {
  return (
    <div className="hint-box">
      <div className="hint-box__header">
        <span className="hint-box__label">Hint</span>
        <button className="hint-box__close" onClick={onClose}>
          ×
        </button>
      </div>
      <p className="hint-box__text">{hint}</p>
    </div>
  )
}
