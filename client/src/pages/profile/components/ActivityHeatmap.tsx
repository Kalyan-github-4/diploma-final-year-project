interface HeatmapDay {
  date: string
  xp: number
  topics: number
}

interface ActivityHeatmapProps {
  days: HeatmapDay[]
  currentStreak: number
  bestStreak: number
  activeDays: number
}

function getLevel(day: HeatmapDay) {
  if (day.xp === 0) return 0
  if (day.xp <= 40) return 1
  if (day.xp <= 80) return 2
  if (day.xp <= 140) return 3
  return 4
}

export default function ActivityHeatmap({
  days,
  currentStreak,
  bestStreak,
  activeDays,
}: ActivityHeatmapProps) {
  const levelClass = {
    0: "bg-[rgba(255,255,255,0.06)]",
    1: "[background:color-mix(in_srgb,var(--accent,#6366f1)_25%,transparent)]",
    2: "[background:color-mix(in_srgb,var(--accent,#6366f1)_45%,transparent)]",
    3: "[background:color-mix(in_srgb,var(--accent,#6366f1)_70%,transparent)]",
    4: "bg-[var(--accent,#6366f1)]",
  } as const

  return (
    <section className="rounded-xl border border-border p-4.5 [background:var(--bg-elevated,#141414)]">
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-grotesk text-[18px] font-bold text-foreground">
          Activity Heatmap
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="grid w-fit grid-flow-col grid-cols-[repeat(52,10px)] grid-rows-[repeat(7,10px)] gap-0.75">
          {days.map((day) => {
            const lvl = getLevel(day)
            const title = `${new Date(day.date).toDateString()} · ${day.xp} XP · ${day.topics} topic${
              day.topics === 1 ? "" : "s"
            }`
            return (
              <div
                key={day.date}
                className={`h-2.5 w-2.5 rounded-xs border border-[rgba(255,255,255,0.05)] ${levelClass[lvl]}`}
                title={title}
              />
            )
          })}
        </div>

        <div className="mt-2.5 flex flex-wrap gap-3.5 text-[12px] text-(--text-tertiary)">
          <span>{currentStreak} day current streak</span>
          <span>{bestStreak} day best streak</span>
          <span>{activeDays} active days this year</span>
        </div>
      </div>
    </section>
  )
}
