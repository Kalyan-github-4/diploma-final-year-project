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
    <g style={{ transformOrigin: `${cx}px ${cy}px` }}>
      {isNew && <circle cx={cx} cy={cy} r={18} fill="none" stroke={color} strokeWidth={1.5} opacity={0.35} />}

      {/* Glow ring for HEAD */}
      {isHead && (
        <circle cx={cx} cy={cy} r={16} fill="none" stroke={color} strokeWidth={1} opacity={0.3} />
      )}

      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={10}
        fill={isHead ? color : "var(--bg-surface)"}
        stroke={color}
        strokeWidth={2}
        style={{ transition: "all 0.3s ease", filter: isHead ? "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))" : undefined }}
      />

      {/* Hash label */}
      <text
        x={cx}
        y={cy + 28}
        textAnchor="middle"
        fill="var(--text-secondary)"
        fontFamily="JetBrains Mono, monospace"
        fontSize={10}
      >
        <tspan>{hash.slice(0, 7)}</tspan>
      </text>

      {/* Message label */}
      <text
        x={cx}
        y={cy + 42}
        textAnchor="middle"
        fill="var(--text-tertiary)"
        fontFamily="JetBrains Mono, monospace"
        fontSize={10}
      >
        ({message})
      </text>
    </g>
  )
}
