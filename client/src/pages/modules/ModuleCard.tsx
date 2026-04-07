import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Lock } from "lucide-react"

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
  status: ModuleStatus
  image: string
  color: string
  link?: string
  author?: {
    name: string
    github: string
    avatar: string
  }
}

const statusConfig = {
  "in-progress": { label: "Continue", variant: "default" },
  completed: { label: "Review", variant: "outline" },
  "not-started": { label: "Start", variant: "default" },
  locked: { label: "Locked", variant: "outline" },
} as const

export const ModuleCard = ({
  title,
  description,
  progress,
  topics,
  xp,
  status,
  image,
  color,
  link,
  author,
}: ModuleCardProps) => {
  const navigate = useNavigate()
  const ui = statusConfig[status]
  const isLocked = status === "locked"

  return (
    <div
      className={`group relative flex flex-col rounded-xl border border-border bg-(--bg-elevated) transition-all duration-200 hover:border-(--border-hover) hover:shadow-[0_2px_12px_rgba(0,0,0,0.15)] ${isLocked ? "opacity-60" : "cursor-pointer"}`}
      onClick={() => !isLocked && link && navigate(link)}
    >
      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">

        {/* Top row: module image + XP badge */}
        <div className="flex items-center justify-between">
          <img
            src={image}
            alt={title}
            className="h-10 w-10 rounded-lg object-contain"
          />

          <span className="rounded-md bg-[#F59E0B]/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#F59E0B]">
            +{xp} XP
          </span>
        </div>

        {/* Title + description */}
        <div className="mt-3.5">
          <h3 className="font-grotesk text-[15px] font-semibold text-foreground leading-snug">
            {title}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-(--text-secondary) line-clamp-2">
            {description}
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-auto flex items-center gap-3 pt-4 text-[11px] text-(--text-tertiary)">
          <span>{topics} topics</span>
          {progress > 0 && (
            <>
              <span className="h-0.5 w-0.5 rounded-full bg-(--text-tertiary)" />
              <span>{progress}%</span>
            </>
          )}
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <Progress value={progress} className="mt-2 h-0.5" indicatorColor={color} />
        )}
      </div>

      {/* Footer: author + action */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">

        {/* Author */}
        {author ? (
          <a
            href={`https://github.com/${author.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={author.avatar}
              alt={author.name}
              className="h-5 w-5 rounded-full ring-1 ring-border"
            />
            <span className="text-[12px] text-(--text-secondary) font-medium">
              {author.name}
            </span>
          </a>
        ) : (
          <span />
        )}

        {/* Action button */}
        <Button
          variant={ui.variant}
          size="xs"
          disabled={isLocked}
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation()
            if (link) navigate(link)
          }}
        >
          {isLocked ? <Lock size={12} /> : null}
          {ui.label}
          {!isLocked && <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />}
        </Button>
      </div>
    </div>
  )
}