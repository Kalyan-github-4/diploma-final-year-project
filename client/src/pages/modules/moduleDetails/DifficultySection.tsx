/* ── Difficulty Section ───────────────────────────────────── */

import type { LevelData, LevelDifficulty, ModuleProgress } from "../git/levels.data"
import { getLevelStatus, } from "../git/levels.data"
import difficultyConfig from "./difficultyConfig"
import { LevelCard } from "./LevelCard"

export function DifficultySection({
  difficulty,
  levels,
  progress,
  slug,
}: {
  difficulty: LevelDifficulty
  levels: LevelData[]
  progress: ModuleProgress
  slug: string
}) {
  const conf = difficultyConfig[difficulty]
  const completedInGroup = levels.filter((l) =>
    progress.completedLevels.includes(l.id)
  ).length

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full border border-border"
          >
            {conf.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {completedInGroup}/{levels.length}
          </span>
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            status={getLevelStatus(level.id, progress)}
            slug={slug}
          />
        ))}
      </div>
    </div>
  )
}
