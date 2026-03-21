import { useNavigate } from "react-router-dom"
import type { LevelData } from "../git/levels.data"
import difficultyConfig from "./difficultyConfig"
import { ChevronRight, Zap } from "lucide-react"
import { renderGitIcon } from "../git/git-icons"


export function LevelCard({
  level,
  status,
  slug,
}: {
  level: LevelData
  status: "completed" | "current" | "locked"
  slug: string
}) {
  const navigate = useNavigate()
  const diff = difficultyConfig[level.difficulty]
  const isLocked = status === "locked"

  const handleClick = () => {
    if (!isLocked) navigate(`/modules/${slug}/level/${level.id}`)
  }

  return (
    <div
      role={isLocked ? undefined : "button"}
      tabIndex={isLocked ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={`
          bg-(--bg-elevated) rounded-2xl p-4 flex flex-col gap-3 transition-all
          ${status === "completed" ? "border border-green-500/25" : ""}
          ${status === "current" ? "border border-border" : ""}
          ${status === "locked" ? "border border-border opacity-40 cursor-not-allowed" : ""}
          ${status !== "locked" ? "cursor-pointer hover:border-(--border-hover) hover:-translate-y-0.5 hover:shadow-sm" : ""}
        `}
      style={status === "locked" ? {} : undefined}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold text-(--text-secondary) tracking-widest">
          LEVEL {String(level.id).padStart(2, "0")}
        </span>
        {status === "completed" && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-green-500/12 text-green-400">
            ✓ Done
          </span>
        )}
        {status === "current" && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
            Ready
          </span>
        )}
      </div>

      {/* Icon + title */}
      <div className="flex items-start gap-5">
        <span className="mt-0.5 text-(--accent)">{renderGitIcon(level.icon, 18, "text-(--accent)")}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium font-grotesk text-foreground leading-tight">
            {level.title}
          </p>
          <p className="text-xs text-(--text-secondary) mt-0.5 truncate">
            {level.subtitle}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-(--text-secondary)">
            <Zap size={11} className="text-orange-400" />
            +{level.xp} xp
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{ background: diff.bg, color: diff.color }}
          >
            {diff.label}
          </span>
        </div>
        {!isLocked && <ChevronRight size={14} className="text-(--text-secondary)/60" />}
      </div>
    </div>
  )
}
