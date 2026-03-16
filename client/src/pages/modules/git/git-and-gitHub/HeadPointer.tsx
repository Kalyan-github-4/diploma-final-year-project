interface HeadPointerProps {
  x: number
  y: number
  branchName: string
}

export default function HeadPointer({ x, y, branchName }: HeadPointerProps) {
  return (
    <g>
      {/* Arrow line */}
      <line
        x1={x}
        y1={y - 24}
        x2={x}
        y2={y - 14}
        stroke="var(--text-secondary)"
        strokeWidth={1.5}
        markerEnd="url(#headArrow)"
      />

      {/* Label */}
      <text
        x={x}
        y={y - 30}
        textAnchor="middle"
        className="head-pointer__text"
      >
        HEAD → {branchName}
      </text>
    </g>
  )
}
