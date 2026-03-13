import { Progress } from "@/components/ui/progress"
import { GitBranch, LayoutGrid, Terminal } from "lucide-react"

const missions = [
  {
    title: "Create your first branch",
    progress: 60,
    xp: 30,
    status: "Completed",
    color: "#8B5CF6",
    icon: <GitBranch size={18} />
  },
  {
    title: "Build a Flexbox layout challenge",
    progress: 40,
    xp: 50,
    status: "In Progress",
    color: "#06B6D4",
    icon: <LayoutGrid size={18} />
  },
  {
    title: "Navigate folders using terminal",
    progress: 10,
    xp: 20,
    status: "Start Now",
    color: "#F97316",
    icon: <Terminal size={18} />
  }
]

const DailyMission = () => {
  return (
    <div className="space-y-4">
      {missions.map((mission, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-(--bg-elevated) border border-border flex gap-4 items-center"
        >
          {/* Icon */}
          <div
            className="rounded-lg p-2"
            style={{
              backgroundColor: mission.color + "15",
              color: mission.color
            }}
          >
            {mission.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-foreground text-sm truncate font-medium">
              {mission.title}
            </h3>
            <Progress value={mission.progress} className="mt-1 h-1" indicatorColor={mission.color} />
          </div>

          {/* XP + Status */}
          <div className="text-right">
            <p
              className="text-xs font-medium"
              style={{ color: mission.color }}
            >
              +{mission.xp}xp
            </p>
            <p className="text-(--text-secondary) text-xs">
              {mission.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DailyMission