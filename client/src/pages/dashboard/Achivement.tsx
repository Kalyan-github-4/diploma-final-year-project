import { GitBranch, LayoutGrid, TrendingUp } from "lucide-react"

const badges = [
  {
    title: "Branch Pro",
    color: "#8B5CF6",
    icon: <GitBranch size={20} />
  },
  {
    title: "Layout King",
    color: "#06B6D4",
    icon: <LayoutGrid size={20} />
  },
  {
    title: "Streak Hero",
    color: "#F97316",
    icon: <TrendingUp size={20} />
  }
]

const Achivement = () => {
  return (
    <div className="bg-(--bg-elevated) rounded-3xl border border-border p-6 xl:p-7">
      
      {/* Badge Row */}
      <div className="flex items-center justify-between gap-6">
        {badges.map((badge, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            
            {/* Circular Badge */}
            <div
              className="rounded-full p-4 border-2 shadow-sm transition hover:scale-105"
              style={{
                borderColor: badge.color,
                backgroundColor: badge.color + "15",
                color: badge.color
              }}
            >
              {badge.icon}
            </div>

            <p className="text-xs font-medium text-(--text-secondary) text-center">
              {badge.title}
            </p>

          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-border" />

      {/* Footer */}
      <div className="flex items-center justify-center">
        <p className="text-xs text-(--text-secondary) cursor-pointer hover:text-(--accent)">
          View all 12 badges
        </p>
      </div>

    </div>
  )
}

export default Achivement