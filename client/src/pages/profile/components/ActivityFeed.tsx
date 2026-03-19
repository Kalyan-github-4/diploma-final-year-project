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
    <section className="rounded-xl border border-border p-4.5 [background:var(--bg-elevated,#141414)]">
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-['Space_Grotesk',sans-serif] text-[18px] font-bold text-foreground">
          Recent Activity Feed
        </h2>
      </div>

      <div>
        {Object.entries(grouped).map(([group, list], index) => (
          <div key={group} className={index > 0 ? "mt-3.5" : undefined}>
            <h3 className="mb-2.5 font-['Space_Grotesk',sans-serif] text-[14px] font-semibold text-foreground">
              {group}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {list.map((item) => {
                const Icon = TYPE_ICON[item.type]
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-2.5 rounded-[10px] border border-border p-2.5"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(99,102,241,0.12)] text-(--accent,#6366f1)">
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px]">{item.description}</p>
                      <p className="text-[11px] text-(--text-tertiary)">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="font-['Space_Grotesk',sans-serif] text-[12px] font-bold text-(--accent,#6366f1)">
                      +{item.xp} XP
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {limit < items.length && (
        <button
          type="button"
          className="mt-3 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 py-2 text-[13px] font-semibold text-(--text-secondary)"
          onClick={() => setLimit((v) => v + 10)}
        >
          Load more
        </button>
      )}
    </section>
  )
}
