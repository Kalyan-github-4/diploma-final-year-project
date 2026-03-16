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
    <div className="progress-circle">
      <svg width={100} height={100} className="progress-circle__svg">
        <circle cx={50} cy={50} r={radius} className="progress-circle__bg" />
        <circle
          cx={50}
          cy={50}
          r={radius}
          className="progress-circle__fill"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text x={50} y={50} className="progress-circle__text">
          {percentage}%
        </text>
      </svg>
      <span className="progress-circle__label">Overall Progress</span>
      <span className="progress-circle__steps">
        {completed} of {total} Steps
      </span>
    </div>
  )
}
