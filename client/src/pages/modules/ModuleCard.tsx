import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export type ModuleStatus =
  | "in-progress"
  | "completed"
  | "not-started"
  | "locked"

export type ModuleCardProps = {
  title: string
  description: string
  progress: number
  topics: number
  xp: number
  level: string
  status: ModuleStatus
  icon: React.ReactNode
  color: string
  link?: string
}

const statusStyles = {
  "in-progress": {
    button: "Continue",
    buttonVariant: "secondary",
    progressColor: "bg-orange-500"
  },

  completed: {
    button: "Review",
    buttonVariant: "outline",
    progressColor: "bg-green-500"
  },

  "not-started": {
    button: "Start Module",
    buttonVariant: "default",
    progressColor: "bg-purple-500"
  },

  locked: {
    button: "Unlock",
    buttonVariant: "outline",
    progressColor: "bg-gray-500"
  }
} as const

export const ModuleCard = ({
  title,
  description,
  progress,
  topics,
  xp,
  level,
  status,
  icon,
  color,
  link
}: ModuleCardProps) => {
  const navigate = useNavigate()
  const ui = statusStyles[status]

  return (
    <div className="bg-(--bg-elevated) border border-border rounded-2xl p-6 flex flex-col justify-between transition hover:shadow-md">

      {/* Top */}
      <div className="flex justify-between items-start">

        <div
          className="flex items-center justify-center rounded-2xl h-12 w-12"
          style={{ backgroundColor: `${color}1A`, color: color }}
        >
          {icon}
        </div>

        <div
          className="text-[10px] px-2 py-1 rounded-sm font-medium"
          style={{
            backgroundColor: `${color}1A`,
            color: color
          }}
        >
          {level}
        </div>

      </div>

      {/* Title */}
      <div className="mt-4 space-y-1">
        <h3 className="font-grotesk text-lg font-bold text-foreground">
          {title}
        </h3>

        <p className="font-sans text-sm text-foreground">
          {description}
        </p>
      </div>

      {/* Progress */}
      <div className="mt-4 flex items-center justify-between text-xs font-sans text-(--text-secondary)">
        <span>{progress}% Complete</span>
        <span>{topics} Topics</span>
      </div>

      <Progress value={progress} className="mt-2 h-1" indicatorColor={color} />

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs font-sans text-(--text-secondary)">
        <span>+{xp}xp</span>

        <Button
          variant={ui.buttonVariant}
          size="sm"
          disabled={status === "locked"}
          className="rounded-lg"
          onClick={() => link && navigate(link)}
        >
          {ui.button}
        </Button>
      </div>

    </div>
  )
}