import { Flame, Target, Trophy, Sparkles } from "lucide-react"

export interface QuickStat {
  id: string
  value: string
  label: string
  icon?: "flame" | "target" | "trophy" | "sparkles"
}

const ICON_MAP = {
  flame: Flame,
  target: Target,
  trophy: Trophy,
  sparkles: Sparkles,
}

interface QuickStatsProps {
  stats: QuickStat[]
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <h2>Quick Stats</h2>
      </div>

      <div className="profile-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon ? ICON_MAP[stat.icon] : null
          return (
            <article key={stat.id} className="profile-stat-card">
              <div className="profile-stat-card__value-row">
                <span className="profile-stat-card__value">{stat.value}</span>
                {Icon && <Icon size={16} className="profile-stat-card__icon" />}
              </div>
              <p className="profile-stat-card__label">{stat.label}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
