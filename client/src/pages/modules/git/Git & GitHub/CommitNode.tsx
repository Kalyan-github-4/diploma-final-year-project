interface CommitNodeProps {
  cx: number
  cy: number
  color: string
  isHead: boolean
  hash: string
  message: string
  isNew?: boolean
}

export default function CommitNode({
  cx,
  cy,
  color,
  isHead,
  hash,
  message,
  isNew,
}: CommitNodeProps) {
  return (
    <g className={isNew ? "commit-node--enter" : ""} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      {/* Glow ring for HEAD */}
      {isHead && (
        <circle cx={cx} cy={cy} r={16} fill="none" stroke={color} strokeWidth={1} opacity={0.3} />
      )}

      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={10}
        className={isHead ? "commit-node__circle--head" : "commit-node__circle"}
        stroke={color}
        style={isHead ? { fill: color } : undefined}
      />

      {/* Hash label */}
      <text x={cx} y={cy + 28} textAnchor="middle" className="commit-label">
        <tspan className="commit-label__hash">{hash.slice(0, 7)}</tspan>
      </text>

      {/* Message label */}
      <text x={cx} y={cy + 42} textAnchor="middle" className="commit-label">
        ({message})
      </text>
    </g>
  )
}
