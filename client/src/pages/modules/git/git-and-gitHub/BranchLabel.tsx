interface BranchLabelProps {
  x: number
  y: number
  name: string
  color: string
}

export default function BranchLabel({ x, y, name, color }: BranchLabelProps) {
  const padding = 8
  const textWidth = name.length * 7.5 + padding * 2

  return (
    <g>
      <rect
        x={x - textWidth / 2}
        y={y - 10}
        width={textWidth}
        height={20}
        rx={6}
        ry={6}
        fill={color}
        opacity={0.15}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fill={color}
        fontFamily="JetBrains Mono, monospace"
        fontSize={11}
        fontWeight={600}
      >
        {name}
      </text>
    </g>
  )
}
