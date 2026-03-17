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
  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <h2>Activity Heatmap</h2>
      </div>

      <div className="profile-heatmap">
        <div className="profile-heatmap__grid">
          {days.map((day) => {
            const lvl = getLevel(day)
            const title = `${new Date(day.date).toDateString()} · ${day.xp} XP · ${day.topics} topic${
              day.topics === 1 ? "" : "s"
            }`
            return (
              <div
                key={day.date}
                className={`profile-heatmap__cell profile-heatmap__cell--${lvl}`}
                title={title}
              />
            )
          })}
        </div>

        <div className="profile-heatmap__summary">
          <span>{currentStreak} day current streak</span>
          <span>{bestStreak} day best streak</span>
          <span>{activeDays} active days this year</span>
        </div>
      </div>
    </section>
  )
}
