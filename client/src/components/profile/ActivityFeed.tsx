import { useMemo, useState } from "react"
import {
  CircleCheckBig,
  Target,
  Flame,
  Trophy,
  Star,
  TrendingUp,
} from "lucide-react"

export interface ActivityItem {
  id: string
  type: "topic" | "challenge" | "streak" | "badge" | "mission" | "level"
  description: string
  xp: number
  timestamp: string
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

const TYPE_ICON = {
  topic: CircleCheckBig,
  challenge: Target,
  streak: Flame,
  badge: Trophy,
  mission: Star,
  level: TrendingUp,
}

function getGroupLabel(timestamp: string) {
  const now = new Date()
  const date = new Date(timestamp)

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const diffMs = today.getTime() - thatDay.getTime()
  const diffDays = Math.round(diffMs / 86400000)

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return thatDay.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  const [limit, setLimit] = useState(20)

  const visibleItems = items.slice(0, limit)

  const grouped = useMemo(() => {
    return visibleItems.reduce<Record<string, ActivityItem[]>>((acc, item) => {
      const key = getGroupLabel(item.timestamp)
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})
  }, [visibleItems])

  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <h2>Recent Activity Feed</h2>
      </div>

      <div className="profile-activity-groups">
        {Object.entries(grouped).map(([group, list]) => (
          <div key={group} className="profile-activity-group">
            <h3 className="profile-subheading">{group}</h3>
            <ul className="profile-activity-list">
              {list.map((item) => {
                const Icon = TYPE_ICON[item.type]
                return (
                  <li key={item.id} className="profile-activity-item">
                    <span className="profile-activity-item__icon">
                      <Icon size={14} />
                    </span>
                    <div className="profile-activity-item__body">
                      <p className="profile-activity-item__description">{item.description}</p>
                      <p className="profile-activity-item__time">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="profile-activity-item__xp">+{item.xp} XP</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {limit < items.length && (
        <button className="profile-btn profile-btn--outline" onClick={() => setLimit((v) => v + 10)}>
          Load more
        </button>
      )}
    </section>
  )
}
