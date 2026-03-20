interface ProgressCircleProps {
  percentage: number
  completed: number
  total: number
}

export default function ProgressCircle({
  percentage,
  completed,
  total,
}: ProgressCircleProps) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={100} height={100} className="-rotate-90">
        <circle cx={50} cy={50} r={radius} fill="none" stroke="var(--border-subtle)" strokeWidth={6} />
        <circle
          cx={50}
          cy={50}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={6}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text
          x={50}
          y={50}
          fill="var(--accent)"
          fontFamily="JetBrains Mono, monospace"
          fontSize={20}
          fontWeight={700}
          textAnchor="middle"
          dominantBaseline="central"
          transform="rotate(90 50 50)"
        >
          {percentage}%
        </text>
      </svg>
      <span className="text-xs text-[var(--text-secondary)]">Overall Progress</span>
      <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
        {completed} of {total} Steps
      </span>
    </div>
  )
}
